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
import { Loader } from "./components/Loader";

function App() {
	const [history, setHistory] = useState<storedFinanceObject[]>([]);
	const [currencyUsed, setCurrencyUsed] = useState<CurrencyObject>(EUR);
	const [dataLoaded, setDataLoaded] = useState<boolean>(false);
	const [page, setPage] = useState<Route>("loading");

	async function newHistoryItem(
		income: number,
		spending: number,
		balance: number,
		date: string,
		limit: number
	): Promise<void> {
		const item: storedFinanceObject = {
			income: income,
			spending: spending,
			balance: balance,
			date: date,
			limit: limit,
		};
		try {
			await addDoc(historyCollection, item);
		} catch (err) {
			console.error(err);
		}
	}

	function sortHistory(arr: storedFinanceObject[]) {
		// There is no guarantee that data received from Firebase will be ordered correctly by date
		// so to make sure that functions that might check for last chronological item in history work correctly we need
		// to sort it first
		const sortedHistory = arr.sort((a, b) => {
			if (a.date < b.date) {
				return -1;
			} else if (a.date > b.date) {
				return 1;
			} else {
				return 0;
			}
		});

		return sortedHistory;
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
						limit: data.limit,
					};
				});
			if (historyArr) {
				setHistory(sortHistory(historyArr));
			}
			if (!dataLoaded) {
				setDataLoaded(true);
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

	function renderRoute() {
		if (page === "loading" && dataLoaded) {
			setPage("daily");
		} else if (page === "loading") {
			return <Loader />;
		} else if (page === "daily") {
			return (
				<Daily
					history={history}
					addToHistory={newHistoryItem}
					currency={currencyUsed}
				/>
			);
		} else if (page === "history") {
			return (
				<History
					history={history}
					currency={currencyUsed}
					dataLoaded={dataLoaded}
				/>
			);
		} else if (page === "settings") {
			return (
				<Settings id={currencyUsed.id || ""} dataLoaded={dataLoaded} />
			);
		}
	}

	return (
		<>
			<Navbar page={page} setPage={setPage} />
			<main>{renderRoute()}</main>
		</>
	);
}

export default App;
