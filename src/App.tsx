import { useCallback, useState, useEffect } from "react"
import './App.css'

import { getConnection, InitDB } from "@/duckdb.ts";

import {Header} from "@/components/Header.tsx"
import {FilterPanel} from "@/components/FilterPanel.tsx"
import {TradeupList} from "@/components/TradeupList.tsx"

function GetTradeupIdentifier(tradeup: Tradeup) {
    let id = tradeup.skin1.name

    if (tradeup.skin2 && tradeup.skin1.name !== tradeup.skin2.name)
        id += ' x ' + tradeup.skin2.name

    return id
}

function App() {
    // Filters
    const [sortIncreasingly, setSortIncreasingly] = useState<boolean>(true)
    const [weaponNameFilter, setWeaponNameFilter] = useState<string>("")
    const [filter, setFilter] = useState<string | null>(null)
    const [profitableOnly, setProfitableOnly] = useState<boolean>(true)

    useEffect(() => {
        (async () => {
            const conn = await getConnection()
            await InitDB(conn);
            const res = await conn.query(`SELECT COUNT(*) AS count FROM tradeups.contracts`)
            console.log(res.get(0)!.count)
        })()
    }, []);

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
                             sortIncreasingly={sortIncreasingly} setSortIncreasingly={setSortIncreasingly}
                             filter={filter} setFilter={setFilter} profitableOnly={profitableOnly}
                             setProfitableOnly={setProfitableOnly} />
                <TradeupList tradeupData={{}} />
            </div>
            <p className='sticky bottom-0 p-3 pt-8 bg-linear-0 from-background to-transparent'>Made by m4tex</p>
        </>
    )
}

export default App
