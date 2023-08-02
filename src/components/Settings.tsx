import { FC, useState } from "react";
import { ErrorObject } from "../utils/interfaces";
import "../styles/settings.css";
import ClearConfirmation from "./ClearConfirmation";
import { SpendingLimit } from "./SpendingLimitSetting";
import { ErrorMsg } from "./Error";
import { Loader } from "./Loader";
import { CurrencySetting } from "./CurrencySetting";

interface SettingsProps {
	id: string;
	dataLoaded: boolean;
}

export const Settings: FC<SettingsProps> = (props) => {
	const { id, dataLoaded } = props;

	const [renderError, setRenderError] = useState<ErrorObject>({
		render: false,
		message: "",
	});

	const [clear, setClear] = useState<boolean>(false);
	const confimation = clear && (
		<ClearConfirmation setClear={setClear} setErrorState={setRenderError} />
	);

	return !dataLoaded ? (
		<Loader />
	) : (
		<div className="settings">
			{renderError.render && (
				<ErrorMsg
					message={renderError.message}
					setErrorState={setRenderError}
				/>
			)}
			<SpendingLimit setErrorState={setRenderError} />
			<CurrencySetting id={id} setErrorState={setRenderError} />
			<button className="clear-btn" onClick={() => setClear(true)}>
				Clear data
			</button>
			{confimation}
		</div>
	);
};

export default Settings;
