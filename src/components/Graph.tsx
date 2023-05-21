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
    const graphNumbers = [income.intValue, balance.intValue, spending.intValue];
    // Get highest value to scale graphs towards to prevent overflow
    const maximum: number = max(graphNumbers);
    const incomeScale: number = calculatePercent(graphNumbers[0], maximum);
    const balanceScale: number = calculatePercent(graphNumbers[1], maximum);
    const spendingScale: number = calculatePercent(graphNumbers[2], maximum);

    return (
        <div className="graph-body">
            <h2 className="graph-date">{date}</h2>
            <div className="graph-container">
                <h3 className="graph-text">{`${
                    graphText.income
                }: ${income.format()}`}</h3>
                <div
                    style={{ height: `${income ? incomeScale : 0}%` }}
                    className="income-graph"
                ></div>
                <h3 className="graph-text">{`${
                    graphText.balance
                }: ${balance.format()}`}</h3>
                <div
                    style={{ height: `${balance ? balanceScale : 0}%` }}
                    className="balance-graph"
                ></div>
                <h3 className="graph-text">{`${
                    graphText.spending
                }: ${spending.format()}`}</h3>
                <div
                    style={{ height: `${spending ? spendingScale : 0}%` }}
                    className="spending-graph"
                ></div>
            </div>
        </div>
    );
};

export default Graph;
