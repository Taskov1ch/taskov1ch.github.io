import { motion } from "framer-motion";
import { useData } from "../../features/data";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { FaCode, FaShieldHalved, FaUser } from "react-icons/fa6";
import { Card } from "../../shared/ui/card";
import { Badge } from "../../shared/ui/badge";
import { siteConfig } from "../../shared/constants/site.config";

export const AboutPage = () => {
	const { t } = useTranslation();
	const { skills } = useData();

	const categories = useMemo(() => {
		return [...new Set(skills.map((skill) => skill.category))];
	}, [skills]);

	return (
		<div className="h-full w-full overflow-y-auto p-6 md:p-12 custom-scrollbar">
			<div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 pb-12">
				<div className="flex-1">
					<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
						<h2 className="text-xs font-mono text-accent mb-2 tracking-widest">// {t("about.title")}</h2>
						<h1 className="text-5xl md:text-7xl font-bold font-sans text-main mb-8 tracking-tighter">{siteConfig.name}</h1>

						<Card variant="elevated" className="p-8 relative group">
							<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-transparent to-transparent opacity-50" />
							<div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

							<div className="font-mono text-muted leading-relaxed text-sm relative z-10">
								<p className="mb-2">
									<span className="text-accent">&gt;</span> {t("about.role_label")}:{" "}
									<span className="text-main font-bold">{t("about.role_val")}</span>
								</p>
								<p className="mb-2">
									<span className="text-accent">&gt;</span> {t("about.level_label")}:{" "}
									<span className="text-main">{t("about.level_val")}</span>
								</p>
								<p className="mb-6">
									<span className="text-accent">&gt;</span> {t("about.location_label")}:{" "}
									<span className="text-main">{t("about.location_val")}</span>
								</p>

								<p className="text-main/80 border-l-2 border-muted/30 pl-4 py-1 italic">
									{t("about.bio")}
								</p>
							</div>

							<div className="flex gap-4 mt-8 relative z-10">
								<Badge variant="outline">
									<FaUser size={12} /> {t("about.tag_developer")}
								</Badge>
								<Badge variant="outline">
									<FaShieldHalved size={12} /> {t("about.tag_available")}
								</Badge>
							</div>
						</Card>
					</motion.div>
				</div>

				<div className="w-full lg:w-1/3">
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.2 }}
					>
						<Card variant="outline" className="p-8 h-full bg-bg">
							<h3 className="font-sans text-2xl font-bold text-main mb-8 flex items-center gap-2">
								<FaCode className="text-accent" size={20} /> {t("about.skills")}
							</h3>

							<div className="space-y-8">
								{categories.map((category) => (
									<div key={category}>
										<h4 className="font-mono text-[10px] text-muted mb-3 border-b border-muted/20 pb-1 uppercase">
											// {category}
										</h4>
										<div className="space-y-3">
											{skills
												.filter((s) => s.category === category)
												.map((skill) => (
													<div key={skill.name} className="group/skill">
														<div className="flex justify-between mb-1">
															<span className="text-sm font-bold text-main/80 group-hover/skill:text-main transition-colors">
																{skill.name}
															</span>
															<span className="font-mono text-xs text-accent">
																{skill.level}%
															</span>
														</div>

														<div className="h-1.5 w-full bg-muted/20 overflow-hidden relative">
															<div
																className="h-full bg-main group-hover/skill:bg-accent transition-colors skill-bar-fill"
																style={{ "--fill-width": `${skill.level}%` } as React.CSSProperties}
															/>
														</div>
													</div>
												))}
										</div>
									</div>
								))}
							</div>
						</Card>
					</motion.div>
				</div>
			</div>
		</div>
	);
};
