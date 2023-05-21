import { FC, ReactNode, useState } from "react";
import {
    storedFinanceObject,
    CurrencyObject,
    DateRange,
    ActiveFinanceObject,
} from "../utils/interfaces";
import Graph from "./Graph";
import { last, CalcAverage, dateToLocale } from "../utils/utils";
import { parseObjectToCurr } from "../utils/currencies";
import "../styles/history.css";

interface HistoryProps {
    history: storedFinanceObject[];
    currency: CurrencyObject;
}

const History: FC<HistoryProps> = (props) => {
    const { history, currency } = props;
    const [date, setDate] = useState<DateRange>({
        startDate: "",
        endDate: "",
    });

    const { startDate, endDate } = date;

    const [data, setData] = useState<ActiveFinanceObject>(
        parseObjectToCurr(
            { income: 0, balance: 0, spending: 0, date: "" },
            currency
        )
    );

    function handleChange(target: HTMLInputElement): void {
        if (target.name === "start-date") {
            setDate((prevDate) => ({ ...prevDate, startDate: target.value }));
        } else if (target.name === "end-date") {
            setDate((prevDate) => ({ ...prevDate, endDate: target.value }));
        }
    }

    function handleClick(): void {
        const trimmedHistory: storedFinanceObject[] = history.filter(
            (historyObj) =>
                historyObj.date >= startDate && historyObj.date <= endDate
        );
        const averageIncome = CalcAverage(trimmedHistory, "income");
        const averageBalance = CalcAverage(trimmedHistory, "balance");
        const averageSpending = CalcAverage(trimmedHistory, "spending");
        const formattedDate = dateToLocale([startDate, endDate]);

        setData(
            parseObjectToCurr(
                {
                    income: averageIncome,
                    balance: averageBalance,
                    spending: averageSpending,
                    date: `${formattedDate[0]} - ${formattedDate[1]}`,
                },
                currency
            )
        );
    }

    function renderGraph(): ReactNode {
        if (data.date === "") {
            return <></>;
        } else if (
            startDate < history[0].date ||
            endDate > last(history).date
        ) {
            return (
                <div className="date-error-msg">
                    <h3>
                        One or both dates is out of bounds. Please select
                        different date.
                    </h3>
                </div>
            );
        } else {
            return (
                <Graph
                    data={data}
                    currency={currency}
                    graphText={graphTextHistory}
                />
            );
        }
    }

    const graphTextHistory = {
        income: "Average income",
        balance: "Average balance",
        spending: "Average spending",
    };

    return (
        <div className="history">
            <h2 className="title">History</h2>
            {renderGraph()}
            <label className="date-label">
                Start date:
                <input
                    type="date"
                    name="start-date"
                    onChange={(e) => handleChange(e.target)}
                ></input>
            </label>
            <label className="date-label">
                End date:
                <input
                    type="date"
                    name="end-date"
                    onChange={(e) => handleChange(e.target)}
                ></input>
            </label>
            <button onClick={handleClick}>Select date</button>
        </div>
    );
};

export default History;
