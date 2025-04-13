import React from "react";
import { useTranslation } from "react-i18next";

function LanguageSwitcher({ onLanguageChange }) {
	const { i18n } = useTranslation();

	let langs = {
		en: "🇺🇸 English",
		ru: "🇷🇺 Русский"
	};

	const supportedLanguages = i18n.options.supportedLngs.filter(lang => lang !== "cimode");

	const changeLanguageHandler = event => {
		const newLang = event.target.value;

		if (onLanguageChange) {
			onLanguageChange(newLang);
		} else {
			i18n.changeLanguage(newLang);
		}
	};

	return (
		<div className="fixed top-4 right-4 z-50">
			<select
				onChange={changeLanguageHandler}
				value={i18n.language.split("-")[0]}
				className="bg-navy-blue border border-lighter-blue text-light-blue text-sm rounded-md focus:ring-accent-blue focus:border-accent-blue block w-full p-2 appearance-none cursor-pointer"
				aria-label="Select language"
			>
				{supportedLanguages.map(lng => (
					<option key={lng} value={lng}>
						{langs[lng]}
					</option>
				))}
			</select>
		</div>
	);
}

export default LanguageSwitcher;
