import { useState, useEffect } from "react";

export const useDeviceDetect = () => {
	const [device, setDevice] = useState<"MOBILE" | "DESKTOP">("DESKTOP");

	useEffect(() => {
		const handleResize = () => {
			setDevice(window.innerWidth < 768 ? "MOBILE" : "DESKTOP");
		};

		handleResize();

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return device;
};