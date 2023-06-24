import { FC, SetStateAction, Dispatch, useState } from "react";
import { CurrencyObject } from "../utils/interfaces";
import { EUR, USD, GBP } from "../utils/currencies";
import "../styles/settings.css";
import ClearConfirmation from "./ClearConfirmation";

interface SettingsProps {
	setCurrencyUsed: Dispatch<SetStateAction<CurrencyObject>>;
}

export const Settings: FC<SettingsProps> = (props) => {
	// Related to currency settings
	const { setCurrencyUsed } = props;

	const [selectedCurrency, setSelectedCurrency] = useState<string>("€");

	function handleChange(choice: string): void {
		setSelectedCurrency(choice);
	}

	function handleClick(): void {
		const availableCurrencies: CurrencyObject[] = [EUR, USD, GBP];
		const foundCurrency: CurrencyObject =
			availableCurrencies.find(
				({ symbol }) => symbol === selectedCurrency
			) || EUR;
		setCurrencyUsed(foundCurrency);
	}

	// Related to data clearing

	const [clear, setClear] = useState<boolean>(false);

	const confimation = clear && <ClearConfirmation setClear={setClear} />;

	return (
		<div className="settings">
			<label>Select currency:</label>
			<div className="settings-currency">
				<select onChange={(e) => handleChange(e.target.value)}>
					<option value="€">EUR</option>
					<option value="$">USD</option>
					<option value="£">GBP</option>
				</select>
				<button className="currency-btn" onClick={handleClick}>
					Apply
				</button>
			</div>
			<button className="clear-btn" onClick={() => setClear(true)}>
				Clear data
			</button>
			{confimation}
		</div>
	);
};

export default Settings;
