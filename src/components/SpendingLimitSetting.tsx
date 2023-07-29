import { Dispatch, FC, SetStateAction, useState } from "react";
import { validateNumericalInput } from "../utils/utils";
import { dailyCollection, db } from "../firebase";
import { doc, getDocs, updateDoc } from "firebase/firestore";
import currency from "currency.js";
import { ErrorObject } from "../utils/interfaces";

interface SpendingLimitProps {
	setErrorState: Dispatch<SetStateAction<ErrorObject>>;
}

export const SpendingLimit: FC<SpendingLimitProps> = (props) => {
	const { setErrorState } = props;
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
				setErrorState({
					render: true,
					message:
						"There was an error while setting the spending limit. Please try again.",
				});
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
					placeholder="Enter limit"
				></input>
				<button className="settings-btn" onClick={handleClick}>
					Set limit
				</button>
			</div>
		</div>
	);
};
