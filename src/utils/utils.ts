import { FinanceTuple } from "./interfaces";

export function last(array: string[]): string {
    return array[array.length - 1];
}

export function calculatePercent(dividend: number, divisor: number): number {
    const num = dividend / divisor;
    return num * 100;
}

export function max(array: number[] | FinanceTuple): number {
    let max = 0;
    for (let item of array) {
        if (item > max) max = item;
    }
    return max;
}
