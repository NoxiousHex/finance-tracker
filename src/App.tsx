import { useState, useEffect } from "react";
import "./App.css";
import Daily from "./modules/Daily";
import currency from "currency.js";
import { SpendingHistory } from "./utils/interfaces";

function App() {
    const [history, setHistory] = useState<SpendingHistory[]>(
        fetchFromStorage("history", "[]")
    );
    console.log(history);
    function newHistoryItem(
        income: currency,
        spending: currency,
        balance: currency,
        date: string
    ): void {
        const item = {
            income: income,
            spending: spending,
            balance: balance,
            date: date,
        };
        setHistory((prevHistory) => [...prevHistory, item]);
    }

    function fetchFromStorage(
        entry: string,
        defaultVal: string
    ): SpendingHistory[] {
        return JSON.parse(localStorage.getItem(entry) || defaultVal);
    }

    useEffect(() => {
        localStorage.setItem("history", JSON.stringify(history));
    }, [history]);

    return (
        <>
            <header></header>
            <main>
                <Daily addToHistory={newHistoryItem} />
            </main>
        </>
    );
}

export default App;
