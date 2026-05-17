import {useState} from "react";
import './App.css';

import {Header} from "@/components/Header.tsx";
import {FilterPanel} from "@/components/FilterPanel.tsx";
import {TradeupList} from "@/components/TradeupList.tsx";

import {useAsyncEffectChain} from "../Utils.ts";
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

    interface TradeupFilters {
        weaponName: string;


    }

    const [filters, setFilters] = useState<>([]);

    const [sortDecreasingly, setSortDecreasingly] = useState<boolean>(true);
    const [weaponNameFilter, setWeaponNameFilter] = useState<string>("");
    const [filter, setFilter] = useState<string>('profit_percentage');
    const [profitableOnly, setProfitableOnly] = useState<boolean>(true);

    const [tradeupData, setTradeupData] = useState<Tradeup[] | null>(null);

    const sortOrder = sortDecreasingly ? 'DESC' : 'ASC';

    const {conn, ready} = useDuckDb();

    useAsyncEffectChain(
        [
            async () => { // First step is the main filter
                if (!ready || !conn) return;

                setTradeupData(null);

                await conn.query(`DELETE
                                  FROM catalog`);

                // Discard tradeups with the same skins that have worse profit and only keep the best one to minimize clutter
                await conn.query(`
                    INSERT INTO catalog
                    SELECT *
                    FROM tradeups.contracts QUALIFY ROW_NUMBER() OVER
                            (PARTITION BY skin1,skin2 ORDER BY profit DESC NULLS LAST) = 1`);
            }, [filter, ready]
        ], [
            async () => { // Now filter by skin name (if filtering by skin name)
                if (!ready || !conn) return;


                await conn.query(`DELETE
                                  FROM filteredCatalog`);
                const prepared = await conn.prepare(`
                    INSERT INTO filteredCatalog
                    SELECT *
                    FROM catalog
                    WHERE skin1 ILIKE '%' || $1 || '%'
                       OR skin2 ILIKE '%' || $1 || '%'
                `);
                await prepared.query(weaponNameFilter);
            },
            [weaponNameFilter]
        ], [
            async () => { // Finally sort order before displaying
                if (!ready || !conn) return;

                // Get page count
                const countTable = await conn.query(`SELECT COUNT(*) as count
                                                     FROM filteredCatalog`);
                const filteredCount = countTable.get(0)!.count;

                setPageCount(Math.ceil(Number(filteredCount) / tradeupsPerPage));

                const tradeups = await conn.query(`
                    SELECT *
                    FROM filteredCatalog
                    ORDER BY profit ${sortOrder} NULLS LAST 
                            LIMIT ${tradeupsPerPage}
                    OFFSET ${(page - 1) * tradeupsPerPage}
                `);

                setTradeupData(tradeups.toArray().map(row => row.toJSON()));
            }, [setTradeupData, page, sortOrder]
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
                <FilterPanel weaponNameFilter={weaponNameFilter} setWeaponNameFilter={setWeaponNameFilter}
                             sortDecreasingly={sortDecreasingly} setSortDecreasingly={setSortDecreasingly}
                             filter={filter} setFilter={setFilter} profitableOnly={profitableOnly}
                             setProfitableOnly={setProfitableOnly}/>
                <TradeupList tradeupData={tradeupData}/>
                <Pagination page={page} setPage={setPage} pageCount={pageCount}/>
            </div>
            <p className="sticky bottom-0 p-3 pt-4 bg-linear-0 from-background to-transparent">Made by m4tex</p>
        </>
    );
}

export default App;
