import React from "react";
import { useTranslation } from "react-i18next";

function NavigationBar({ currentSection, setCurrentSection }) {
	const { t } = useTranslation();
	const sections = ["projects", "links", "donate"];

	const getIcon = section => {
		switch (section) {
			case "projects":
				return "💼";
			case "links":
				return "🔗";
			case "donate":
				return "💖";
			default:
				return "";
		}
	};

	return (
		<nav className="fixed bottom-0 left-0 right-0 h-[60px] bg-navy-blue shadow-lg z-40 border-t border-gray-700">
			<div className="grid grid-cols-3 place-items-center h-full max-w-3xl mx-auto px-4">
				{sections.map(section => (
					<button
						key={section}
						onClick={() => setCurrentSection(section)}
						className={`
              flex flex-col items-center justify-center px-3 py-1 rounded-md transition-all duration-200 ease-in-out focus:outline-none
              ${currentSection === section
								? "text-accent-blue scale-110"
								: "text-lighter-blue hover:text-light-blue"
							}
            `}
						aria-current={currentSection === section ? "page" : undefined}
					>
						<span className="text-lg">{getIcon(section)}</span>

						<span className="text-xs font-medium mt-1">{t(`nav.${section}`)}</span>
					</button>
				))}
			</div>
		</nav>
	);
}

export default NavigationBar;
