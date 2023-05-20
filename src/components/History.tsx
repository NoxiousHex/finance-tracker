import { FC, ReactNode, useState } from "react";
import {
    GraphTuple,
    SpendingHistory,
    CurrencyObject,
    DateRange,
} from "../utils/interfaces";
import Graph from "./Graph";
import { last, CalcAverage } from "../utils/utils";
import { curr } from "../utils/currencies";
import "../styles/history.css";

interface IProps {
    history: SpendingHistory[];
    currency: CurrencyObject;
}

const History: FC<IProps> = (props) => {
    const { history, currency } = props;
    const [date, setDate] = useState<DateRange>({
        startDate: "",
        endDate: "",
    });

    const { startDate, endDate } = date;

    const [dataUsed, setDataUsed] = useState<GraphTuple>([
        curr(0, currency),
        curr(0, currency),
        curr(0, currency),
    ]);

    function handleChange(target: HTMLInputElement): void {
        if (target.name === "start-date") {
            setDate((prevDate) => ({ ...prevDate, startDate: target.value }));
        } else if (target.name === "end-date") {
            setDate((prevDate) => ({ ...prevDate, endDate: target.value }));
        }
    }

    function handleClick(): void {
        const trimmedHistory: SpendingHistory[] = history.filter(
            (historyObj) =>
                historyObj.date >= startDate && historyObj.date <= endDate
        );
        const averageIncome = CalcAverage(trimmedHistory, "income");
        const averageBalance = CalcAverage(trimmedHistory, "balance");
        const averageSpending = CalcAverage(trimmedHistory, "spending");

        setDataUsed([
            curr(averageIncome, currency),
            curr(averageBalance, currency),
            curr(averageSpending, currency),
        ]);
    }

    function renderGraph(): ReactNode {
        if (dataUsed.reduce((a, b) => a + b.intValue, 0) === 0) {
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
                    graphTuple={dataUsed}
                    date={[startDate, endDate]}
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
