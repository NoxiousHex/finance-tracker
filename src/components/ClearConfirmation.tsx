import { FC, Dispatch, SetStateAction } from "react";
import { deleteDoc, onSnapshot, doc } from "firebase/firestore";
import { dailyCollection, db } from "../firebase";
import { ErrorObject } from "../utils/interfaces";

interface ClearConfirmationProps {
	setClear: Dispatch<SetStateAction<boolean>>;
	setErrorState: Dispatch<SetStateAction<ErrorObject>>;
}

export const ClearConfirmation: FC<ClearConfirmationProps> = (props) => {
	const { setClear, setErrorState } = props;

	function handleClick() {
		try {
			onSnapshot(dailyCollection, (snapshot) => {
				snapshot.docs.forEach((res) => {
					const docRef = doc(db, "daily", res.id);
					deleteDoc(docRef);
				});
			});
		} catch {
			setErrorState({
				render: true,
				message: "Clearing failed. Please try again.",
			});
		} finally {
			setClear(false);
		}
	}
	return (
		<div>
			<h2>Are you sure?</h2>
			<button className="clear-btn" onClick={handleClick}>
				Yes
			</button>
			<button onClick={() => setClear(false)}>No, stop!</button>
		</div>
	);
};

export default ClearConfirmation;
