import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaGlobe } from "react-icons/fa6";
import { Dialog } from "@ark-ui/react/dialog";
import { Portal } from "@ark-ui/react/portal";
import { AnimatePresence, motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { cn } from "../../shared/lib/utils";
import { siteConfig } from "../../shared/constants/site.config";

const languages = [...siteConfig.languages];

interface LanguageSwitcherProps {
	showLabel?: boolean;
	className?: string;
}

export const LanguageSwitcher = ({ showLabel = false, className }: LanguageSwitcherProps) => {
	const { i18n } = useTranslation();
	const [modalOpen, setModalOpen] = useState(false);

	if (languages.length <= 1) return null;

	const currentLang = languages.find((l) => l.code === i18n.language) ?? languages[0];

	if (languages.length === 2) {
		const otherLang = languages.find((l) => l.code !== i18n.language) ?? languages[0];
		const toggle = () => i18n.changeLanguage(otherLang.code);

		return (
			<button
				onClick={toggle}
				className={cn(
					"flex items-center text-muted hover:text-main transition-colors cursor-pointer",
					className,
				)}
				aria-label="Toggle language"
			>
				{showLabel ? (
					<div className="min-w-[5rem] flex justify-center">
						<FaGlobe size={20} className="text-accent" />
					</div>
				) : (
					<FaGlobe size={20} className="text-accent" />
				)}
				{showLabel && (
					<span className="font-mono text-xs text-accent whitespace-nowrap tracking-widest">
						LANG: [{currentLang.code.toUpperCase()}]
					</span>
				)}
			</button>
		);
	}

	return (
		<>
			<button
				onClick={() => setModalOpen(true)}
				className={cn(
					"flex items-center text-muted hover:text-main transition-colors cursor-pointer",
					className,
				)}
				aria-label="Select language"
			>
				{showLabel ? (
					<div className="min-w-[5rem] flex justify-center">
						<FaGlobe size={20} className="text-accent" />
					</div>
				) : (
					<FaGlobe size={20} className="text-accent" />
				)}
				{showLabel && (
					<span className="font-mono text-xs text-accent whitespace-nowrap tracking-widest">
						LANG: [{currentLang.code.toUpperCase()}]
					</span>
				)}
			</button>

			<Dialog.Root open={modalOpen} onOpenChange={(d) => setModalOpen(d.open)}>
				<AnimatePresence>
					{modalOpen && (
						<Portal>
							<Dialog.Backdrop asChild>
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
								/>
							</Dialog.Backdrop>
							<Dialog.Positioner className="fixed inset-0 z-[80] flex items-center justify-center p-4">
								<Dialog.Content asChild>
									<motion.div
										initial={{ opacity: 0, scale: 0.95 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.95 }}
										transition={{ duration: 0.2 }}
										className="bg-surface border border-muted/20 w-full max-w-xs shadow-2xl"
									>
										<div className="h-14 flex items-center justify-between px-5 border-b border-muted/20">
											<Dialog.Title className="font-mono text-sm text-accent tracking-widest flex items-center gap-2">
												<span className="w-2 h-2 bg-accent" />
												:: LANGUAGE
											</Dialog.Title>
											<Dialog.CloseTrigger className="p-1.5 border border-accent text-accent hover:bg-accent hover:text-black transition-colors cursor-pointer">
												<FaTimes size={14} />
											</Dialog.CloseTrigger>
										</div>
										<div className="p-3 flex flex-col gap-1">
											{languages.map((lang) => (
												<button
													key={lang.code}
													onClick={() => {
														i18n.changeLanguage(lang.code);
														setModalOpen(false);
													}}
													className={cn(
														"flex items-center gap-3 w-full px-4 py-3 text-left transition-colors cursor-pointer",
														lang.code === i18n.language
															? "bg-accent text-black font-bold"
															: "text-muted hover:text-main hover:bg-white/5",
													)}
												>
													<span className="text-xl">{lang.flag}</span>
													<span className="font-mono text-sm tracking-wide">{lang.name}</span>
													<span className="ml-auto font-mono text-xs opacity-60">
														{lang.code.toUpperCase()}
													</span>
												</button>
											))}
										</div>
									</motion.div>
								</Dialog.Content>
							</Dialog.Positioner>
						</Portal>
					)}
				</AnimatePresence>
			</Dialog.Root>
		</>
	);
};
