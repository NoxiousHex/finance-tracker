import currency from "currency.js";

interface SpendingHistory {
    spending: number;
    income: number;
    balance: number;
    date: string;
}

interface DailyBalance {
    income: currency;
    balance: currency;
    spending: currency;
    date: string;
}

interface DateRange {
    startDate: string;
    endDate: string;
}

type CurrencySymbol = "€" | "£" | "$";

interface CurrencyObject {
    fromCents: boolean;
    precision: 2;
    separator: "," | " ";
    decimal: "." | ",";
    symbol: CurrencySymbol;
}

interface GraphText {
    income: string;
    balance: string;
    spending: string;
}

type GraphTuple = readonly [currency, currency, currency];

type FinanceLiteral = "income" | "balance" | "spending";

type Route = "intro" | "daily" | "history" | "settings";

type DateTuple = readonly [string] | readonly [string, string];

export type {
    SpendingHistory,
    DailyBalance,
    DateRange,
    CurrencySymbol,
    CurrencyObject,
    GraphText,
    GraphTuple,
    FinanceLiteral,
    Route,
    DateTuple,
};
