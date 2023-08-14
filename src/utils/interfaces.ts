import currency from "currency.js";
import { CurrencySymbol } from "./enums";

interface storedFinanceObject {
	spending: number;
	income: number;
	balance: number;
	date: string;
	limit?: number;
}

interface ActiveFinanceObject {
	income: currency;
	balance: currency;
	spending: currency;
	date: string;
	limit?: currency;
}

interface DateRange {
	startDate: string;
	endDate: string;
}

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

interface ErrorObject {
	render: boolean;
	message: string;
}

type DateTuple = readonly [string, string];

export type {
	storedFinanceObject,
	ActiveFinanceObject,
	DateRange,
	CurrencySymbol,
	CurrencyObject,
	GraphText,
	DatabaseConfig,
	ErrorObject,
	DateTuple,
};
