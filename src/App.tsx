import {useState} from "react";
import './App.css';

import {Header} from "@/components/Header.tsx";
import {FilterPanel} from "@/components/FilterPanel.tsx";
import {TradeupList} from "@/components/TradeupList.tsx";

import {useCheckpointPipeline} from "../Utils.ts";
import {useDuckDb} from "@/DuckDBHooks.ts";
import {Pagination} from "@/components/Pagination.tsx";

/** TODO
 * Add filters - tolerance to closeness to float cap and tolerance to closeness to wear threshold
 * Blacklist for problematic skins
 * A budget filter, with a slider for certainty
 * Simulation graph
 * Handle interrupts on async chain
 */

const tradeupsPerPage = 50;

function App() {
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);

    // useMemo for organized data

    const [filters, setFilters] = useState<TradeupFilters>({
        weaponName: "",
        sortCriteria: "profit_percentage",
        sortDecreasingly: true,
        profitableOnly: true,
        collapseByWeapon: true,
        weaponBlacklist: ["UMP-45 | Minotaur's Labyrinth"],
    });

    const {
        weaponName: weaponNameFilter,
        sortCriteria,
        sortDecreasingly,
        profitableOnly,
        collapseByWeapon,
        weaponBlacklist
    } = filters;

    const [tradeupData, setTradeupData] = useState<Tradeup[] | null>(null);

    const sortOrder = sortDecreasingly ? 'DESC' : 'ASC';

    const {conn, ready} = useDuckDb();

    useCheckpointPipeline(ready && !!conn,
        [
            async () => { // First step is the main filter
                setTradeupData(null);

                await conn!.query(`DELETE FROM catalog`);

                const dedupeQuery = `
                    INSERT INTO catalog
                    SELECT *
                    FROM tradeups.contracts QUALIFY ROW_NUMBER() OVER
                            (PARTITION BY skin1,skin2 ORDER BY profit DESC NULLS LAST) = 1`;

                const selectiveCollapseQuery = `WITH dedup AS (
                    SELECT *
                    FROM (
                             SELECT *,
                                    ROW_NUMBER() OVER (PARTITION BY skin1, skin2 ORDER BY profit DESC NULLS LAST) AS rn_pair
                             FROM tradeups.contracts
                         )
                    WHERE rn_pair = 1
                ),
                filtered AS (
                    SELECT *
                    FROM dedup d1
                    WHERE NOT EXISTS (
                        SELECT 1
                        FROM dedup d2
                        WHERE d1.skin2 = d2.skin1
                    )
                ),
                top3 AS (
                    SELECT *
                    FROM (
                             SELECT *,
                                    ROW_NUMBER() OVER (PARTITION BY skin1 ORDER BY profit DESC NULLS LAST) AS rn_skin1
                              FROM filtered
                         )
                    WHERE rn_skin1 <= 3
                )
                INSERT INTO catalog (id, profit, cost, type, skin1, skin2, skin1count, skin2count, skin1minAvg, skin2minAvg, skin1maxAvg, skin2maxAvg)
                SELECT id, profit, cost, type, skin1, skin2, skin1count, skin2count, skin1minAvg, skin2minAvg, skin1maxAvg, skin2maxAvg
                    FROM top3`;

                // Discard tradeups with the same skins that have worse profit and only keep the best one to minimize clutter
                await conn!.query(collapseByWeapon ? selectiveCollapseQuery : dedupeQuery);
            }, [sortCriteria, collapseByWeapon, ready]
        ], [
            async () => { // Now filter by skin name (if filtering by skin name)
                await conn!.query(`DELETE
                                   FROM filteredCatalog`);

                const expandedBlacklist = "[" + weaponBlacklist.map(w => "$$" + w + "$$").join(', ') + "]";

                const prepared = await conn!.prepare(`
                    INSERT INTO filteredCatalog
                    SELECT *
                    FROM catalog
                    WHERE (skin1 ILIKE '%' || $1 || '%'
                       OR skin2 ILIKE '%' || $1 || '%')
                        AND skin1 NOT IN ${expandedBlacklist} 
                        AND skin2 NOT IN ${expandedBlacklist}
                `);
                await prepared.query(weaponNameFilter);
            },
            [weaponNameFilter, weaponBlacklist]
        ], [
            async () => { // Finally sort order before displaying
                // Get page count
                const countTable = await conn!.query(`SELECT COUNT(*) as count
                                                      FROM filteredCatalog`);
                const filteredCount = countTable.get(0)!.count;

                setPageCount(Math.ceil(Number(filteredCount) / tradeupsPerPage));

                const whereProfitable = profitableOnly ? 'WHERE profit > 1' : '';

                const tradeups = await conn!.query(`
                    SELECT *
                    FROM filteredCatalog ${whereProfitable}
                    ORDER BY profit ${sortOrder} NULLS LAST 
                            LIMIT ${tradeupsPerPage}
                    OFFSET ${(page - 1) * tradeupsPerPage}
                `);

                setTradeupData(tradeups.toArray().map(row => row.toJSON()));

            }, [setTradeupData, page, sortOrder, profitableOnly]
        ]
    );

    // const selectFilterValue = useCallback((tradeup: Tradeup) => {
    //     if (filter === 'profit_percentage')
    //         return tradeup.profit
    //
    //     return 0
    // }, [filter])

    return (
        <>
            <div className="flex flex-col gap-4">
                <Header/>
                <FilterPanel filters={filters} setFilters={setFilters}/>
                <TradeupList tradeupData={tradeupData}/>
                <Pagination page={page} setPage={setPage} pageCount={pageCount}/>
            </div>
            <p className="sticky bottom-0 p-3 pt-4 bg-linear-0 from-background to-transparent">Made by m4tex</p>
        </>
    );
}

export default App;
