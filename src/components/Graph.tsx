import { FC } from "react";
import { calculatePercent, max } from "../utils/utils";
import {
	GraphText,
	CurrencyObject,
	ActiveFinanceObject,
} from "../utils/interfaces";
import "../styles/graph.css";
interface GraphProps {
	data: ActiveFinanceObject;
	currency: CurrencyObject;
	graphText: GraphText;
}

const Graph: FC<GraphProps> = (props) => {
	const { data, graphText } = props;
	const { income, balance, spending, date } = data;
	const limit = data.limit;
	const graphNumbers = [income.intValue, balance.intValue, spending.intValue];
	// Get highest value to scale graphs towards to prevent overflow
	const maximum: number = max(graphNumbers);
	const incomeScale: number = calculatePercent(graphNumbers[0], maximum) || 0;
	const balanceScale: number =
		calculatePercent(graphNumbers[1], maximum) || 0;
	const spendingScale: number =
		calculatePercent(graphNumbers[2], maximum) || 0;

	const incomeHeight = { height: `${income ? incomeScale : 0}%` };
	const balanceHeight = { height: `${balance ? balanceScale : 0}%` };
	const spendingHeight = { height: `${spending ? spendingScale : 0}%` };

	const limitColor =
		limit && limit?.intValue > 0 && spending > limit
			? { ...spendingHeight, backgroundColor: "red" }
			: { ...spendingHeight, backgroundColor: "#c13db7" };

	const renderLimit = limit?.intValue !== 0 && (
		<>
			{limit?.intValue && ` / `}
			<span>{limit?.intValue && `${limit.format()}`}</span>
		</>
	);

	return (
		<div className="graph-body">
			<h2 className="graph-date">{date}</h2>
			<div className="graph-container">
				<h3 className="graph-text">
					{`${graphText.income}:`} <span>{`${income.format()}`}</span>
				</h3>
				<div style={incomeHeight} className="income-graph"></div>
				<h3 className="graph-text">
					{`${graphText.balance}:`}{" "}
					<span>{`${balance.format()}`}</span>
				</h3>
				<div style={balanceHeight} className="balance-graph"></div>
				<h3 className="graph-text">
					{`${graphText.spending}:`}{" "}
					<span>
						{`${spending.format()}`}
						{renderLimit}
					</span>
				</h3>
				<div style={limitColor} className="spending-graph"></div>
			</div>
		</div>
	);
};

export default Graph;
