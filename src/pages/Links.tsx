import { motion } from "framer-motion";
import { links } from "../config/data";
import { useTranslation } from "react-i18next";
import { FaDiscord, FaGithub, FaLink, FaSteam, FaTelegram, FaVk } from "react-icons/fa6";
import { BsArrowUpRight } from "react-icons/bs";
import { FaMailBulk } from "react-icons/fa";

export const Links = () => {
	const { t } = useTranslation();

	const getIcon = (label: string) => {
		switch (label) {
			case "GITHUB": return FaGithub;
			case "VK": return FaVk;
			case "TELEGRAM": return FaTelegram;
			case "MAIL": return FaMailBulk;
			case "STEAM": return FaSteam;
			case "DISCORD": return FaDiscord;
			default: return FaLink;
		}
	};

	return (
		<div className="h-full w-full p-8 md:p-16 overflow-y-auto custom-scrollbar">
			<div className="max-w-5xl mx-auto">
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-12 border-b border-zinc-800/20 pb-8 flex flex-col md:flex-row justify-between md:items-end gap-4"
				>
					<div>
						<h2 className="text-xs font-mono text-accent mb-2">// {t("links.subtitle")}</h2>
						<h1 className="text-6xl font-sans font-bold text-main">{t("links.title")}</h1>
					</div>
					<div className="font-mono text-xs text-zinc-600 text-right">
						{t("links.connect")}<br />
						{t("links.ping")}: 14ms
					</div>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{links.map((link, index) => {
						const Icon = getIcon(link.label.split("_")[0]);
						return (
							<motion.a
								key={link.id}
								href={link.url}
								target="_blank"
								rel="noopener noreferrer"
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: index * 0.1 }}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className="group relative bg-surface border border-zinc-800/20 h-48 p-8 flex flex-col justify-between overflow-hidden hover:border-accent transition-colors duration-300"
							>
								<div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />

								<div className="relative z-10 flex justify-between items-start">
									<Icon size={32} className="text-main group-hover:text-black transition-colors" />
									<BsArrowUpRight size={24} className="text-zinc-600 group-hover:text-black transition-colors" />
								</div>

								<div className="relative z-10">
									<span className="font-mono text-xs text-zinc-500 group-hover:text-black/70 mb-1 block">
										:: {link.category}
									</span>
									<h3 className="text-3xl font-bold font-sans text-main group-hover:text-black transition-colors">
										{link.label}
									</h3>
								</div>

								<div className="absolute top-0 right-0 w-8 h-8 border-l border-b border-zinc-800/20 bg-bg z-10 group-hover:bg-accent group-hover:border-black/10 transition-colors" />
							</motion.a>
						);
					})}
				</div>
			</div>
		</div>
	);
};