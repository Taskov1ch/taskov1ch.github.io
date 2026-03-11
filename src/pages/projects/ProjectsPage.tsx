import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useData } from "../../features/data";
import { useTranslation } from "react-i18next";
import { useGitHubReadme } from "../../features/github";
import { cn } from "../../shared/lib/utils";
import { FaFolder, FaPlay, FaSpinner, FaStar } from "react-icons/fa6";
import { FaExternalLinkAlt, FaTimes } from "react-icons/fa";
import { Badge } from "../../shared/ui/badge";
import { Button } from "../../shared/ui/button";

export const ProjectsPage = () => {
	const { projects } = useData();
	const [activeId, setActiveId] = useState<string>(projects[0]?.id ?? "");
	const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
	const activeProject = projects.find((p) => p.id === activeId) || projects[0];
	const { t, i18n } = useTranslation();

	const { content: readme, loading } = useGitHubReadme(
		activeProject.repoUrl,
		activeProject.repoBranch,
		i18n.language === "ru" ? activeProject.description_ru : activeProject.description,
	);

	const handleProjectClick = (id: string) => {
		setActiveId(id);
		if (window.innerWidth < 768) {
			setIsMobileModalOpen(true);
		}
	};

	const transformUrl = (url: string) => {
		if (
			url.startsWith("http:") ||
			url.startsWith("https:") ||
			url.startsWith("//") ||
			url.startsWith("#") ||
			url.startsWith("mailto:")
		) {
			return url;
		}

		if (!activeProject.repoUrl) return url;

		const repoPath = activeProject.repoUrl
			.replace("https://github.com/", "")
			.replace(/\/$/, "");
		const branch = activeProject.repoBranch || "main";
		const baseRawUrl = `https://raw.githubusercontent.com/${repoPath}/${branch}`;
		const cleanUrl = url.replace(/^\.?\//, "");

		return `${baseRawUrl}/${cleanUrl}`;
	};

	const markdownContent = (
		<div
			className="prose prose-sm max-w-none prose-invert prose-headings:font-sans prose-headings:uppercase prose-p:font-mono prose-p:text-zinc-400 prose-a:text-accent"
		>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				rehypePlugins={[rehypeRaw]}
				urlTransform={transformUrl}
				components={{
					img: ({ ...props }) => (
						<img
							{...props}
							className="border border-muted/20 bg-bg max-w-full h-auto"
						/>
					),
				}}
			>
				{readme}
			</ReactMarkdown>
		</div>
	);

	return (
		<div className="h-full w-full flex flex-col md:flex-row relative overflow-hidden">
			{/* Project list */}
			<div className="w-full md:w-1/2 flex-1 md:flex-initial h-full border-r border-muted/20 bg-bg flex flex-col relative z-0">
				<div className="p-8 bg-bg z-20 border-b border-muted/20 shadow-xl shadow-black/5 shrink-0">
					<h2 className="text-4xl font-bold text-main tracking-tight">
						{t("projects.title")}
					</h2>
					<Badge variant="outline" className="mt-2">
						{projects.length} {t("projects.items")}
					</Badge>
				</div>

				<div className="flex-1 overflow-y-auto custom-scrollbar pb-24 md:pb-0 min-h-0">
					<div className="flex flex-col">
						{projects.map((proj, idx) => {
							const isActive = activeId === proj.id;
							return (
								<motion.div
									key={proj.id}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: idx * 0.1 }}
									onClick={() => handleProjectClick(proj.id)}
									className={cn(
										"p-8 border-l-4 cursor-pointer transition-all duration-200 group relative border-b border-muted/20 neon-card-hover",
										isActive
											? "bg-surface border-l-accent"
											: "bg-transparent border-l-transparent hover:bg-surface/50 hover:border-l-muted",
									)}
								>
									<div className="flex justify-between items-start mb-2 relative z-10">
										<span className="font-mono text-xs text-muted">
											0{idx + 1} // {proj.id}
										</span>
										{proj.isMain && (
											<FaStar size={14} className="text-accent" />
										)}
									</div>

									<h3
										className={cn(
											"text-2xl font-bold font-sans tracking-wide relative z-10 transition-colors",
											isActive
												? "text-main"
												: "text-muted group-hover:text-main",
										)}
									>
										{proj.name}
									</h3>

									<div className="flex flex-wrap gap-2 mt-4 relative z-10">
										{proj.tags.map((tag) => (
											<Badge key={tag}>
												{tag}
											</Badge>
										))}
									</div>

									<div className="md:hidden absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity text-accent">
										<FaPlay size={20} />
									</div>
								</motion.div>
							);
						})}
					</div>
				</div>
			</div>

			{/* Mobile README modal */}
			<AnimatePresence>
				{isMobileModalOpen && (
					<motion.div
						initial={{ opacity: 0, y: "100%" }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: "100%" }}
						transition={{ type: "spring", damping: 25, stiffness: 200 }}
						className="fixed inset-0 z-[100] bg-bg flex flex-col md:hidden h-[100dvh]"
					>
						<div className="h-16 flex items-center justify-between px-6 border-b border-muted/20 bg-surface z-50 shrink-0">
							<span className="font-mono text-sm text-accent tracking-widest flex items-center gap-2 truncate max-w-[50%]">
								:: {activeProject.id}
							</span>

							<div className="flex items-center gap-3">
								<Button
									variant="solid"
									size="sm"
									onClick={() =>
										activeProject.repoUrl &&
										window.open(activeProject.repoUrl, "_blank")
									}
									className="gap-2"
								>
									<FaFolder size={14} />
									<span className="hidden sm:inline">
										{t("projects.view_code")}
									</span>
									<FaExternalLinkAlt size={14} />
								</Button>

								<button
									onClick={() => setIsMobileModalOpen(false)}
									className="p-2 border border-accent text-accent active:bg-accent active:text-black transition-colors cursor-pointer"
								>
									<FaTimes size={24} />
								</button>
							</div>
						</div>

						<div className="flex-1 overflow-y-auto p-6 bg-bg/50 custom-scrollbar relative min-h-0">
							{loading ? (
								<div className="flex items-center gap-2 text-accent font-mono p-4">
									<FaSpinner size={16} className="animate-spin" />
									{t("projects.loading")}
								</div>
							) : (
								<div className="pb-8">{markdownContent}</div>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Desktop README panel */}
			<div className="hidden md:flex w-1/2 bg-surface relative flex-col overflow-hidden h-full">
				<div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

				<div className="flex-1 overflow-y-auto p-12 custom-scrollbar relative z-10">
					{loading ? (
						<div className="h-full flex flex-col items-center justify-center gap-4 text-accent font-mono opacity-80">
							<FaSpinner className="animate-spin w-8 h-8" />
							<span>{t("projects.loading")}</span>
						</div>
					) : (
						markdownContent
					)}
				</div>

				<div className="p-6 border-t border-muted/20 bg-bg/90 backdrop-blur flex justify-between items-center z-20 shrink-0">
					<div className="text-[10px] font-mono text-muted">
						{t("projects.source")}:{" "}
						{activeProject.repoUrl ? "GITHUB" : "LOCAL"} //{" "}
						{t("projects.items")}: {activeProject.id}
					</div>
					<Button
						variant="solid"
						size="sm"
						onClick={() =>
							activeProject.repoUrl &&
							window.open(activeProject.repoUrl, "_blank")
						}
						className="gap-2"
					>
						<FaFolder size={16} /> {t("projects.view_code")}{" "}
						<FaExternalLinkAlt size={16} />
					</Button>
				</div>
			</div>
		</div>
	);
};
