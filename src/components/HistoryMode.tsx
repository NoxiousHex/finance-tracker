import { Dispatch, FC, SetStateAction } from "react";
import { Mode } from "../utils/interfaces";

interface HistoryModeProps {
	mode: Mode;
	setMode: Dispatch<SetStateAction<Mode>>;
}

export const HistoryMode: FC<HistoryModeProps> = (props) => {
	const { mode, setMode } = props;

	function handleClick(target: HTMLButtonElement): void {
		const text = target.name;

		if (text === "cumulative") {
			setMode("cumulative");
		} else if (text === "average") {
			setMode("average");
		}
	}

	const activeModeColor = { backgroundColor: "#8c2a30" };
	const modeCumulative = mode === "cumulative" ? activeModeColor : {};
	const modeAverage = mode === "average" ? activeModeColor : {};

	return (
		<div className="mode-container">
			<button
				className="history-shortcut"
				style={modeCumulative}
				name="cumulative"
				disabled={!history.length}
				onClick={(e) => handleClick(e.currentTarget)}
			>
				Cumulative
			</button>
			<button
				className="history-shortcut"
				style={modeAverage}
				name="average"
				disabled={!history.length}
				onClick={(e) => handleClick(e.currentTarget)}
			>
				Average
			</button>
		</div>
	);
};
