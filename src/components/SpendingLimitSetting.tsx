import { FC, useState } from "react";
import { validateNumericalInput } from "../utils/utils";
import { dailyCollection, db } from "../firebase";
import { doc, getDocs, updateDoc } from "firebase/firestore";
import currency from "currency.js";

export const SpendingLimit: FC = () => {
	const [input, setInput] = useState("");

	function handleChange(value: string): void {
		const isValid = validateNumericalInput(value);
		if (isValid) {
			setInput(value);
		}
	}

	async function handleClick() {
		if (input) {
			try {
				const querySnapshot = await getDocs(dailyCollection);
				const id: string[] = [];
				querySnapshot.forEach((doc) => id.push(doc.id));
				const dailyRef = doc(db, "daily", id[0]);
				await updateDoc(dailyRef, {
					limit: currency(input).intValue,
				});
			} catch (err) {
				console.error(err);
			} finally {
				setInput("");
			}
		}
	}

	return (
		<div className="settings">
			<label>Set daily spending limit:</label>
			<div className="settings-currency">
				<input
					onChange={(e) => handleChange(e.target.value)}
					value={input}
					className="limit-input"
				></input>
				<button className="currency-btn" onClick={handleClick}>
					Set limit
				</button>
			</div>
		</div>
	);
};
