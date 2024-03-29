import currency from "currency.js";
import {
	CurrencyObject,
	ActiveFinanceObject,
	storedFinanceObject,
} from "./interfaces";

function parseFinanceObject(
	obj: storedFinanceObject,
	currencyData: CurrencyObject
): ActiveFinanceObject {
	const currencyObj = {
		...obj,
		income: currency(obj.income, currencyData),
		balance: currency(obj.balance, currencyData),
		spending: currency(obj.spending, currencyData),
		limit: currency(obj.limit || 0, currencyData),
	};
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

export { parseFinanceObject, curr, EUR, USD, GBP };
