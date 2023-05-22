import { FC, useState, useEffect } from "react";
import RenderGraph from "./Graph";
import { parseFinanceObject, curr } from "../utils/currencies";
import {
    CurrencyObject,
    ActiveFinanceObject,
    storedFinanceObject,
    GraphText,
} from "../utils/interfaces";
import {
    constructEmptyFinance,
    decimalConv,
    timeDiffInDays,
    last,
} from "../utils/utils";
import "../styles/daily.css";

interface DailyProps {
    history: storedFinanceObject[];
    addToHistory: (
        income: number,
        spending: number,
        balance: number,
        date: string
    ) => void;
    currency: CurrencyObject;
}

const Daily: FC<DailyProps> = (props) => {
    const { history, addToHistory, currency } = props;

    const [daily, setDaily] = useState<ActiveFinanceObject>(
        constructEmptyFinance(currency)
    );

    const { income, balance, spending, date } = daily;

    const [input, setInput] = useState<string>("");

    useEffect(() => {
        if (date === "") {
            const storedValues: storedFinanceObject = JSON.parse(
                localStorage.getItem("daily") || "null"
            );
            if (storedValues)
                setDaily(parseFinanceObject(storedValues, currency));
        } else {
            localStorage.setItem(
                "daily",
                JSON.stringify({
                    income: income.intValue,
                    balance: balance.intValue,
                    spending: spending.intValue,
                    date: date,
                })
            );
        }
    }, [daily]);

    function handleClick(id: string): void {
        if (input) {
            if (id === "add-btn") {
                setDaily((prevDaily) => ({
                    ...prevDaily,
                    income: prevDaily.income.add(decimalConv(input)),
                    balance: prevDaily.balance.add(decimalConv(input)),
                }));
            } else if (id === "subtract-btn") {
                setDaily((prevDaily) => ({
                    ...prevDaily,
                    spending: prevDaily.spending.add(decimalConv(input)),
                    balance: prevDaily.balance.subtract(decimalConv(input)),
                }));
            }
        }
        setInput("");
    }

    function newDay(): void {
        const timeDiff = history ? timeDiffInDays(date, last(history).date) : 1;
        // When more than 1 day has passed since last use fill history with
        // dummy days with balance kept as is for the sake of history calculations
        if (timeDiff > 1) {
            // To make sure that the dates are generated correctly and because states update slow
            // and we can't rely on them to be updated before another loop round begins
            // I decided to first have a loop to generate the correct dates and then another
            // loop to actually commit them to history state
            const missingDates: string[] = [];
            let prevDay: Date;
            for (let i = 1; i < timeDiff - 1; i++) {
                i === 1
                    ? (prevDay = new Date(last(history).date))
                    : (prevDay = new Date(last(missingDates)));
                const newDay: number = new Date().setTime(
                    prevDay.getTime() + 86400000
                );
                missingDates.push(new Date(newDay).toLocaleDateString("en-CA"));
            }
            for (const date of missingDates) {
                addToHistory(0, 0, last(history).balance, date);
            }
        }
        // Add current day
        addToHistory(
            income.intValue,
            spending.intValue,
            balance.intValue,
            date
        );
        setDaily((prevDaily) => ({
            ...prevDaily,
            income: curr(0, currency),
            spending: curr(0, currency),
            date: new Date().toLocaleDateString("en-CA"),
        }));
    }

    useEffect(() => {
        if (date && new Date().toLocaleDateString("en-CA") > date) {
            newDay();
        } else if (!date && !localStorage.getItem("daily")) {
            setDaily((prevDaily) => ({
                ...prevDaily,
                date: new Date().toLocaleDateString("en-CA"),
            }));
        }
    }, [daily]);

    const graphTextDaily: GraphText = {
        income: "Daily income",
        balance: "Total balance",
        spending: "Daily spending",
    };

    const formattedDateDaily = {
        ...daily,
        date: new Date(date).toLocaleDateString(),
    };

    return (
        <section className="daily">
            <RenderGraph
                data={formattedDateDaily}
                currency={currency}
                graphText={graphTextDaily}
            />
            <input
                placeholder="Change balance"
                aria-label="Change balance"
                className="daily-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            ></input>
            <div className="button-container">
                <button
                    className="daily-btn"
                    id="add-btn"
                    onClick={(e) => handleClick(e.currentTarget.id)}
                >
                    Add
                </button>
                <button
                    className="daily-btn"
                    id="subtract-btn"
                    onClick={(e) => handleClick(e.currentTarget.id)}
                >
                    Subtract
                </button>
            </div>
        </section>
    );
};

export default Daily;
