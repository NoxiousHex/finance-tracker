import currency from "currency.js";

interface storedFinanceObject {
    spending: number;
    income: number;
    balance: number;
    date: string;
}

interface ActiveFinanceObject {
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

type FinanceLiteral = "income" | "balance" | "spending";

type Route = "intro" | "daily" | "history" | "settings";

type DateTuple = readonly [string, string];

export type {
    storedFinanceObject,
    ActiveFinanceObject,
    DateRange,
    CurrencySymbol,
    CurrencyObject,
    GraphText,
    FinanceLiteral,
    Route,
    DateTuple,
};
