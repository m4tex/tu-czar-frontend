import {type ChangeEvent, useMemo, useState} from "react"
import './App.css'

import {Header} from "@/components/Header.tsx"
import {FilterPanel} from "@/components/FilterPanel.tsx"
import {TradeupList} from "@/components/TradeupList.tsx"

function App() {
    const [data, setData] = useState<TradeupEntry[]>([])

    // Filters
    const [sortIncreasingly, setSortIncreasingly] = useState<boolean>(true)
    const [weaponNameFilter, setWeaponNameFilter] = useState<string>("")
    const [filter, setFilter] = useState<string | null>(null);

    const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const text = await file.text()
        const json = JSON.parse(text)

        setData(json)
        console.log(json)
    }

    const selectFilterValue = (entry: TradeupEntry) => {
        const stats = entry[0]

        if (filter === 'profit_percentage')
            return stats.profitFactor

        return 0
    }

    const filteredData = useMemo<TradeupEntry[]>(() => {
        const name = weaponNameFilter.toLowerCase()
        return data.filter(entry => entry[1].skin1.name.toLowerCase().includes(name) ||
            entry[1].skin2 && entry[1].skin2.name.toLowerCase().includes(name)).toSorted(
                (a, b) => sortIncreasingly ?
                    selectFilterValue(a) - selectFilterValue(b) :
                    selectFilterValue(b) - selectFilterValue(a)
        )
    }, [selectFilterValue, data, sortIncreasingly, weaponNameFilter])

    return (
    <>
        <Header onFileChange={handleFile} />
        <FilterPanel weaponNameFilter={weaponNameFilter} setWeaponNameFilter={setWeaponNameFilter}
            sortIncreasingly={sortIncreasingly} setSortIncreasingly={setSortIncreasingly}
               filter={filter} setFilter={setFilter} />
        <TradeupList tradeups={filteredData} />
    </>
    )
}

export default App
