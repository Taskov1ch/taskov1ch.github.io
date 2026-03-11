import { motion } from "framer-motion";
import { skills } from "../config/data";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { FaCode, FaShieldHalved, FaUser } from "react-icons/fa6";

export const About = () => {
	const { t } = useTranslation();

	const categories = useMemo(() => {
		return [...new Set(skills.map((skill) => skill.category))];
	}, []);

	return (
		<div className="h-full w-full overflow-y-auto p-6 md:p-12 custom-scrollbar">
			<div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 pb-12">
				<div className="flex-1">
					<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
						<h2 className="text-xs font-mono text-accent mb-2 tracking-widest">// {t("about.title")}</h2>
						<h1 className="text-5xl md:text-7xl font-bold font-sans text-main mb-8 tracking-tighter">TASKOV1CH</h1>

						<div className="bg-surface border border-zinc-800/20 p-8 relative overflow-hidden group shadow-sm">
							<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-transparent to-transparent opacity-50" />
							<div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

							<div className="font-mono text-muted leading-relaxed text-sm relative z-10">
								<p className="mb-2"><span className="text-accent">&gt;</span> {t("about.role_label")}: <span className="text-main font-bold">{t("about.role_val")}</span></p>
								<p className="mb-2"><span className="text-accent">&gt;</span> {t("about.level_label")}: <span className="text-main">{t("about.level_val")}</span></p>
								<p className="mb-6"><span className="text-accent">&gt;</span> {t("about.location_label")}: <span className="text-main">{t("about.location_val")}</span></p>

								<p className="text-main/80 border-l-2 border-muted/30 pl-4 py-1 italic">{t("about.bio")}</p>
							</div>

							<div className="flex gap-4 mt-8 relative z-10">
								<div className="flex items-center gap-2 text-muted font-mono text-xs border border-zinc-800/20 px-3 py-1 bg-bg">
									<FaUser size={12} /> {t("about.tag_developer")}
								</div>
								<div className="flex items-center gap-2 text-muted font-mono text-xs border border-zinc-800/20 px-3 py-1 bg-bg">
									<FaShieldHalved size={12} /> {t("about.tag_available")}
								</div>
							</div>
						</div>
					</motion.div>
				</div>

				<div className="w-full lg:w-1/3">
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.2 }}
						className="bg-bg border border-zinc-800/20 p-8 h-full"
					>
						<h3 className="font-sans text-2xl font-bold text-main mb-8 flex items-center gap-2">
							<FaCode className="text-accent" size={20} /> {t("about.skills")}
						</h3>

						<div className="space-y-8">
							{categories.map((category) => (
								<div key={category}>
									<h4 className="font-mono text-[10px] text-muted mb-3 border-b border-zinc-800/20 pb-1 uppercase">
                    // {category}
									</h4>
									<div className="space-y-3">
										{skills.filter(s => s.category === category).map(skill => (
											<div key={skill.name} className="group/skill">
												<div className="flex justify-between mb-1">
													<span className="text-sm font-bold text-main/80 group-hover/skill:text-main transition-colors">{skill.name}</span>
													<span className="font-mono text-xs text-accent">{skill.level}%</span>
												</div>

												<div className="h-1.5 w-full bg-muted/20 overflow-hidden">
													<motion.div
														initial={{ width: 0 }}
														whileInView={{ width: `${skill.level}%` }}
														transition={{ duration: 1, ease: "circOut" }}
														className="h-full bg-main group-hover/skill:bg-accent transition-colors"
													/>
												</div>
											</div>
										))}
									</div>
								</div>
							))}
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);
};