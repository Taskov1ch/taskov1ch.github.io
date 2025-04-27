import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getTagStyle } from '../utils/getTagStyle';
import { ClipboardDocumentIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { getLanguageIconInfo } from '../utils/getLanguageIconInfo';

function ActionButton({ action, t }) {
	const [isCopied, setIsCopied] = useState(false);

	const handleActionClick = useCallback((event) => {
		event.preventDefault();
		event.stopPropagation();

		if (action.type === 'copy' && navigator.clipboard && action.value) {
			navigator.clipboard.writeText(action.value).then(() => {
				setIsCopied(true);
				setTimeout(() => setIsCopied(false), 1500);
			}).catch(err => {
				console.error("Copy failed:", err);
				alert(t('clipboard.error', 'Copy failed!'));
			});
		} else if (action.type === 'copy' && (!navigator.clipboard || !action.value)) {
			alert(t('clipboard.unavailable', 'Cannot copy.'));
		}
	}, [action, t]);

	let IconComponent = ClipboardDocumentIcon;
	let titleText = action.label || t('clipboard.copy', 'Copy');

	if (action.type === 'copy' && isCopied) {
		IconComponent = CheckCircleIcon;
		titleText = t('modal.copied', 'Copied!');
	}

	return (
		<button
			type="button"
			onClick={handleActionClick}
			className={`p-1 rounded text-gray-400 hover:text-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue ${isCopied ? 'text-emerald-400 hover:text-emerald-400' : ''
				}`}
			title={titleText}
			disabled={isCopied && action.type === 'copy'}
			aria-label={action.label || titleText}
		>
			<IconComponent className="w-4 h-4" />
		</button>
	);
}

function Card({ item, openCryptoModal }) {
	const { t } = useTranslation();

	const actions = item.actions;

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
		<div className="flex flex-row justify-between items-start w-full gap-2">

			<div className="flex items-start space-x-2 flex-grow min-w-0 pointer-events-none">
				<span className={`text-xl sm:text-2xl pt-0.5 transition-transform duration-200 ${!isDisabled ? 'group-hover:scale-110' : ''}`}>{icon}</span>
				<div className="flex-grow min-w-0">
					<div className="flex items-center flex-wrap gap-x-2 gap-y-1 mb-0.5">
						<h3 className={`text-sm sm:text-base font-semibold transition-colors duration-200 ${isDisabled ? 'text-light-blue' : 'text-light-blue group-hover:text-accent-blue'}`}>{title}</h3>
						{Array.isArray(tags) && tags.map((tag) => { const tagStyle = getTagStyle(tag); return tagStyle ? (<span key={tag} className={`inline-block px-1.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${tagStyle.bgClass} ${tagStyle.textClass}`} title={tag}>{t(tagStyle.tKey, tag)}</span>) : null; })}
					</div>
					{username && (<p className="text-xs text-lighter-blue mt-0.5 truncate" title={username}>{username}</p>)}
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

			{!isDisabled && Array.isArray(actions) && actions.length > 0 && (
				<div className="flex flex-col items-end space-y-1 flex-shrink-0 pointer-events-auto">
					{actions.map((action, index) => (
						<ActionButton key={index} action={action} t={t} />
					))}
				</div>
			)}
		</div>
	);

	return (
		<RootElement
			href={!isDisabled && type === 'link' ? link : undefined}
			target={!isDisabled && type === 'link' ? '_blank' : undefined}
			rel={!isDisabled && type === 'link' ? "noopener noreferrer" : undefined}
			onClick={handleClick}
			className={`${commonCardClasses} ${isDisabled ? disabledCardClasses : enabledCardClasses}`}
			style={{ display: 'flex' }}
		>
			{cardInnerContent}
		</RootElement>
	);
}

export default Card;