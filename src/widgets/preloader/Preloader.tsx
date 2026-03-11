import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "../../features/audio";
import { siteConfig } from "../../shared/constants/site.config";

const MEDIA_ASSETS = [
	siteConfig.logo,
	siteConfig.terminal.image,
	"/audios/bg.ogg",
	"/audios/welcome.ogg",
	"/audios/click.ogg",
];

const WELCOME_WORDS = [
	{ text: "Welcome", delay: 900 },
	{ text: "to", delay: 1000 },
	{ text: "Taskov1ch's", delay: 1050 },
	{ text: "Website", delay: 1150 },
];

const WELCOME_HOLD = 500;
const GLITCH_DURATION = 600;

function preloadImage(src: string): Promise<void> {
	return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => resolve();
		img.onerror = () => resolve();
		img.src = src;
	});
}

function preloadAudio(src: string): Promise<void> {
	return new Promise((resolve) => {
		const audio = new Audio();
		audio.oncanplaythrough = () => resolve();
		audio.onerror = () => resolve();
		audio.preload = "auto";
		audio.src = src;
	});
}

function preloadAsset(src: string): Promise<void> {
	if (src.match(/\.(ogg|mp3|wav|m4a)$/i)) {
		return preloadAudio(src);
	}
	return preloadImage(src);
}

interface PreloaderProps {
	onComplete: () => void;
}

export const Preloader = ({ onComplete }: PreloaderProps) => {
	const [progress, setProgress] = useState(0);
	const [loaded, setLoaded] = useState(false);
	const [phase, setPhase] = useState<"loading" | "welcome" | "glitch" | "done">("loading");
	const [visibleWords, setVisibleWords] = useState<number>(0);
	const { startAudio } = useAudio();

	useEffect(() => {
		let completed = 0;
		const total = MEDIA_ASSETS.length;

		MEDIA_ASSETS.forEach((src) => {
			preloadAsset(src).then(() => {
				completed++;
				setProgress(Math.round((completed / total) * 100));
				if (completed === total) {
					setLoaded(true);
				}
			});
		});
	}, []);

	const handleEnter = useCallback(() => {
		if (!loaded || phase !== "loading") return;
		startAudio();
		setPhase("welcome");

		WELCOME_WORDS.forEach((word, i) => {
			setTimeout(() => setVisibleWords(i + 1), word.delay);
		});

		const lastDelay = WELCOME_WORDS[WELCOME_WORDS.length - 1].delay;
		setTimeout(() => setPhase("glitch"), lastDelay + WELCOME_HOLD);
		setTimeout(() => {
			setPhase("done");
			onComplete();
		}, lastDelay + WELCOME_HOLD + GLITCH_DURATION);
	}, [loaded, phase, startAudio, onComplete]);

	useEffect(() => {
		if (!loaded || phase !== "loading") return;
		const handler = () => handleEnter();
		window.addEventListener("click", handler);
		window.addEventListener("keydown", handler);
		return () => {
			window.removeEventListener("click", handler);
			window.removeEventListener("keydown", handler);
		};
	}, [loaded, phase, handleEnter]);

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
								{loaded ? (
									<motion.span
										initial={{ opacity: 0 }}
										animate={{ opacity: [0.4, 1, 0.4] }}
										transition={{ duration: 1.5, repeat: Infinity }}
										className="text-accent"
									>
										CLICK ANYWHERE
									</motion.span>
								) : (
									<>LOADING {progress}%</>
								)}
							</span>
						</div>
					</motion.div>
				)}

				{(phase === "welcome" || phase === "glitch") && (
					<motion.div
						key="welcome"
						animate={phase === "glitch" ? {
							x: [0, -4, 6, -2, 4, 0],
							y: [0, 2, -3, 1, -2, 0],
							filter: [
								"none",
								"hue-rotate(90deg) brightness(1.5)",
								"hue-rotate(-60deg) brightness(0.8)",
								"hue-rotate(180deg) brightness(1.3)",
								"none",
							],
							opacity: [1, 1, 0.8, 1, 0],
						} : {}}
						transition={phase === "glitch" ? { duration: GLITCH_DURATION / 1000, ease: "easeInOut" } : {}}
						className="flex items-center flex-wrap justify-center gap-2 sm:gap-4 text-2xl sm:text-4xl md:text-6xl font-bold font-sans tracking-tighter text-main"
					>
						{WELCOME_WORDS.map((word, i) => (
							<motion.span
								key={i}
								initial={{ opacity: 0, y: 15 }}
								animate={i < visibleWords ? { opacity: 1, y: 0 } : {}}
								transition={{ duration: 0.25, ease: "easeOut" }}
								className={word.text === "Taskov1ch's" ? "text-accent" : ""}
							>
								{word.text}
							</motion.span>
						))}
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
