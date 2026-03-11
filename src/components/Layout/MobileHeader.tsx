import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { useDeviceDetect } from "../../hooks/useDeviceDetect";
import { FaBars, FaMoon, FaSignal, FaSun } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import { useTheme } from "../../hooks/useTheme";

export const MobileHeader = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { t, i18n } = useTranslation();
	const navigate = useNavigate();
	const location = useLocation();
	const device = useDeviceDetect();

	const { theme, toggleTheme } = useTheme();
	const toggleLang = () => i18n.changeLanguage(i18n.language === "en" ? "ru" : "en");

	const navTo = (path: string) => {
		navigate(path);
		setIsOpen(false);
	}

	const handleLogoClick = () => {
		navigate("/");
		setIsOpen(false);
	}

	return (
		<>
			<header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-surface/90 backdrop-blur-md border-b border-zinc-800/20 z-[60] flex items-center justify-between px-6">
				<div
					onClick={handleLogoClick}
					className="select-none text-lg font-bold tracking-tighter text-main flex items-center gap-1 cursor-pointer active:opacity-70 transition-opacity"
				>
					TASKOV1CH<span className="text-accent">//</span>DEV
				</div>
				<div className="flex items-center gap-3">
					<button onClick={toggleTheme} className="text-zinc-400 p-2">
						{theme === "dark" ? <FaMoon size={16} /> : <FaSun size={16} />}
					</button>
					<button onClick={toggleLang} className="font-mono text-xs text-zinc-400 border border-zinc-700 px-2 py-1 rounded-sm">
						{i18n.language.toUpperCase()}
					</button>
					<button onClick={() => setIsOpen(true)} className="text-accent p-1">
						<FaBars />
					</button>
				</div>
			</header>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ x: "100%" }}
						animate={{ x: 0 }}
						exit={{ x: "100%" }}
						transition={{ type: "spring", damping: 25, stiffness: 200 }}
						className="fixed inset-0 z-[70] bg-bg flex flex-col md:hidden h-[100dvh]"
					>
						<div className="h-16 flex items-center justify-between px-6 border-b border-zinc-800/20 bg-surface shrink-0">
							<span className="font-mono text-sm text-accent tracking-widest flex items-center gap-2">
								<span className="w-2 h-2 bg-accent animate-pulse"></span>
								:: {t("nav.menu")}
							</span>
							<button onClick={() => setIsOpen(false)} className="text-accent p-2 border border-accent active:bg-accent active:text-black transition-colors">
								<FaTimes size={24} />
							</button>
						</div>

						<nav className="flex-1 p-8 flex flex-col gap-4 overflow-y-auto">
							{[
								{ path: "/", label: "nav.home" },
								{ path: "/projects", label: "nav.projects" },
								{ path: "/about", label: "nav.about" },
								{ path: "/links", label: "nav.links" },
							].map((item, idx) => (
								<motion.button
									key={item.path}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: idx * 0.1 }}
									onClick={() => navTo(item.path)}
									className={`text-left p-4 border-l-2 text-2xl font-bold font-sans tracking-tight flex items-center justify-between group ${location.pathname === item.path
										? "border-accent text-main bg-white/5"
										: "border-zinc-800/20 text-zinc-500"
										}`}
								>
									<span className="flex items-center gap-4">
										<span className="text-xs font-mono text-accent">0{idx + 1}</span>
										{t(item.label)}
									</span>
									{location.pathname === item.path && <div className="w-2 h-2 bg-accent animate-pulse" />}
								</motion.button>
							))}
						</nav>

						<div className="p-8 bg-bg border-t border-zinc-800/20 shrink-0">
							<div className="flex items-center gap-3 text-xs font-mono text-zinc-600 mb-2">
								<FaSignal size={12} className="text-accent" />
								<span>SIGNAL: STRONG</span>
							</div>
							<div className="font-mono text-xs text-zinc-600">
								ID: 04-05-08 <br />
								DEVICE: {device} <br /><br />
								<span className="font-bold text-zinc-400">© 2025 TASKOV1CH</span><br />
								{t("common.rights")}
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};