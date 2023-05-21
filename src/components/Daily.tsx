import { FC, useState, useEffect } from "react";
import RenderGraph from "./Graph";
import { parseObjectToCurr, curr } from "../utils/currencies";
import {
    CurrencyObject,
    ActiveFinanceObject,
    storedFinanceObject,
} from "../utils/interfaces";
import { decimalConv } from "../utils/utils";
import "../styles/daily.css";

interface DailyProps {
    addToHistory: (
        income: number,
        spending: number,
        balance: number,
        date: string
    ) => void;
    currency: CurrencyObject;
}

const Daily: FC<DailyProps> = (props) => {
    const { addToHistory, currency } = props;

    const [daily, setDaily] = useState<ActiveFinanceObject>(
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

    const { income, balance, spending, date } = daily;

    const [input, setInput] = useState<string>("0");

    useEffect(() => {
        if (date === "") {
            const storedValues: storedFinanceObject = JSON.parse(
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
