import { FC, Dispatch, SetStateAction } from "react";

interface ClearConfirmationProps {
    setClear: Dispatch<SetStateAction<boolean>>;
}

export const ClearConfirmation: FC<ClearConfirmationProps> = (props) => {
    const { setClear } = props;

    function handleClick() {
        localStorage.clear();
        setClear(false);
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
