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
	id?: string;
}

interface GraphText {
	income: string;
	balance: string;
	spending: string;
}

interface DatabaseConfig {
	apiKey: string;
	authDomain: string;
	projectId: string;
	storageBucket: string;
	messagingSenderId: string;
	appId: string;
}

type FinanceLiteral = "income" | "balance" | "spending";

type Route = "daily" | "history" | "settings";

type Mode = "average" | "cummulative";

type DateTuple = readonly [string, string];

export type {
	storedFinanceObject,
	ActiveFinanceObject,
	DateRange,
	CurrencySymbol,
	CurrencyObject,
	GraphText,
	DatabaseConfig,
	FinanceLiteral,
	Route,
	Mode,
	DateTuple,
};
