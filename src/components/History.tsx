import { FC, ReactNode, useEffect, useState } from "react";
import {
	storedFinanceObject,
	CurrencyObject,
	DateRange,
	ActiveFinanceObject,
	GraphText,
	Mode,
	FinanceLiteral,
} from "../utils/interfaces";
import Graph from "./Graph";
import { last, dateToLocale, constructEmptyFinance } from "../utils/utils";
import { parseFinanceObject } from "../utils/currencies";
import "../styles/history.css";
import { Loader } from "./Loader";
import { HistoryShortcuts } from "./HistoryShortcuts";
import { HistoryMode } from "./HistoryMode";

interface HistoryProps {
	history: storedFinanceObject[];
	currency: CurrencyObject;
	dataLoaded: boolean;
}

const History: FC<HistoryProps> = (props) => {
	const { history, currency, dataLoaded } = props;
	const [date, setDate] = useState<DateRange>({
		startDate: "",
		endDate: "",
	});
	const { startDate, endDate } = date;

	const [mode, setMode] = useState<Mode>("cumulative");

	const [data, setData] = useState<ActiveFinanceObject>(
		constructEmptyFinance(currency, "")
	);
	const [dataArr, setDataArr] = useState<ReactNode[]>([]);

	function handleChange(target: HTMLInputElement): void {
		if (target.name === "start-date") {
			setDate((prevDate) => ({ ...prevDate, startDate: target.value }));
		} else if (target.name === "end-date") {
			setDate((prevDate) => ({ ...prevDate, endDate: target.value }));
		}
	}

	// Use effect to automatically render or rerender graph if both dates are supplied
	useEffect(() => {
		if (startDate && endDate) {
			filterHistory();
		}
	}, [date, mode]);

	// if both dates exist filter history and render graph
	function filterHistory(): void {
		const trimmedHistory: storedFinanceObject[] = history.filter(
			(historyObj) =>
				historyObj.date >= startDate && historyObj.date <= endDate
		);

		if (mode !== "individual") {
			const historicalIncome = calcForRender(
				trimmedHistory,
				"income",
				mode
			);
			const historicalSpending = calcForRender(
				trimmedHistory,
				"balance",
				mode
			);
			const historicalBalance = calcForRender(
				trimmedHistory,
				"spending",
				mode
			);
			const historicalLimit = calcForRender(
				trimmedHistory,
				"limit",
				mode
			);
			const formattedDate = dateToLocale([startDate, endDate]);
			setData(
				parseFinanceObject(
					{
						income: historicalIncome,
						balance: historicalSpending,
						spending: historicalBalance,
						date: `${formattedDate[0]} - ${formattedDate[1]}`,
						limit: historicalLimit,
					},
					currency
				)
			);
		} else {
			const activeHistory = trimmedHistory.map((day) =>
				parseFinanceObject(day, currency)
			);
			const graphArray: ReactNode[] = activeHistory.map((day) => {
				return (
					<Graph
						data={day}
						currency={currency}
						graphText={graphTextHistory}
					/>
				);
			});
			setDataArr(graphArray);
		}
	}

	function calcForRender(
		array: any[],
		type: FinanceLiteral,
		mode: Mode
	): number {
		let totalAmount = 0;
		// discount 0s so they don't bring down the average
		let nullNum = 0;
		if (type === "income") {
			totalAmount = array.reduce((a, b) => a + b.income, 0);
			nullNum = array.filter((el) => el.income === 0).length;
		} else if (type === "balance") {
			totalAmount = array.reduce((a, b) => a + b.balance, 0);
			nullNum = array.filter((el) => el.balance === 0).length;
		} else if (type === "spending") {
			totalAmount = array.reduce((a, b) => a + b.spending, 0);
			nullNum = array.filter((el) => el.spending === 0).length;
		} else if (type === "limit") {
			totalAmount = array.reduce((a, b) => a + b.limit, 0);
			nullNum = array.filter((el) => el.limit === 0).length;
		}

		const validEls = array.length - nullNum;

		if (totalAmount === 0) {
			return 0;
		} else if (mode === "average" || type === "balance") {
			return totalAmount / validEls;
		} else {
			return totalAmount;
		}
	}

	function renderGraph(): ReactNode | ReactNode[] {
		const wrongStartDate =
			startDate < history[0].date ||
			startDate > last(history).date ||
			startDate > endDate;
		const wrongEndDate =
			endDate > last(history).date || endDate < history[0].date;
		if (!history.length) {
			return (
				<div className="date-error-msg">
					<h3>You don't have any history yet.</h3>
				</div>
			);
		} else if (!data.date || !date.startDate || !date.endDate) {
			return <></>;
		} else if (wrongStartDate || wrongEndDate) {
			let message;

			if (startDate > endDate) {
				message = "Your start and end date order is wrong.";
			} else if (wrongStartDate && wrongEndDate) {
				message =
					"Start and end date are out of bounds. Please select differente dates.";
			} else if (wrongStartDate) {
				message =
					"Start date is out of bounds. Please select a different date.";
			} else {
				message =
					"End date is out of bounds. Please select a different date.";
			}
			return (
				<div className="date-error-msg">
					<h3>{message}</h3>
				</div>
			);
		} else {
			if (mode !== "individual") {
				return (
					<Graph
						data={data}
						currency={currency}
						graphText={graphTextHistory}
					/>
				);
			} else {
				return dataArr;
			}
		}
	}

	const graphTextHistory: GraphText = {
		income: `${mode === "cumulative" ? "Total" : "Average"} income`,
		balance: "Average balance",
		spending: `${mode === "cumulative" ? "Total" : "Average"} spending`,
	};

	const minDate: string = history.length ? history[0].date : "";
	const maxDate: string = history.length ? last(history).date : "";

	return !dataLoaded ? (
		<Loader />
	) : (
		<div className="history">
			<HistoryMode mode={mode} setMode={setMode} />
			{renderGraph()}
			<HistoryShortcuts history={history} setDate={setDate} />
			<label className="date-label">
				Start date:
				<input
					type="date"
					name="start-date"
					value={startDate}
					min={minDate}
					max={maxDate}
					disabled={!history.length}
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
					disabled={!history.length}
					onChange={(e) => handleChange(e.target)}
				></input>
			</label>
		</div>
	);
};

export default History;
