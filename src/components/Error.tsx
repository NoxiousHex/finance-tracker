import { FC, useEffect, useState, Dispatch, SetStateAction } from "react";
import { ErrorObject } from "../utils/interfaces";
interface ErrorMsgProps {
	message: string;
	setErrorState: Dispatch<SetStateAction<ErrorObject>>;
}

export const ErrorMsg: FC<ErrorMsgProps> = (props) => {
	const { message, setErrorState } = props;
	const [timeoutIn, setTimeoutIn] = useState(10);

	function dismiss() {
		setErrorState({ render: false, message: "" });
	}

	function timeout() {
		if (timeoutIn > 1) {
			setTimeoutIn((prevTimeout) => prevTimeout - 1);
		} else {
			dismiss();
		}
	}

	useEffect(() => {
		const effect = setTimeout(timeout, 1000);
		return () => {
			effect;
		};
	}, [timeoutIn]);

	return (
		<div className="error-msg" onClick={dismiss}>
			<h3>{message}</h3>
		</div>
	);
};
