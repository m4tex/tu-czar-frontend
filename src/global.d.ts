interface Skin {
    name: string;
    rarity: number;
    rarityColor: string;
    image: string;
    souvenir: boolean;
    stattrak: boolean;
    min_float: number;
    max_float: number;
    prices: number[5];
    prices_st?: number[5];
    prices_souv?: number[5];
    signals: string[5];
    signals_st?: number[5];
    signals_souv?: number[5];
}

interface Tradeup {
    id: number;
    profit: number;
    cost: number;
    type: number;

    skin1: string;
    skin2?: string;
    skin1count: number;
    skin2count?: number;
    skin1minAvg: number;
    skin2minAvg?: number;
    skin1maxAvg: number;
    skin2maxAvg?: number;
}

interface TradeupFilters {
    weaponName: string;
    sortCriteria: string;
    sortDecreasingly: boolean;
    profitableOnly: boolean;
    collapseByWeapon: boolean;
    weaponBlacklist: string[];
}