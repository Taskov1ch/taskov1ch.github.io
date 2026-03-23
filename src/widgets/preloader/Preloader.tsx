import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "../../shared/constants/site.config";

const MEDIA_ASSETS = [
	siteConfig.logo,
	siteConfig.terminal.image,
];



function preloadImage(src: string): Promise<void> {
	return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => resolve();
		img.onerror = () => resolve();
		img.src = src;
	});
}



interface PreloaderProps {
	onComplete: () => void;
}

export const Preloader = ({ onComplete }: PreloaderProps) => {
	const [progress, setProgress] = useState(0);
	const [phase, setPhase] = useState<"loading" | "done">("loading");

	useEffect(() => {
		let completed = 0;
		const total = MEDIA_ASSETS.length;

		MEDIA_ASSETS.forEach((src) => {
			preloadImage(src).then(() => {
				completed++;
				setProgress(Math.round((completed / total) * 100));
				if (completed === total) {
					setTimeout(() => {
						setPhase("done");
						onComplete();
					}, 500); // Short delay to show 100%
				}
			});
		});
	}, [onComplete]);

	if (phase === "done") return null;

	return (
		<div className="fixed inset-0 z-[200] bg-bg flex flex-col items-center justify-center">
			<AnimatePresence mode="wait">
				{phase === "loading" && (
					<motion.div
						key="loader"
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
						className="flex flex-col items-center gap-8"
					>
						<motion.img
							src={siteConfig.logo}
							alt="Logo"
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.5 }}
							className="w-16 h-16"
						/>

						<div className="w-64 flex flex-col items-center gap-3">
							<div className="w-full h-[2px] bg-muted/20 overflow-hidden">
								<motion.div
									className="h-full bg-accent"
									initial={{ width: 0 }}
									animate={{ width: `${progress}%` }}
									transition={{ duration: 0.3 }}
								/>
							</div>

							<span className="font-mono text-xs text-muted tracking-widest">
								LOADING {progress}%
							</span>
						</div>
					</motion.div>
				)}

			</AnimatePresence>

			<div className="absolute top-6 left-6 w-6 h-6 border-t border-l border-accent/30" />
			<div className="absolute top-6 right-6 w-6 h-6 border-t border-r border-accent/30" />
			<div className="absolute bottom-6 left-6 w-6 h-6 border-b border-l border-accent/30" />
			<div className="absolute bottom-6 right-6 w-6 h-6 border-b border-r border-accent/30" />
		</div>
	);
};
