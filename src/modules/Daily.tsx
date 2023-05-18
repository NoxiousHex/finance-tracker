import { FC, useState, useEffect } from "react";
import currency from "currency.js";
import { last } from "../utils/utils";
import RenderGraph from "../modules/RenderGraph";
import "../styles/daily.css";

interface IProps {
    addToHistory: (
        income: currency,
        spending: currency,
        balance: currency,
        date: string
    ) => void;
}

const Daily: FC<IProps> = (props) => {
    const { addToHistory } = props;
    const [income, setIncome] = useState<currency>(
        currency(JSON.parse(localStorage.getItem("currentIncome") || "0"))
    );
    const [spending, setSpending] = useState<currency>(
        currency(JSON.parse(localStorage.getItem("currentSpending") || "0"))
    );
    const [dateArr, setDateArr] = useState<string[]>(
        JSON.parse(localStorage.getItem("dateArr") || "[]")
    );
    const [balance, setBalance] = useState<currency>(
        currency(JSON.parse(localStorage.getItem("currentBalance") || "0"))
    );
    const [addInput, setAddInput] = useState<string>("");
    const [removeInput, setRemoveInput] = useState<string>("");
    useEffect(() => {
        localStorage.setItem("currentIncome", JSON.stringify(income.value));
        localStorage.setItem("currentSpending", JSON.stringify(spending.value));
        localStorage.setItem("currentBalance", JSON.stringify(balance.value));
        localStorage.setItem("dateArr", JSON.stringify(dateArr));
    }, [income, spending, dateArr]);
    function changeIncome(num: number): void {
        if (num > 0) {
            setBalance((prevBalance) => prevBalance.add(num));
            setIncome((prevIncome) => prevIncome.add(num));
        }
    }

    function changeSpending(num: number): void {
        if (num > 0) {
            setBalance(balance.subtract(num));
            setSpending((prevSpending) => prevSpending.add(num));
        }
    }
    function newDay(): void {
        addToHistory(income, spending, balance, dateArr[0]);
        setIncome(currency(0));
        setSpending(currency(0));
        setDateArr([new Date().toLocaleDateString()]);
    }

    useEffect(() => {
        if (new Date().toLocaleDateString() > last(dateArr)) {
            console.log("It's a new day");
            newDay();
        } else {
            setDateArr([...dateArr, new Date().toLocaleDateString()]);
        }
    }, []);

    console.log(dateArr);
    return (
        <section className="daily">
            <RenderGraph
                income={income}
                spending={spending}
                balance={balance}
                date={dateArr[0]}
            />
            <input
                placeholder="Add to balance"
                aria-label="Add to balance"
                className="daily-input"
                onChange={(e) => setAddInput(e.target.value)}
            ></input>
            <button
                className="daily-btn"
                onClick={() => changeIncome(parseInt(addInput))}
            >
                Add
            </button>
            <input
                placeholder="Remove from balance"
                aria-label="Remove from balance"
                className="daily-input"
                onChange={(e) => setRemoveInput(e.target.value)}
            ></input>
            <button
                className="daily-btn"
                onClick={() => changeSpending(parseInt(removeInput))}
            >
                Remove
            </button>
        </section>
    );
};

export default Daily;
