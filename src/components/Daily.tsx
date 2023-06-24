import { FC, useState, useEffect } from "react";
import RenderGraph from "./Graph";
import { parseFinanceObject } from "../utils/currencies";
import {
	CurrencyObject,
	ActiveFinanceObject,
	storedFinanceObject,
	GraphText,
} from "../utils/interfaces";
import {
	constructEmptyFinance,
	decimalConv,
	timeDiffInDays,
	last,
} from "../utils/utils";
import "../styles/daily.css";
import { addDoc, onSnapshot, setDoc, doc } from "firebase/firestore";
import { dailyCollection } from "../firebase";

interface DailyProps {
	history: storedFinanceObject[];
	addToHistory: (
		income: number,
		spending: number,
		balance: number,
		date: string
	) => void;
	currency: CurrencyObject;
}

const Daily: FC<DailyProps> = (props) => {
	const { history, addToHistory, currency } = props;

	const [daily, setDaily] = useState<ActiveFinanceObject>(
		constructEmptyFinance(currency)
	);

	const { income, balance, spending, date } = daily;

	const [dailyId, setId] = useState<string>("");

	const [input, setInput] = useState<string>("");

	useEffect(() => {
		const unsubscribe = onSnapshot(dailyCollection, (snapshot) => {
			const dailyArr: storedFinanceObject = snapshot.docs.map((doc) => {
				const data = doc.data();
				const id = doc.id;
				setId(id);
				return {
					income: data.income,
					balance: data.balance,
					spending: data.spending,
					date: data.date,
				};
			})[0];
			if (dailyArr) {
				setDaily(parseFinanceObject(dailyArr, currency));
			}
		});
		return () => {
			unsubscribe();
		};
	}, [input]);

	async function handleClick(id: string): Promise<void> {
		if (input) {
			const dailyCopy: ActiveFinanceObject = { ...daily };
			if (id === "add-btn") {
				const newDaily = {
					...dailyCopy,
					income: dailyCopy.income.add(decimalConv(input)),
					balance: dailyCopy.balance.add(decimalConv(input)),
				};
				const newDailyInt = {
					income: newDaily.income.intValue,
					balance: newDaily.balance.intValue,
					spending: newDaily.spending.intValue,
					date: newDaily.date,
				};
				try {
					if (!dailyId) {
						await addDoc(dailyCollection, newDailyInt);
					} else {
						const dailyRef = doc(dailyCollection, dailyId);
						await setDoc(dailyRef, newDailyInt);
					}
				} catch (err) {
					console.error(err);
				}
			} else if (id === "subtract-btn") {
				const newDaily = {
					...dailyCopy,
					spending: dailyCopy.spending.add(decimalConv(input)),
					balance: dailyCopy.balance.subtract(decimalConv(input)),
				};
				const newDailyInt = {
					income: newDaily.income.intValue,
					balance: newDaily.balance.intValue,
					spending: newDaily.spending.intValue,
					date: newDaily.date,
				};
				try {
					if (!dailyId) {
						await addDoc(dailyCollection, newDailyInt);
					} else {
						const dailyRef = await doc(dailyCollection, dailyId);
						await setDoc(dailyRef, newDailyInt);
					}
				} catch (err) {
					console.error(err);
				}
			}
		}
		setInput("");
	}

	async function newDay(): Promise<void> {
		// Add current day
		// check to make sure this day hasn't been created yet, for example in case of
		// connection issue in later setDoc() function which could lead to same day
		// being stored multiple times
		if (last(history).date <= date) {
			addToHistory(
				income.intValue,
				spending.intValue,
				balance.intValue,
				date
			);
		}

		const timeDiff = history.length
			? timeDiffInDays(date, new Date().toLocaleDateString("en-CA"))
			: 1;

		// When more than 1 day has passed since the last use fill history with
		// dummy days with balance kept as is for the sake of history calculations
		if (timeDiff > 1) {
			// Two loops to ensure out list of dates is generated correcly we can't rely on stuffing
			// everything inside one loop and deriving it from last history object since update takes time
			const missingDates: string[] = [];
			let prevDay: Date;
			for (let i = 1; i < timeDiff; i++) {
				i === 1
					? (prevDay = new Date(date))
					: (prevDay = new Date(last(missingDates)));
				const newDay: number = new Date().setTime(
					prevDay.getTime() + 86400000
				);
				missingDates.push(new Date(newDay).toLocaleDateString("en-CA"));
			}
			for (const newDate of missingDates) {
				addToHistory(0, 0, balance.intValue, newDate);
			}
		}

		const dailyRef = doc(dailyCollection, dailyId);
		const dailyCopy: ActiveFinanceObject = { ...daily };
		const newDaily: storedFinanceObject = {
			income: 0,
			balance: dailyCopy.balance.intValue,
			spending: 0,
			date: new Date().toLocaleDateString("en-CA"),
		};
		await setDoc(dailyRef, newDaily);
	}

	useEffect(() => {
		if (date && new Date().toLocaleDateString("en-CA") > date) {
			newDay();
		}
	}, [daily]);

	const graphTextDaily: GraphText = {
		income: "Daily income",
		balance: "Total balance",
		spending: "Daily spending",
	};

	const formattedDateDaily = {
		...daily,
		date: new Date(date).toLocaleDateString(),
	};

	return (
		<div className="daily">
			<RenderGraph
				data={formattedDateDaily}
				currency={currency}
				graphText={graphTextDaily}
			/>
			<input
				placeholder="Change balance"
				aria-label="Change balance"
				className="daily-input"
				value={input}
				onChange={(e) => setInput(e.target.value)}
			></input>
			<div className="button-container">
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
			</div>
		</div>
	);
};

export default Daily;
