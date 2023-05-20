import currency from "currency.js";
import {
    CurrencyObject,
    DailyBalance,
    GraphTuple,
    SpendingHistory,
} from "./interfaces";

function parseObjectToCurr(
    obj: DailyBalance,
    currencyData: CurrencyObject
): DailyBalance {
    const currencyObj = Object.fromEntries(
        Object.entries(obj).map(([key, value]) =>
            typeof value === "number"
                ? [key, currency(value, currencyData)]
                : [key, value]
        )
    );
    return currencyObj;
}

function curr(value: number, currencyData: CurrencyObject): currency {
    const val = currency(value, currencyData);
    return val;
}

const EUR: CurrencyObject = {
    fromCents: true,
    precision: 2,
    separator: " ",
    decimal: ",",
    symbol: "€",
};

const USD: CurrencyObject = {
    fromCents: true,
    precision: 2,
    separator: ",",
    decimal: ".",
    symbol: "$",
};

const GBP: CurrencyObject = {
    fromCents: true,
    precision: 2,
    separator: ",",
    decimal: ".",
    symbol: "£",
};

export { EUR, USD, GBP, curr, parseObjectToCurr };
