import currency from "currency.js";

export interface SpendingHistory {
    spending: currency;
    income: currency;
    balance: currency;
    date: string;
}

export type FinanceTuple = readonly [number, number, number];
