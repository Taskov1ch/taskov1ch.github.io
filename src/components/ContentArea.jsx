import React from "react";
import { useTranslation } from "react-i18next";
import Card from "./Card";
import CopyCard from './CopyCard';

function ContentArea({ currentSection, data, openCryptoModal }) {
	const { t } = useTranslation();

	if (!data) {
		return <div className="text-center py-10">Loading data...</div>;
	}

	let itemsToDisplay = [];
	let sectionTitleKey = "";

	switch (currentSection) {
		case "projects":
			itemsToDisplay = data.projects || [];
			sectionTitleKey = "sections.projects";
			break;
		case "links":
			itemsToDisplay = data.links || [];
			sectionTitleKey = "sections.links";
			break;
		case "donate":
			itemsToDisplay = data.donate || [];
			sectionTitleKey = "sections.donate";
			break;
		default:
			itemsToDisplay = [];
	}

	return (
		<section id={currentSection} className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			{sectionTitleKey && (
				<h2 className="text-2xl font-semibold text-light-blue mb-6 text-center">
					{t(sectionTitleKey)}
				</h2>
			)}
			<div className="grid grid-cols-1 gap-4 sm:gap-6">
				{itemsToDisplay.length > 0 ? (
					itemsToDisplay.map((item, index) => {
						const key = `${currentSection}-${index}-${item.platform || item.title || item.method}`;

						if (item.type === 'copy') {
							return <CopyCard key={key} item={item} />;
						} else {
							// Для всех остальных типов (link, crypto или неопределен) используем Card
							return <Card key={key} item={item} openCryptoModal={openCryptoModal} />;
						}
					})
				) : (
					<p className="text-lighter-blue col-span-full text-center">
						No items to display in this section yet.
					</p>
				)}
			</div>
		</section>
	);
}

export default ContentArea;
