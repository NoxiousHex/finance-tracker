import { addDoc, doc, setDoc } from "firebase/firestore";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { currencyCollection } from "../firebase";
import { EUR, USD, GBP } from "../utils/currencies";
import { CurrencyObject, ErrorObject } from "../utils/interfaces";
interface CurrencySettingProps {
	id: string;
	setErrorState: Dispatch<SetStateAction<ErrorObject>>;
}

export const CurrencySetting: FC<CurrencySettingProps> = (props) => {
	const { id, setErrorState } = props;

	const [selectedCurrency, setSelectedCurrency] = useState<string>("€");

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
			setErrorState({
				render: true,
				message:
					"There was a problem in updating currency setting. Please try again.",
			});
		}
	}

	return (
		<>
			<label>Select currency:</label>
			<div className="settings-currency">
				<select onChange={(e) => handleChange(e.target.value)}>
					<option value="€">EUR</option>
					<option value="$">USD</option>
					<option value="£">GBP</option>
				</select>
				<button className="settings-btn" onClick={handleClick}>
					Apply
				</button>
			</div>
		</>
	);
};
