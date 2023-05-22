import { FC, ReactNode, useEffect, useState } from "react";
import {
    storedFinanceObject,
    CurrencyObject,
    DateRange,
    ActiveFinanceObject,
    DateTuple,
    GraphText,
} from "../utils/interfaces";
import Graph from "./Graph";
import {
    last,
    CalcAverage,
    dateToLocale,
    constructEmptyFinance,
    getPastDate,
} from "../utils/utils";
import { v4 as uuid } from "uuid";
import { parseFinanceObject } from "../utils/currencies";
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
        constructEmptyFinance(currency)
    );

    // State to keep track of whether shortcut was clicked
    const [shortcutUsed, setShortcutUsed] = useState(false);

    function handleChange(target: HTMLInputElement): void {
        setData(constructEmptyFinance(currency));
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
            parseFinanceObject(
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

    function handleShortcut(target: HTMLButtonElement): void {
        const text = target.name;
        setShortcutUsed(true);
        if (text === "Yesterday") {
            setDate({
                startDate: last(history).date,
                endDate: last(history).date,
            });
        } else {
            let days: number = 0;
            if (text === "7D") days = 7;
            else if (text === "14D") days = 14;
            else if (text === "30D") days = 30;
            else days = 183; // 182.625
            const dates: DateTuple = getPastDate(history, days);
            setDate({
                startDate: dates[0],
                endDate: dates[1],
            });
        }
    }

    // Graph should auto-render when the shortcut is clicked, but useState
    // is asynchronous so calling handleClick() inside is not reliable
    // therefore we need to make sure state has updated before we run it
    // but we also want to only render it with shortcuts, not when used
    // uses date selector. Solution would be a custom useState hook that
    // runs function after state update, but using conditional useEffect is
    // easier solution, although it requires another state to keep track of whether
    // shortcut was clicked or not

    useEffect(() => {
        if (shortcutUsed) {
            setShortcutUsed(false);
            handleClick();
        }
    }, [date]);

    function renderGraph(): ReactNode {
        if (!history) {
            return (
                <div className="date-error-msg">
                    <h3>You don't have any history yet.</h3>
                </div>
            );
        } else if (data.date === "") {
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

    function renderShortcuts(): ReactNode {
        const shortcutText: string[] = [
            "Yesterday",
            "7D",
            "14D",
            "30D",
            "6M",
            "1Y",
        ];
        const shortcutElements: ReactNode[] = shortcutText.map((text) => (
            <button
                key={uuid()}
                className="history-shortcut"
                name={text}
                onClick={(e) => handleShortcut(e.currentTarget)}
            >
                {text}
            </button>
        ));
        return shortcutElements;
    }

    const graphTextHistory: GraphText = {
        income: "Average income",
        balance: "Average balance",
        spending: "Average spending",
    };

    const minDate: string = history ? history[0].date : "";
    const maxDate: string = history ? last(history).date : "";

    return (
        <div className="history">
            <h2 className="title">History</h2>
            {renderGraph()}
            <div className="shortcut-container">{renderShortcuts()}</div>
            <label className="date-label">
                Start date:
                <input
                    type="date"
                    name="start-date"
                    value={startDate}
                    min={minDate}
                    max={maxDate}
                    disabled={!history}
                    onChange={(e) => handleChange(e.target)}
                ></input>
            </label>
            <label className="date-label">
                End date:
                <input
                    type="date"
                    name="end-date"
                    value={endDate}
                    min={minDate}
                    max={maxDate}
                    disabled={!history}
                    onChange={(e) => handleChange(e.target)}
                ></input>
            </label>
            <button onClick={handleClick}>Select date</button>
        </div>
    );
};

export default History;
