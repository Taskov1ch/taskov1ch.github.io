import React from "react";
import { getLanguageIconInfo } from "../utils/getLanguageIconInfo";
import { getTagStyle } from "../utils/getTagStyle";

function Card({ item, openCryptoModal }) {
	const title = item.title || item.platform || item.method || "Unnamed Item";
	const description = item.description || "";
	const icon = item.icon || "❓";
	const link = item.link || "#";
	const username = item.username;
	const technologies = item.technologies;
	const tags = item.tags;
	const type = item.type || "link";

	const handleClick = event => {
		if (type === "crypto") {
			event.preventDefault();
			if (openCryptoModal && item.wallets) {
				openCryptoModal(item.wallets);
			} else {
				console.error("openCryptoModal function or wallets data is missing!");
			}
		}
	};

	return (
		<a
			href={link || "#"}
			target={type === "link" ? "_blank" : undefined}
			rel="noopener noreferrer"
			onClick={handleClick}
			className="
		block p-2 sm:p-3 bg-navy-blue rounded-lg shadow-lg
		border border-transparent hover:border-accent-blue
		transition-all duration-300 ease-in-out
		transform hover:-translate-y-1 hover:shadow-glow group
		focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-opacity-75
		cursor-pointer"
		>
			<div className="flex items-start space-x-2">
				<span className="text-xl sm:text-2xl pt-0.5 group-hover:scale-110 transition-transform duration-200">
					{icon}
				</span>
				<div className="flex-grow min-w-0">
					<div className="flex items-center flex-wrap gap-x-2 gap-y-1 mb-0.5">
						<h3 className="text-sm sm:text-base font-semibold text-light-blue group-hover:text-accent-blue transition-colors duration-200">
							{title}
						</h3>
						{Array.isArray(tags) &&
							tags.map(tag => {
								const tagStyle = getTagStyle(tag);
								return tagStyle ? (
									<span
										key={tag}
										className={`inline-block px-1.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${tagStyle.bgClass} ${tagStyle.textClass}`}
									>
										{tagStyle.text}
									</span>
								) : null;
							})}
					</div>
					{username && (
						<p className="text-xs text-lighter-blue mt-0.5 truncate" title={username}>
							{username}
						</p>
					)}
					{description && <p className="text-xs text-lighter-blue">{description}</p>}
					{Array.isArray(technologies) && technologies.length > 0 && (
						<div className="mt-2 flex items-center flex-wrap gap-x-1.5 gap-y-1 text-xs text-lighter-blue">
							{technologies.map((tech, index) => {
								const iconInfo = getLanguageIconInfo(tech);
								if (!iconInfo) return null;

								return (
									<React.Fragment key={tech}>
										{index > 0 && <span className="mx-1 font-semibold">+</span>}
										<span className="inline-flex items-center gap-x-1 whitespace-nowrap">
											{iconInfo.type === "devicon" ? (
												<i className={`${iconInfo.class} text-sm leading-none`} title={tech}></i>
											) : (
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-3.5 w-3.5"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
													strokeWidth={2}
													title={tech}
												>
													<path strokeLinecap="round" strokeLinejoin="round" d={iconInfo.path} />
												</svg>
											)}
											<span title={tech}>{tech}</span>
										</span>
									</React.Fragment>
								);
							})}
						</div>
					)}
				</div>
			</div>
		</a>
	);
}

export default Card;
