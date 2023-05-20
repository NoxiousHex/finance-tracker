import { FC, Dispatch, SetStateAction } from "react";
import { Route } from "../utils/interfaces";
import "../styles/navbar.css";
import { MdSunny, MdMenuBook, MdSettingsSuggest } from "react-icons/md";

interface NavProps {
    setPage: Dispatch<SetStateAction<Route>>;
}

const Header: FC<NavProps> = (props) => {
    const { setPage } = props;
    return (
        <nav className="navbar">
            <a className="nav-link" onClick={() => setPage("daily")}>
                <MdSunny className="nav-icon" />
                Daily
            </a>
            <a className="nav-link" onClick={() => setPage("history")}>
                <MdMenuBook className="nav-icon" />
                History
            </a>
            <a className="nav-link" onClick={() => setPage("settings")}>
                <MdSettingsSuggest className="nav-icon" />
                Settings
            </a>
        </nav>
    );
};

export default Header;
