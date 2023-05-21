import { parseFinanceObject } from "./currencies";
import {
    CurrencyObject,
    DateTuple,
    FinanceLiteral,
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

function CalcAverage(array: any[], type: FinanceLiteral): number {
    let reducedAmount = 0;
    if (type === "income") {
        reducedAmount = array.reduce((a, b) => a + b.income, 0);
    } else if (type === "balance") {
        reducedAmount = array.reduce((a, b) => a + b.balance, 0);
    } else if (type === "spending") {
        reducedAmount = array.reduce((a, b) => a + b.spending, 0);
    }

    return reducedAmount / array.length;
}

function dateToLocale(date: DateTuple): string[] {
    return date.map((day) => new Date(day).toLocaleDateString());
}

function constructEmptyFinance(currency: CurrencyObject): ActiveFinanceObject {
    return parseFinanceObject(
        { income: 0, balance: 0, spending: 0, date: "" },
        currency
    );
}

function getPastDate(history: storedFinanceObject[], days: number): DateTuple {
    if (days > history.length) return ["null", "null"];
    const startDate = history[history.length - days].date;
    const endDate = last(history).date;

    return [startDate, endDate];
}

export {
    last,
    calculatePercent,
    decimalConv,
    max,
    CalcAverage,
    dateToLocale,
    constructEmptyFinance,
    getPastDate,
};
