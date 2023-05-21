import { FC, Dispatch, SetStateAction } from "react";

interface ClearConfirmationProps {
    setClear: Dispatch<SetStateAction<boolean>>;
}

export const ClearConfirmation: FC<ClearConfirmationProps> = (props) => {
    return (
        <div>
            <h2>Are you sure?</h2>
            <button className="clear-btn" onClick={() => localStorage.clear()}>
                Yes
            </button>
            <button onClick={() => props.setClear(false)}>No, stop!</button>
        </div>
    );
};

export default ClearConfirmation;
