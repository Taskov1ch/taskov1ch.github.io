import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaArrowRight, FaTerminal } from "react-icons/fa6";
import { Button } from "../../shared/ui/button";
import { siteConfig } from "../../shared/constants/site.config";

export const HomePage = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();

	return (
		<div className="h-full w-full flex flex-col justify-center relative p-8 md:p-16 overflow-hidden scan-line">
			<div className="absolute inset-0 pointer-events-none opacity-60 bg-[size:50px_50px] bg-[radial-gradient(rgba(255,255,255,0.3)_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom,white,transparent)] animate-grid-move" />

			<div className="relative z-10 max-w-4xl">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="font-mono text-accent text-sm mb-4 tracking-widest flex items-center gap-2"
				>
					<span className="inline-block w-2 h-2 bg-accent" />
					{t("home.welcome")}
				</motion.div>

				<motion.h1
					initial={{ opacity: 0, x: -50 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="text-6xl md:text-9xl font-bold font-sans tracking-tighter text-main leading-none mb-4 glitch-text"
					data-text={siteConfig.name}
				>
					{siteConfig.name}
				</motion.h1>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					className="text-2xl md:text-4xl text-muted font-sans uppercase tracking-tight mb-12"
				>
					{t("home.subtitle")}
				</motion.div>

				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.4, delay: 0.6 }}
				>
					<Button
						variant="outline"
						size="lg"
						onClick={() => navigate("/about")}
						className="gap-4 group"
					>
						<FaTerminal size={20} />
						<span>{t("about.title")}</span>
						<FaArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
					</Button>
				</motion.div>
			</div>

			<div className="absolute bottom-8 right-8 font-mono text-xs text-muted/40 text-right hidden md:block">
				<p>{t("home.built_with")}: VITE</p>
				<p>{t("home.framework")}: REACT 19</p>
				<p>{t("home.style")}: TAILWIND 4</p>
			</div>
		</div>
	);
};
