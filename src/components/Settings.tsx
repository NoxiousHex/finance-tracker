import { FC, useState } from "react";
import { CurrencyObject, ErrorObject } from "../utils/interfaces";
import { EUR, USD, GBP } from "../utils/currencies";
import "../styles/settings.css";
import ClearConfirmation from "./ClearConfirmation";
import { addDoc, setDoc, doc } from "firebase/firestore";
import { currencyCollection } from "../firebase";
import { SpendingLimit } from "./SpendingLimitSetting";
import { ErrorMsg } from "./Error";

interface SettingsProps {
	id: string;
}

export const Settings: FC<SettingsProps> = (props) => {
	const { id } = props;
	// State for currency settings
	const [selectedCurrency, setSelectedCurrency] = useState<string>("€");
	const [renderError, setRenderError] = useState<ErrorObject>({
		render: false,
		message: "",
	});

	function handleChange(choice: string): void {
		setSelectedCurrency(choice);
	}

	async function handleClick(): Promise<void> {
		const availableCurrencies: CurrencyObject[] = [EUR, USD, GBP];
		const foundCurrency: CurrencyObject =
			availableCurrencies.find(
				({ symbol }) => symbol === selectedCurrency
			) || EUR;
		try {
			if (!id) {
				await addDoc(currencyCollection, foundCurrency);
			} else {
				const currencyRef = doc(currencyCollection, id);
				await setDoc(currencyRef, foundCurrency);
			}
		} catch (err) {
			setRenderError({
				render: true,
				message:
					"There was a problem in updating currency setting. Please try again.",
			});
		}
	}

	// Related to data clearing

	const [clear, setClear] = useState<boolean>(false);

	const confimation = clear && (
		<ClearConfirmation setClear={setClear} setErrorState={setRenderError} />
	);

	return (
		<div className="settings">
			{renderError.render && (
				<ErrorMsg
					message={renderError.message}
					setErrorState={setRenderError}
				/>
			)}
			<SpendingLimit setErrorState={setRenderError} />
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
