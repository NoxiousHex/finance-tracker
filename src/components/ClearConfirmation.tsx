import { FC, Dispatch, SetStateAction, useState } from "react";
import { deleteDoc, onSnapshot, doc } from "firebase/firestore";
import { dailyCollection, db } from "../firebase";
import { ErrorMsg } from "./Error";
import { ErrorObject } from "../utils/interfaces";

interface ClearConfirmationProps {
	setClear: Dispatch<SetStateAction<boolean>>;
}

export const ClearConfirmation: FC<ClearConfirmationProps> = (props) => {
	const { setClear } = props;
	const [renderError, setRenderError] = useState<ErrorObject>({
		render: false,
		message: "Deleting data failed. Please try again.",
	});

	function handleClick() {
		try {
			onSnapshot(dailyCollection, (snapshot) => {
				snapshot.docs.forEach((res) => {
					const docRef = doc(db, "daily", res.id);
					deleteDoc(docRef);
				});
			});
		} catch {
			setRenderError({
				...renderError,
				render: true,
			});
		} finally {
			setClear(false);
		}
	}
	return (
		<div>
			{renderError.render && (
				<ErrorMsg
					message={renderError.message}
					setErrorState={setRenderError}
				/>
			)}
			<h2>Are you sure?</h2>
			<button className="clear-btn" onClick={handleClick}>
				Yes
			</button>
			<button onClick={() => setClear(false)}>No, stop!</button>
		</div>
	);
};

export default ClearConfirmation;
