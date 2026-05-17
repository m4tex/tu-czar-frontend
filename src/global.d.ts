interface Skin {
    name: string;
    rarity: number;
    souvenir: boolean;
    stattrak: boolean;
    min_float: number;
    max_float: number;
    prices: number[5];
    prices_st: number[5];
}

interface Tradeup {
    id: number;
    profit: number;

    skin1: string;
    skin2?: string;
    skin1count: number;
    skin2count?: number;
    skin1minAvg: number;
    skin2minAvg?: number;
    skin1maxAvg: number;
    skin2maxAvg?: number;
}