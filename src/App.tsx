import { useState, useEffect } from "react";
import "./App.css";
import Daily from "./components/Daily";
import History from "./components/History";
import Header from "./components/Navbar";
import { Route, storedFinanceObject, CurrencyObject } from "./utils/interfaces";
import { EUR } from "./utils/currencies";
import Settings from "./components/Settings";

function App() {
    const [history, setHistory] = useState<storedFinanceObject[]>(
        JSON.parse(localStorage.getItem("history") || "null")
    );
    const [page, setPage] = useState<Route>("daily");

    const [currencyUsed, setCurrencyUsed] = useState<CurrencyObject>(
        JSON.parse(localStorage.getItem("currency") || "null") || EUR
    );

    function newHistoryItem(
        income: number,
        spending: number,
        balance: number,
        date: string
    ): void {
        const item = {
            income: income,
            spending: spending,
            balance: balance,
            date: date,
        };
        if (!history) {
            setHistory([item]);
        } else {
            setHistory((prevHistory) => [...prevHistory, item]);
        }
    }

    useEffect(() => {
        localStorage.setItem("history", JSON.stringify(history));
    }, [history]);

    useEffect(() => {
        localStorage.setItem("currency", JSON.stringify(currencyUsed));
    }, [currencyUsed]);

    const renderRoute =
        page === "daily" ? (
            <Daily
                history={history}
                addToHistory={newHistoryItem}
                currency={currencyUsed}
            />
        ) : page === "history" ? (
            <History history={history} currency={currencyUsed} />
        ) : page === "settings" ? (
            <Settings setCurrencyUsed={setCurrencyUsed} />
        ) : (
            <h2>Something went wrong</h2>
        );

    return (
        <>
            <Header page={page} setPage={setPage} />
            <main>{renderRoute}</main>
        </>
    );
}

export default App;
