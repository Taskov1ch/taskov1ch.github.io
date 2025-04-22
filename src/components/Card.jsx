// src/components/Card.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { getTagStyle } from '../utils/getTagStyle';
import { getLanguageIconInfo } from '../utils/getLanguageIconInfo';
import CryptoIcon from './CryptoIcon';

function Card({ item, openCryptoModal }) {
	const { t } = useTranslation();

	// Определяем переменные как раньше
	const title = item.title || item.platform || item.method || 'Unnamed Item';
	const description = item.description;
	const username = item.username;
	const icon = item.icon || '❓';
	const link = item.link || '#';
	const technologies = item.technologies;
	const tags = item.tags;
	const type = item.type || 'link';
	const isDisabled = item.disabled === true;

	const handleClick = (event) => {
		if (isDisabled) {
			event.preventDefault();
			return;
		}
		if (type === 'crypto') {
			event.preventDefault();
			if (openCryptoModal && typeof openCryptoModal === 'function' && item.wallets) {
				openCryptoModal(item.wallets);
			} else {
				console.error("openCryptoModal func/data missing!");
			}
		}
	};

	const commonCardClasses = "block p-2 sm:p-3 bg-navy-blue rounded-lg shadow-lg border border-transparent";
	const enabledCardClasses = "transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-glow group focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-opacity-75 cursor-pointer";
	const disabledCardClasses = "opacity-60 grayscale cursor-not-allowed";

	const RootElement = isDisabled ? 'div' : 'a';

	const cardInnerContent = (
		<div className="flex items-start space-x-2 pointer-events-none">
			<span className={`text-xl sm:text-2xl pt-0.5 transition-transform duration-200 ${!isDisabled ? 'group-hover:scale-110' : ''}`}>{icon}</span>
			<div className="flex-grow min-w-0">
				<div className="flex items-center flex-wrap gap-x-2 gap-y-1 mb-0.5">
					<h3 className={`text-sm sm:text-base font-semibold transition-colors duration-200 ${isDisabled ? 'text-light-blue' : 'text-light-blue group-hover:text-accent-blue'}`}>
						{title}
					</h3>
					{Array.isArray(tags) && tags.map((tag) => {
						const tagStyle = getTagStyle(tag);
						return tagStyle ? (<span key={tag} className={`inline-block px-1.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${tagStyle.bgClass} ${tagStyle.textClass}`} title={tag}>{t(tagStyle.tKey, tag)}</span>) : null;
					})}
				</div>
				{username && (<p className="text-xs text-lighter-blue mt-0.5 truncate" title={username}>@{username}</p>)}
				{description && (<p className="text-xs text-lighter-blue mt-0.5">{description}</p>)}
				{Array.isArray(technologies) && technologies.length > 0 && (
					<div className="mt-2 flex items-center flex-wrap gap-x-1.5 gap-y-1 text-xs text-lighter-blue">
						{technologies.map((tech, index) => {
							const iconInfo = getLanguageIconInfo(tech);
								const iconToRender = iconInfo?.type === 'devicon'
								? <i className={`${iconInfo.class} text-sm leading-none`} title={tech}></i>
								: null;

							return (
								<React.Fragment key={tech}>
									{index > 0 && <span className="mx-1 font-semibold text-accent-blue">+</span>}
									<span className="inline-flex items-center gap-x-1 whitespace-nowrap">
										{iconToRender}
										<span title={tech}>{tech}</span>
									</span>
								</React.Fragment>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);

	return (
		<RootElement
			href={!isDisabled && type === 'link' ? link : undefined}
			target={!isDisabled && type === 'link' ? '_blank' : undefined}
			rel={!isDisabled && type === 'link' ? "noopener noreferrer" : undefined}
			onClick={handleClick}
			className={`${commonCardClasses} ${isDisabled ? disabledCardClasses : enabledCardClasses}`}
		>
			{cardInnerContent}
		</RootElement>
	);
}

export default Card;