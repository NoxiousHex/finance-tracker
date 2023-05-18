import currency from "currency.js";
import { FC } from "react";
import { calculatePercent, max } from "../utils/utils";
import { FinanceTuple } from "../utils/interfaces";
import "../styles/graph.css";
interface IProps {
    income: currency;
    spending: currency;
    balance: currency;
    date: string;
}

const Graph: FC<IProps> = (props) => {
    const { income, spending, balance, date } = props;

    const financeTuple: FinanceTuple = [
        income.value,
        balance.value,
        spending.value,
    ];
    // Get highest value to scale graphs towards to prevent overflow
    const maximum: number = max(financeTuple);
    const incomeScale: number = calculatePercent(financeTuple[0], maximum);
    const balanceScale: number = calculatePercent(financeTuple[1], maximum);
    const spendingScale: number = calculatePercent(financeTuple[2], maximum);

    return (
        <div className="graph-body">
            <h2>{date}</h2>
            <div className="graph-container">
                <h3 className="graph-text">{`Daily income: ${income.value}`}</h3>
                <div
                    style={{ height: `${income ? incomeScale : 0}%` }}
                    className="income-graph"
                ></div>
                <h3 className="graph-text">{`Total balance: ${balance}`}</h3>
                <div
                    style={{ height: `${balance ? balanceScale : 0}%` }}
                    className="balance-graph"
                ></div>
                <h3 className="graph-text">{`Daily spending: ${spending.value}`}</h3>
                <div
                    style={{ height: `${spending ? spendingScale : 0}%` }}
                    className="spending-graph"
                ></div>
            </div>
        </div>
    );
};

export default Graph;
