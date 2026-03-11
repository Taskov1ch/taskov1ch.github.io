import React from "react";
import { Sidebar } from "./Sidebar";
import { MobileHeader } from "./MobileHeader";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const Layout = ({ children }: { children: React.ReactNode }) => {
	const location = useLocation();
	const { t } = useTranslation();

	const getPageTitle = () => {
		const path = location.pathname;
		if (path === "/") return "HOME";
		return path.substring(1).toUpperCase();
	}

	return (
		<div className="flex h-[100dvh] w-full bg-bg text-main font-sans overflow-hidden">
			<MobileHeader />
			<Sidebar />

			<main className="flex-1 flex flex-col relative overflow-hidden pt-16 md:pt-0">
				<header className="hidden md:flex h-16 border-b border-zinc-800/20 items-center justify-between px-8 bg-surface/30 backdrop-blur-md shrink-0 z-40">
					<div className="flex items-center gap-4">
						<div className="h-2 w-2 bg-accent rotate-45" />
						<span className="font-mono text-sm tracking-widest text-accent">
							:: {t("common.viewing")} {getPageTitle()} ::
						</span>
					</div>
					<div className="font-mono text-xs text-zinc-500">
						// {t("common.portfolio_terminal")}
					</div>
				</header>

				<div className="flex-1 overflow-auto relative scroll-smooth custom-scrollbar p-0">
					{children}
				</div>

				<div className="pointer-events-none absolute inset-0 p-4 hidden md:block z-30">
					<div className="absolute top-20 left-4 w-4 h-[1px] bg-accent/50" />
					<div className="absolute top-20 right-4 w-4 h-[1px] bg-accent/50" />
					<div className="absolute bottom-4 left-4 w-4 h-[1px] bg-accent/50" />
					<div className="absolute bottom-4 right-4 w-4 h-[1px] bg-accent/50" />
				</div>
			</main>
		</div>
	);
};