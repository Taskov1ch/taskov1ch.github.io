import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { getTagStyle } from '../utils/getTagStyle';

function CopyCard({ item }) {
	const { t } = useTranslation();
	const [isCopied, setIsCopied] = useState(false);

	const title = item.platform || item.title || 'Unnamed';
	const displayValue = item.displayValue || item.value;
	const valueToCopy = item.value;
	const icon = item.icon || '❓';
	const tags = item.tags;
	const isDisabled = item.disabled === true;

	const handleCopy = useCallback((event) => {
		if (isDisabled || isCopied || !navigator.clipboard || !valueToCopy) {
			if (!isDisabled && !isCopied && navigator.clipboard) {
				alert(t('clipboard.unavailable', 'Cannot copy.'));
			}
			return;
		};
		event.preventDefault();
		navigator.clipboard.writeText(valueToCopy).then(() => {
			setIsCopied(true);
			setTimeout(() => setIsCopied(false), 1500);
		}).catch(err => {
			console.error("Copy failed:", err);
			alert(t('clipboard.error', 'Copy failed!'));
		});
	}, [valueToCopy, isDisabled, isCopied, t]);

	const commonCardClasses = "block p-2 sm:p-3 bg-navy-blue rounded-lg shadow-lg border border-transparent relative overflow-hidden text-left w-full";
	const enabledCardClasses = "transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-glow group focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-opacity-75 cursor-pointer";
	const disabledCardClasses = "opacity-60 grayscale cursor-not-allowed";
	const copiedBgClass = "bg-emerald-600";

	let currentRootClasses = `${commonCardClasses}`;

	if (isDisabled) {
		currentRootClasses += ` ${disabledCardClasses}`;
	} else if (isCopied) {
		currentRootClasses = `${commonCardClasses.replace('bg-navy-blue', '')} ${copiedBgClass}`;
	} else {
		currentRootClasses += ` ${enabledCardClasses}`;
	}

	return (
		<div
			onClick={handleCopy}
			className={currentRootClasses}
			role="button"
			tabIndex={isDisabled ? -1 : 0}
			aria-label={isCopied ? t('modal.copied') : `${title}: ${displayValue}. ${t('clipboard.copy', 'Click to copy')}`}
			title={isDisabled ? undefined : (isCopied ? t('modal.copied') : t('clipboard.copy', 'Click to copy'))}
		>
			<div className={`transition-opacity duration-200 ${isCopied ? 'opacity-0' : 'opacity-100'}`}>
				<div className="flex items-start space-x-2 pointer-events-none">
					<span className={`text-xl sm:text-2xl pt-0.5 transition-transform duration-200 ${!isDisabled ? 'group-hover:scale-110' : ''}`}>{icon}</span>
					<div className="flex-grow min-w-0">
						<div className="flex items-center flex-wrap gap-x-2 gap-y-1 mb-0.5">
							<h3 className={`text-sm sm:text-base font-semibold transition-colors duration-200 ${isDisabled ? 'text-light-blue' : 'text-light-blue group-hover:text-accent-blue'}`}>{title}</h3>
							{Array.isArray(tags) && tags.map((tag) => { const tagStyle = getTagStyle(tag); return tagStyle ? (<span key={tag} className={`inline-block px-1.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${tagStyle.bgClass} ${tagStyle.textClass}`} title={tag}>{t(tagStyle.tKey, tag)}</span>) : null; })}
						</div>
						{displayValue && (
							<p className="text-xs text-lighter-blue mt-0.5 truncate" title={valueToCopy}>
								{displayValue}
							</p>
						)}
					</div>
				</div>
			</div>

			{isCopied && (
				<div className="absolute inset-0 flex items-center justify-center gap-2 pointer-events-none text-emerald-100">
					<CheckCircleIcon className="w-5 h-5" />
					<span className="font-semibold text-sm">
						{t('modal.copied', 'Copied!')}
					</span>
				</div>
			)}
		</div>
	);
}

export default CopyCard;