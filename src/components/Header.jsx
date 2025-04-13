import React from "react";
import { useTranslation } from "react-i18next";

const avatarUrl = "/images/avatar.webp";

function Header() {
	const { t } = useTranslation();

	return (
		<header className="fixed top-0 left-0 right-0 z-30 h-[180px] flex flex-col items-center bg-dark-blue">
			<div className="absolute inset-x-0 top-0 h-[140px] bg-header-banner bg-cover bg-center opacity-30 z-0">
				<div className="absolute inset-0 bg-gradient-to-b from-dark-blue via-transparent to-dark-blue"></div>
			</div>

			<div className="relative mt-[-50px] z-10">
				<img
					src={avatarUrl}
					alt="Developer Avatar"
					className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-dark-blue shadow-lg bg-navy-blue object-cover"
				/>
			</div>
			<div className="relative z-10 text-center mt-1">
				<h1 className="text-lg sm:text-xl font-bold text-light-blue">{t("name")}</h1>
				<p className="text-xs text-lighter-blue">{t("description")}</p>
			</div>
		</header>
	);
}

export default Header;
