import { FC, SetStateAction, Dispatch, useState } from "react";
import { CurrencyObject } from "../utils/interfaces";
import { EUR, USD, GBP } from "../utils/currencies";
import "../styles/settings.css";

interface IProps {
    setCurrencyUsed: Dispatch<SetStateAction<CurrencyObject>>;
}

export const Settings: FC<IProps> = (props) => {
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
        </div>
    );
};

export default Settings;
