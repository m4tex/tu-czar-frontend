interface TradeupStats {
    profitFactor: number
}

interface Skin {
    name: string
    rarity: number
    souvenir: boolean
    stattrak: boolean
    min_float: number
    max_float: number
    prices: number[5]
    prices_st: number[5]
}

interface TradeupConfig {
    skin1: Skin
    skin2?: Skin
    skin1slots: number
    skin2slots?: number
    skin1minAvg: number
    skin2minAvg?: number
}

type TradeupEntry = [TradeupStats, TradeupConfig]