import { parseFinanceObject } from "./currencies";
import {
	CurrencyObject,
	DateTuple,
	ActiveFinanceObject,
	storedFinanceObject,
} from "./interfaces";

function last(array: any[]) {
	return array[array.length - 1];
}

function calculatePercent(dividend: number, divisor: number): number {
	const num = dividend / divisor;
	return num * 100;
}

function decimalConv(num: string): number {
	const numArr: string[] = num.split("");
	if (numArr.includes(",")) {
		const i = numArr.indexOf(",");
		numArr[i] = ".";
		num = numArr.join("");
	}
	return parseFloat(num) * 100;
}

function max(array: number[]): number {
	let max = 0;
	for (let item of array) {
		if (item > max) max = item;
	}
	return max;
}

function dateToLocale(date: DateTuple): string[] {
	return date.map((day) => new Date(day).toLocaleDateString());
}

function constructEmptyFinance(
	currency: CurrencyObject,
	date = new Date().toLocaleDateString("en-CA")
): ActiveFinanceObject {
	return parseFinanceObject(
		{
			income: 0,
			balance: 0,
			spending: 0,
			date: date,
			limit: 0,
		},
		currency
	);
}

function getPastDate(history: storedFinanceObject[], days: number): DateTuple {
	// RenderGraph method in History will respond with error message if
	// shortcut goest too far into the past
	if (days > history.length) return ["invalid", "invalid"];
	const startDate = history[history.length - days].date;
	const endDate = last(history).date;

	return [startDate, endDate];
}

function timeDiffInDays(day1: string, day2: string): number {
	const msDay: number = 86400000;
	const dateObjects: [Date, Date] = [new Date(day1), new Date(day2)];
	const [a, b] = dateObjects;
	const day1Utc: number = Date.UTC(
		a.getFullYear(),
		a.getMonth(),
		a.getDate()
	);
	const day2Utc: number = Date.UTC(
		b.getFullYear(),
		b.getMonth(),
		b.getDate()
	);

	return Math.floor((day2Utc - day1Utc) / msDay);
}

function financeToIntConv(obj: ActiveFinanceObject): storedFinanceObject {
	const intObj = {
		income: obj.income.intValue,
		balance: obj.balance.intValue,
		spending: obj.spending.intValue,
		date: obj.date,
		limit: obj.limit?.intValue || 0,
	};

	return intObj;
}

function validateNumericalInput(str: string): boolean {
	const validChars = /^[\d]*[.,]?[\d]*$/;
	if (str === "" || str.match(validChars)) {
		return true;
	} else return false;
}

export {
	last,
	calculatePercent,
	decimalConv,
	max,
	dateToLocale,
	constructEmptyFinance,
	getPastDate,
	timeDiffInDays,
	financeToIntConv,
	validateNumericalInput,
};
