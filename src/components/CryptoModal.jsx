import React, { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ClipboardDocumentIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import CryptoIcon from "./CryptoIcon";

function WalletRow({ wallet }) {
	const { t } = useTranslation();
	const [isCopied, setIsCopied] = useState(false);

	const handleCopy = useCallback(() => {
		if (navigator.clipboard && wallet.address) {
			navigator.clipboard
				.writeText(wallet.address)
				.then(() => {
					setIsCopied(true);
					console.log(t("clipboard.success"));
					setTimeout(() => setIsCopied(false), 2000);
				})
				.catch(err => {
					console.error(t("clipboard.error"), err);
					alert(t("clipboard.error"));
				});
		} else {
			console.warn(t("clipboard.unavailable"));
			alert(t("clipboard.unavailable"));
		}
	}, [wallet.address, t]);

	if (!wallet) return null;

	return (
		<div className="py-3 border-b border-gray-700 last:border-b-0">
			<div className="flex items-center gap-2 mb-2 px-1">
				<CryptoIcon ticker={wallet.name} currencyName={wallet.currency} className="w-5 h-5" />
				<div className="flex-grow">
					<p className="text-sm font-semibold text-light-blue">
						{wallet.currency} ({wallet.name})
					</p>
					{wallet.network && <p className="text-xs text-gray-400">{wallet.network}</p>}
				</div>
				<div className="bg-dark-blue rounded mx-1 p-2 flex items-center justify-between gap-2 border border-gray-700">
					<code
						className="block text-xs text-lighter-blue break-all select-all flex-grow"
						title={wallet.address}
					>
						{wallet.address}
					</code>
					<button
						onClick={handleCopy}
						className={`flex-shrink-0 p-1.5 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-blue ${
							isCopied
								? "text-emerald-400 focus:ring-emerald-500 cursor-default"
								: "text-accent-blue hover:text-accent-blue-light focus:ring-accent-blue"
						}`}
						disabled={isCopied}
						aria-label={t("modal.copyAlt", { currency: wallet.name || wallet.currency })}
						title={isCopied ? t("modal.copied") : t("clipboard.copy")}
					>
						{isCopied ? (
							<CheckCircleIcon className="w-5 h-5" />
						) : (
							<ClipboardDocumentIcon className="w-5 h-5" />
						)}
					</button>
				</div>
			</div>
		</div>
	);
}

function CryptoModal({ isOpen, onClose, wallets }) {
	const { t } = useTranslation();

	useEffect(() => {
		const handleKeyDown = event => {
			if (event.key === "Escape") {
				onClose();
			}
		};
		if (isOpen) {
			window.addEventListener("keydown", handleKeyDown);
		}

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen, onClose]);

	const backdropVariants = {
		hidden: { opacity: 0 },
		visible: { opacity: 1 }
	};

	const modalVariants = {
		hidden: { opacity: 0, scale: 0.95 },
		visible: { opacity: 1, scale: 1 },
		exit: { opacity: 0, scale: 0.95 }
	};

	return (
		<motion.div
			className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4"
			variants={backdropVariants}
			initial="hidden"
			animate="visible"
			exit="hidden"
			transition={{ duration: 0.2, ease: "easeOut" }}
			onClick={onClose}
		>
			<motion.div
				className="bg-navy-blue rounded-lg shadow-xl w-full max-w-md lg:max-w-xl max-h-[80vh] flex flex-col overflow-hidden"
				variants={modalVariants}
				transition={{ duration: 0.2, ease: "easeOut" }}
				onClick={e => e.stopPropagation()}
			>
				<div className="flex-shrink-0 px-4 py-3 border-b border-gray-700 flex justify-between items-center">
					<h2 className="text-lg font-semibold text-light-blue">{t("modal.cryptoTitle")}</h2>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-white transition-colors text-2xl leading-none"
						aria-label={t("modal.close")}
					>
						&times;
					</button>
				</div>

				<div className="p-4 overflow-y-auto">
					{wallets && wallets.length > 0 ? (
						wallets.map(wallet => (
							<WalletRow key={wallet.name || wallet.currency} wallet={wallet} />
						))
					) : (
						<p className="text-center text-gray-400 py-4">{t("modal.noWallets")}</p>
					)}
				</div>
			</motion.div>
		</motion.div>
	);
}

export default CryptoModal;
