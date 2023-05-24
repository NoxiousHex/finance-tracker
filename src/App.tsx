import { useState, useEffect } from "react";
import "./App.css";
import Daily from "./components/Daily";
import History from "./components/History";
import Navbar from "./components/Navbar";
import { Route, storedFinanceObject, CurrencyObject } from "./utils/interfaces";
import { EUR } from "./utils/currencies";
import Settings from "./components/Settings";
import { addDoc, onSnapshot } from "firebase/firestore";
import { currencyCollection, historyCollection } from "./firebase";
import { last } from "./utils/utils";

function App() {
    const [history, setHistory] = useState<storedFinanceObject[]>([]);
    const [page, setPage] = useState<Route>("daily");

    const [currencyUsed, setCurrencyUsed] = useState<CurrencyObject>(EUR);

    async function newHistoryItem(
        income: number,
        spending: number,
        balance: number,
        date: string
    ): Promise<void> {
        const item: storedFinanceObject = {
            income: income,
            spending: spending,
            balance: balance,
            date: date,
        };
        try {
            await addDoc(historyCollection, item);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        const unsubscribe = onSnapshot(historyCollection, (snapshot) => {
            const historyArr: storedFinanceObject[] =
                snapshot.docs.map<storedFinanceObject>((doc) => {
                    const data = doc.data();
                    return {
                        income: data.income,
                        spending: data.spending,
                        balance: data.balance,
                        date: data.date,
                    };
                });
            if (historyArr) {
                setHistory(historyArr);
            }
            return () => {
                unsubscribe();
            };
        });
    }, []);

    useEffect(() => {
        const unsubscribe = onSnapshot(currencyCollection, (snapshot) => {
            const currencyData: CurrencyObject = last(
                snapshot.docs.map((doc) => {
                    const data = doc.data();
                    const id = doc.id;
                    return {
                        fromCents: data.fromCents,
                        precision: data.precision,
                        separator: data.separator,
                        decimal: data.decimal,
                        symbol: data.symbol,
                        id: id,
                    };
                })
            );
            if (currencyData) {
                setCurrencyUsed(currencyData);
            }
        });
        return () => {
            unsubscribe();
        };
    }, []);

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
            <Settings id={currencyUsed.id || ""} />
        ) : (
            <h2>Something went wrong</h2>
        );

    return (
        <>
            <Navbar page={page} setPage={setPage} />
            <main>{renderRoute}</main>
        </>
    );
}

export default App;
