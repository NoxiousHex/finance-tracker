import { FC, useState } from "react";
import { CurrencyObject } from "../utils/interfaces";
import { EUR, USD, GBP } from "../utils/currencies";
import "../styles/settings.css";
import ClearConfirmation from "./ClearConfirmation";
import { addDoc, setDoc, doc } from "firebase/firestore";
import { currencyCollection } from "../firebase";

interface SettingsProps {
    id: string;
}

export const Settings: FC<SettingsProps> = (props) => {
    // Related to currency settings

    const [selectedCurrency, setSelectedCurrency] = useState<string>("€");
    const { id } = props;

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
            console.error(err);
        }
    }

    // Related to data clearing

    const [clear, setClear] = useState<boolean>(false);

    const confimation = clear && <ClearConfirmation setClear={setClear} />;

    return (
        <div className="settings">
            <label className="settings-currency">
                Select currency:
                <select onChange={(e) => handleChange(e.target.value)}>
                    <option value="€">EUR</option>
                    <option value="$">USD</option>
                    <option value="£">GBP</option>
                </select>
            </label>
            <button onClick={handleClick}>Apply</button>
            <button onClick={() => setClear(true)}>Clear data</button>
            {confimation}
        </div>
    );
};

export default Settings;
