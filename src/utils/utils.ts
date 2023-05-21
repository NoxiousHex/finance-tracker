import { DateTuple, FinanceLiteral } from "./interfaces";

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

export { last, calculatePercent, decimalConv, max, CalcAverage, dateToLocale };
