import { FC, Dispatch, SetStateAction } from "react";
import { deleteDoc, onSnapshot, doc } from "firebase/firestore";
import { dailyCollection, db } from "../firebase";

interface ClearConfirmationProps {
    setClear: Dispatch<SetStateAction<boolean>>;
}

export const ClearConfirmation: FC<ClearConfirmationProps> = (props) => {
    const { setClear } = props;

    function handleClick() {
        onSnapshot(dailyCollection, (snapshot) => {
            snapshot.docs.forEach((res) => {
                const docRef = doc(db, "daily", res.id);
                deleteDoc(docRef);
            });
        });
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
