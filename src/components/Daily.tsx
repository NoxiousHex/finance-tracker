import { FC, useState, useEffect } from "react";
import RenderGraph from "./Graph";
import { curr, parseObjectToCurr } from "../utils/currencies";
import {
    CurrencyObject,
    DailyBalance,
    SpendingHistory,
} from "../utils/interfaces";
import { decimalConv } from "../utils/utils";
import "../styles/daily.css";

interface IProps {
    addToHistory: (
        income: number,
        spending: number,
        balance: number,
        date: string
    ) => void;
    currency: CurrencyObject;
}

const Daily: FC<IProps> = (props) => {
    const { addToHistory, currency } = props;

    const [daily, setDaily] = useState<DailyBalance>(
        parseObjectToCurr(
            {
                income: 0,
                balance: 0,
                spending: 0,
                date: "",
            },
            currency
        )
    );

    console.log(daily.income);

    const { income, balance, spending, date } = daily;

    const [input, setInput] = useState<string>("0");
    // curr(storedValues.income, currency)
    useEffect(() => {
        if (date === "") {
            const storedValues: SpendingHistory = JSON.parse(
                localStorage.getItem("daily") || ""
            );
            if (storedValues)
                setDaily(parseObjectToCurr(storedValues, currency));
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
        console.log(id);
        if (input > "0") {
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
    }

    function newDay(): void {
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
            console.log("It's a new day");
            newDay();
        } else {
            setDaily((prevDaily) => ({
                ...prevDaily,
                date: new Date().toLocaleDateString("en-CA"),
            }));
        }
    }, []);

    const graphTextDaily = {
        income: "Daily income",
        balance: "Total balance",
        spending: "Daily spending",
    };

    return (
        <section className="daily">
            <RenderGraph
                graphTuple={[income, balance, spending]}
                date={[date]}
                currency={currency}
                graphText={graphTextDaily}
            />
            <input
                placeholder="Change balance"
                aria-label="Change balance"
                className="daily-input"
                onChange={(e) => setInput(e.target.value)}
            ></input>
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
        </section>
    );
};

export default Daily;
