import { FC, Dispatch, SetStateAction, useState, useEffect } from "react";
import { Route } from "../utils/interfaces";
import "../styles/navbar.css";
import { MdSunny, MdMenuBook, MdSettingsSuggest } from "react-icons/md";

interface NavbarProps {
	page: string;
	setPage: Dispatch<SetStateAction<Route>>;
}

const Navbar: FC<NavbarProps> = (props) => {
	const { page, setPage } = props;

	const activePageColor = { backgroundColor: "#8c2a30" };
	const dailyActive = page === "daily" ? activePageColor : {};
	const historyActive = page === "history" ? activePageColor : {};
	const settingsActive = page === "settings" ? activePageColor : {};

	// Hide navbar if touch keyboard opens in mobile view
	const [hide, setHide] = useState(false);

	function toggleHidden() {
		const isMobile = "ontouchstart" in window;

		if (visualViewport && visualViewport.width < 700 && isMobile) {
			setHide((prevHide) => !prevHide);
		}
	}

	useEffect(() => {
		window.visualViewport?.addEventListener("resize", toggleHidden);
		return () =>
			window.visualViewport?.removeEventListener("resize", toggleHidden);
	}, []);

	const isHidden = hide ? "hidden" : "";

	return (
		<nav className={`navbar ${isHidden}`}>
			<a
				className="nav-link"
				onClick={() => setPage("daily")}
				style={dailyActive}
			>
				<MdSunny className="nav-icon" />
				Daily
			</a>
			<a
				className="nav-link"
				onClick={() => setPage("history")}
				style={historyActive}
			>
				<MdMenuBook className="nav-icon" />
				History
			</a>
			<a
				className="nav-link"
				onClick={() => setPage("settings")}
				style={settingsActive}
			>
				<MdSettingsSuggest className="nav-icon" />
				Settings
			</a>
		</nav>
	);
};

export default Navbar;
