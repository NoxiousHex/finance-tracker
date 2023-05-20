import { FC } from "react";
import { calculatePercent, max, dateToLocale } from "../utils/utils";
import {
    DateTuple,
    GraphText,
    GraphTuple,
    CurrencyObject,
} from "../utils/interfaces";
import "../styles/graph.css";
interface IProps {
    graphTuple: GraphTuple;
    date: DateTuple;
    currency: CurrencyObject;
    graphText: GraphText;
}

const Graph: FC<IProps> = (props) => {
    const { graphTuple, date, graphText } = props;

    const graphNumbers = graphTuple.map((el) => el.intValue);
    // Get highest value to scale graphs towards to prevent overflow
    const maximum: number = max(graphNumbers);
    const incomeScale: number = calculatePercent(graphNumbers[0], maximum);
    const balanceScale: number = calculatePercent(graphNumbers[1], maximum);
    const spendingScale: number = calculatePercent(graphNumbers[2], maximum);

    const formattedDate =
        date.length === 1
            ? dateToLocale(date, 0)
            : `${dateToLocale(date, 0)} - ${dateToLocale(date, 1)}`;

    return (
        <div className="graph-body">
            <h2 className="graph-date">{formattedDate}</h2>
            <div className="graph-container">
                <h3 className="graph-text">{`${
                    graphText.income
                }: ${graphTuple[0].format()}`}</h3>
                <div
                    style={{ height: `${graphTuple[0] ? incomeScale : 0}%` }}
                    className="income-graph"
                ></div>
                <h3 className="graph-text">{`${
                    graphText.balance
                }: ${graphTuple[1].format()}`}</h3>
                <div
                    style={{ height: `${graphTuple[1] ? balanceScale : 0}%` }}
                    className="balance-graph"
                ></div>
                <h3 className="graph-text">{`${
                    graphText.spending
                }: ${graphTuple[2].format()}`}</h3>
                <div
                    style={{ height: `${graphTuple[2] ? spendingScale : 0}%` }}
                    className="spending-graph"
                ></div>
            </div>
        </div>
    );
};

export default Graph;
