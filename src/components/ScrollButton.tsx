import { FC, useEffect, useState } from "react";
import { FaArrowCircleDown } from "react-icons/fa";
import "../styles/scroll-button.css";

interface ScrollButtonProps {
	mainRef: HTMLElement | null;
}

export const ScrollButton: FC<ScrollButtonProps> = (props) => {
	const { mainRef } = props;
	const [visible, setVisible] = useState<boolean>(false);

	function toggleVisible() {
		const scrolled: number = mainRef?.scrollTop ?? 0;
		if (scrolled === 0) {
			setVisible(false);
		} else if (scrolled > 0) {
			setVisible(true);
		}
	}

	function scrollToBottom() {
		mainRef?.scrollTo({
			top: mainRef.scrollHeight,
			behavior: "smooth",
		});
	}

	useEffect(() => {
		const height = mainRef?.addEventListener("scroll", toggleVisible);
		return () => {
			height;
		};
	}, []);

	return (
		<button
			className="scroll-btn"
			onClick={scrollToBottom}
			style={{ display: visible ? "inline" : "none" }}
		>
			<FaArrowCircleDown></FaArrowCircleDown>
		</button>
	);
};
