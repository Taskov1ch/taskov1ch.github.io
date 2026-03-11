import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useDeviceDetect } from "../../shared/hooks/useDeviceDetect";
import { FaBars, FaSignal } from "react-icons/fa6";
import { LanguageSwitcher } from "../../features/i18n";
import { MusicToggle } from "../../features/audio";
import { Drawer } from "../../shared/ui/drawer";
import { cn } from "../../shared/lib/utils";
import { siteConfig } from "../../shared/constants/site.config";

const NAV_ITEMS = [
	{ path: "/", label: "nav.home" },
	{ path: "/projects", label: "nav.projects" },
	{ path: "/about", label: "nav.about" },
	{ path: "/links", label: "nav.links" },
];

export const MobileHeader = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { t } = useTranslation();
	const navigate = useNavigate();
	const location = useLocation();
	const device = useDeviceDetect();

	const navTo = (path: string) => {
		navigate(path);
		setIsOpen(false);
	};

	const handleLogoClick = () => {
		navigate("/");
		setIsOpen(false);
	};

	return (
		<>
			<header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-surface/90 backdrop-blur-md border-b border-muted/20 z-[60] flex items-center justify-between px-6">
				<div
					onClick={handleLogoClick}
					className="select-none text-lg font-bold tracking-tighter text-main flex items-center gap-1 cursor-pointer active:opacity-70 transition-opacity"
				>
					<img
						src={siteConfig.logo}
						className="w-6 h-6 mr-2"
						alt="Logo"
					/>
					{siteConfig.name}<span className="text-accent">//</span>{siteConfig.tagline}
				</div>
				<div className="flex items-center gap-3">
					<button onClick={() => setIsOpen(true)} className="text-accent p-1 cursor-pointer">
						<FaBars />
					</button>
				</div>
			</header>

			<Drawer
				open={isOpen}
				onOpenChange={(details) => setIsOpen(details.open)}
				title={t("nav.menu")}
			>
				<nav className="flex-1 p-8 flex flex-col gap-4 overflow-y-auto">
					{NAV_ITEMS.map((item, idx) => (
						<motion.button
							key={item.path}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: idx * 0.1 }}
							onClick={() => navTo(item.path)}
							className={cn(
								"text-left p-4 border-l-2 text-2xl font-bold font-sans tracking-tight flex items-center justify-between group cursor-pointer",
								location.pathname === item.path
									? "border-accent text-main bg-white/5"
									: "border-muted/20 text-muted",
							)}
						>
							<span className="flex items-center gap-4">
								<span className="text-xs font-mono text-accent">0{idx + 1}</span>
								{t(item.label)}
							</span>
							{location.pathname === item.path && (
								<div className="w-2 h-2 bg-accent" />
							)}
						</motion.button>
					))}
				</nav>

				<MusicToggle
					showLabel
					className="w-full h-14 border-t border-muted/20 hover:bg-white/5 transition-colors px-0"
				/>

				<LanguageSwitcher
					showLabel
					className="w-full h-14 border-t border-muted/20 hover:bg-white/5 transition-colors px-0"
				/>

				<div className="p-8 bg-bg border-t border-muted/20 shrink-0">
					<div className="flex items-center gap-3 text-xs font-mono text-muted mb-2">
						<FaSignal size={12} className="text-accent" />
						<span>SIGNAL: STRONG</span>
					</div>
					<div className="font-mono text-xs text-muted">
						ID: {siteConfig.id}
						<br />
						DEVICE: {device}
						<br />
						<br />
						<span className="font-bold text-main">{siteConfig.copyright}</span>
						<br />
						{t("common.rights")}
					</div>
				</div>
			</Drawer>
		</>
	);
};
