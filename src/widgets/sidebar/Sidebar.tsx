import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "../../shared/lib/utils";
import { useDeviceDetect } from "../../shared/hooks/useDeviceDetect";
import { FaCube, FaLink, FaMicrochip, FaTerminal } from "react-icons/fa6";
import { LanguageSwitcher } from "../../features/i18n";
import { siteConfig } from "../../shared/constants/site.config";

const NAV_ITEMS = [
	{ path: "/", label: "nav.home", icon: FaTerminal },
	{ path: "/projects", label: "nav.projects", icon: FaCube },
	{ path: "/about", label: "nav.about", icon: FaMicrochip },
	{ path: "/links", label: "nav.links", icon: FaLink },
];

export const Sidebar = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const location = useLocation();
	const device = useDeviceDetect();

	return (
		<aside className="hidden md:flex flex-col w-20 hover:w-72 transition-[width] duration-500 bg-surface/80 backdrop-blur-md border-r border-muted/20 z-50 group overflow-hidden shadow-2xl">
			<div
				onClick={() => navigate("/")}
				className="h-20 flex items-center border-b border-muted/20 relative shrink-0 overflow-hidden cursor-pointer hover:bg-black/5 transition-colors"
			>
				<div className="min-w-[5rem] flex justify-center">
					<img
						src={siteConfig.logo}
						className="w-8 h-8 transition-all duration-300"
						alt="Logo"
					/>
				</div>
				<div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pl-2">
					<h1 className="font-bold tracking-tighter text-main">
						{siteConfig.name} <span className="text-accent">//</span> {siteConfig.tagline}
					</h1>
					<div className="text-[10px] font-mono text-muted flex items-center gap-2">
						<span>ID: {siteConfig.id}</span>
						<span className="text-accent">● ON</span>
					</div>
				</div>
			</div>

			<nav className="flex-1 py-4 flex flex-col gap-1">
				{NAV_ITEMS.map(({ path, label, icon: Icon }) => {
					const isActive = location.pathname === path;
					return (
						<button
							key={path}
							onClick={() => navigate(path)}
							className={cn(
								"relative w-full flex items-center h-16 transition-all duration-200 overflow-hidden group/nav cursor-pointer",
								isActive
									? "bg-accent text-black font-bold"
									: "text-muted hover:text-main hover:bg-black/5",
							)}
						>
							<div className="min-w-[5rem] flex justify-center z-10">
								<Icon
									size={20}
									className={cn(
										"transition-transform duration-300",
										isActive ? "text-black" : "text-accent group-hover/nav:scale-110",
									)}
								/>
							</div>
							<span className="opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75 transform -translate-x-4 group-hover:translate-x-0 whitespace-nowrap tracking-widest text-sm uppercase">
								{t(label)}
							</span>
							{isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-bg z-20" />}
						</button>
					);
				})}
			</nav>

			<LanguageSwitcher
				showLabel
				className="w-full h-16 border-t border-muted/20 hover:bg-black/5 transition-colors overflow-hidden px-0"
			/>

			<div className="border-t border-muted/20 bg-bg p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
				<div className="font-mono text-[10px] text-muted">
					<span className="font-bold text-main">{siteConfig.copyright}</span>
					<br />
					{t("common.rights")}
					<br />
					DEVICE: {device}
				</div>
			</div>
		</aside>
	);
};
