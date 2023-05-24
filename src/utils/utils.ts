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
    // discount 0s so they don't bring down the average
    let nullNum = 0;
    if (type === "income") {
        reducedAmount = array.reduce((a, b) => a + b.income, 0);
        array.filter((el) => el.income === 0).length;
    } else if (type === "balance") {
        reducedAmount = array.reduce((a, b) => a + b.balance, 0);
        nullNum = array.filter((el) => el.balance === 0).length;
    } else if (type === "spending") {
        reducedAmount = array.reduce((a, b) => a + b.spending, 0);
        nullNum = array.filter((el) => el.spending === 0).length;
    }

    const validEls = array.length - nullNum;
    return reducedAmount / validEls;
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
        },
        currency
    );
}

function getPastDate(history: storedFinanceObject[], days: number): DateTuple {
    if (days > history.length) return ["null", "null"];
    const startDate = history[history.length - days].date;
    const endDate = last(history).date;

    return [startDate, endDate];
}

function timeDiffInDays(day1: string, day2: string): number {
    const msDay: number = 86400000;
    const dateObjects: [Date, Date] = [new Date(day1), new Date(day2)];
    const [a, b] = dateObjects;
    const day1Utc: number = Date.UTC(a.getFullYear(), a.getMonth(), a.getDay());
    const day2Utc: number = Date.UTC(b.getFullYear(), b.getMonth(), b.getDay());

    return Math.floor((day2Utc - day1Utc) / msDay);
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
    timeDiffInDays,
};
