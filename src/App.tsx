import {useCallback, useEffect, useState} from "react"
import './App.css'

import { Header } from "@/components/Header.tsx"
import { FilterPanel } from "@/components/FilterPanel.tsx"
import { TradeupList } from "@/components/TradeupList.tsx"
import { useQuery, getConnection } from "@/duckdb.ts";

function GetTradeupIdentifier(tradeup: Tradeup) {
    let id = tradeup.skin1.name

    if (tradeup.skin2 && tradeup.skin1.name !== tradeup.skin2.name)
        id += ' x ' + tradeup.skin2.name

    return id
}

/** TODO
 * Add filters - tolerance to closeness to float cap and tolerance to closeness to wear threshold
 * Blacklist for problematic skins
 * A budget filter, with a slider for certainty
 */

const tradeupsPerPage = 50

function App() {
    const [page, setPage] = useState(0)

    const [tradeupIDs, tradeupIDsLoading] = useQuery(`SELECT * FROM catalog LIMIT ${tradeupsPerPage} OFFSET ${page*tradeupsPerPage}`)

    // useMemo for organized data

    // Filters
    const [sortDecreasingly, setSortDecreasingly] = useState<boolean>(true)
    const [weaponNameFilter, setWeaponNameFilter] = useState<string>("")
    const [filter, setFilter] = useState<string | null>(null)
    const [profitableOnly, setProfitableOnly] = useState<boolean>(true)

    useEffect(() => {
        (async () => {
            const con = await getConnection()
            const sortOrder = sortDecreasingly ? 'DESC' : 'ASC'

            await con.query(`INSERT INTO catalog SELECT id FROM tradeups.contracts QUALIFY ROW_NUMBER() OVER (PARTITION BY skin1,skin2 ORDER BY profit DESC NULLS LAST) = 1 ORDER BY profit ${sortOrder} NULLS LAST`)
        })()
    }, [sortDecreasingly, weaponNameFilter, filter, profitableOnly])

    const [tradeupData, setTradeupData] = useState<unknown | null>(null)

    const selectFilterValue = useCallback((tradeup: Tradeup) => {
        if (filter === 'profit_percentage')
            return tradeup.profitFactor

        return 0
    }, [filter])

    return (
        <>
            <div className='flex flex-col gap-4'>
                <Header />
                <FilterPanel weaponNameFilter={weaponNameFilter} setWeaponNameFilter={setWeaponNameFilter}
                             sortIncreasingly={sortDecreasingly} setSortIncreasingly={setSortDecreasingly}
                             filter={filter} setFilter={setFilter} profitableOnly={profitableOnly}
                             setProfitableOnly={setProfitableOnly} />
                <TradeupList tradeupData={{}} />
            </div>
            <p className='sticky bottom-0 p-3 pt-8 bg-linear-0 from-background to-transparent'>Made by m4tex</p>
        </>
    )
}

export default App
