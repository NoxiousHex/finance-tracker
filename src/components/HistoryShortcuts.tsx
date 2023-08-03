import { Dispatch, FC, ReactNode, SetStateAction } from "react";
import { DateRange, DateTuple, storedFinanceObject } from "../utils/interfaces";
import { last, getPastDateFromHistory } from "../utils/utils";
import { v4 as uuid } from "uuid";

interface HistoryShortcutsProps {
	history: storedFinanceObject[];
	setDate: Dispatch<SetStateAction<DateRange>>;
}

export const HistoryShortcuts: FC<HistoryShortcutsProps> = (props) => {
	const { history, setDate } = props;

	function handleClick(target: HTMLButtonElement): void {
		const text = target.name;
		if (text === "1D") {
			setDate({
				startDate: last(history).date,
				endDate: last(history).date,
			});
		} else {
			let days: number = 0;
			if (text === "7D") days = 7;
			else if (text === "14D") days = 14;
			else if (text === "30D") days = 30;
			else if (text === "6M") days = 183; // 182.625
			else days = 365;
			const dates: DateTuple = getPastDateFromHistory(history, days);
			setDate({
				startDate: dates[0],
				endDate: dates[1],
			});
		}
	}

	function renderShortcuts(): ReactNode {
		const shortcutText: string[] = ["1D", "7D", "14D", "30D", "6M", "1Y"];
		const shortcutLength: number[] = [1, 7, 14, 30, 183, 365];
		const shortcutElements: ReactNode[] = shortcutText.map((text, i) => {
			const isDisabled = history.length < shortcutLength[i];
			return (
				<button
					key={uuid()}
					className="history-shortcut"
					name={text}
					disabled={!history.length || isDisabled}
					onClick={(e) => handleClick(e.currentTarget)}
				>
					{text}
				</button>
			);
		});
		return shortcutElements;
	}

	return <div className="shortcut-container">{renderShortcuts()}</div>;
};
