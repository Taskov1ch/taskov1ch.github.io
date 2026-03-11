import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
	FaDesktop,
	FaClock,
	FaNetworkWired,
	FaBatteryFull,
	FaGlobe,
	FaGears,
	FaPalette,
	FaBatteryQuarter,
	FaBatteryHalf,
	FaBatteryThreeQuarters,
	FaBatteryEmpty,
} from "react-icons/fa6";
import { siteConfig } from "../../shared/constants/site.config";
import { useData } from "../../features/data/use-data";

function getUptime(birthDate: string): string {
	const birth = new Date(birthDate).getTime();
	const now = Date.now();
	const diff = now - birth;

	const hours = Math.floor(diff / (1000 * 60 * 60));
	const mins = Math.floor((diff / (1000 * 60)) % 60);

	return `${hours.toLocaleString()} hours, ${mins} mins`;
}

function getGuestId(): string {
	const stored = sessionStorage.getItem("guest_id");
	if (stored) return stored;
	const id = String(Math.floor(1000 + Math.random() * 9000));
	sessionStorage.setItem("guest_id", id);
	return id;
}

function getBrowserInfo(): { name: string; engine: string } {
	const ua = navigator.userAgent;

	let name = "Unknown";
	if (ua.includes("Firefox")) name = "Firefox";
	else if (ua.includes("Edg/")) name = "Edge";
	else if (ua.includes("OPR") || ua.includes("Opera")) name = "Opera";
	else if (ua.includes("YaBrowser")) name = "Yandex";
	else if (ua.includes("Vivaldi")) name = "Vivaldi";
	else if (ua.includes("Brave")) name = "Brave";
	else if (ua.includes("Chrome")) name = "Chrome";
	else if (ua.includes("Safari")) name = "Safari";

	let engine = "Unknown";
	if (ua.includes("Gecko/")) engine = "Gecko";
	if (ua.includes("AppleWebKit")) engine = "WebKit";
	if (ua.includes("Chrome")) engine = "Blink";

	return { name, engine };
}

function getDeviceOS(): string {
	const ua = navigator.userAgent;
	if (ua.includes("Windows")) return "Windows";
	if (ua.includes("Mac OS")) return "macOS";
	if (ua.includes("Android")) return "Android";
	if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
	if (ua.includes("Linux")) return "Linux";
	return "Unknown OS";
}

function getDeviceName(): string {
	const ua = navigator.userAgent;
	const platform = navigator.platform ?? "";
	if (/iPhone/.test(ua)) return "iPhone";
	if (/iPad/.test(ua)) return "iPad";
	if (/Macintosh/.test(ua)) return "Mac";
	if (/Win/.test(platform)) return "PC";
	if (/Linux/.test(platform)) {
		if (/Android/.test(ua)) return "Android Device";
		return "PC";
	}
	return "Unknown Device";
}

function getBatteryIcon(level: number) {
	if (level > 75) return <FaBatteryFull size={13} />;
	if (level > 50) return <FaBatteryThreeQuarters size={13} />;
	if (level > 25) return <FaBatteryHalf size={13} />;
	if (level > 10) return <FaBatteryQuarter size={13} />;
	return <FaBatteryEmpty size={13} />;
}

function getBatteryColor(level: number) {
	if (level > 50) return "text-green-400";
	if (level > 20) return "text-yellow-400";
	return "text-red-400";
}

function maskIp(ip: string): string {
	const parts = ip.split(".");
	if (parts.length === 4) {
		return `${parts[0]}.***.***.${parts[3]}`;
	}
	return "***.***.***";
}

interface InfoLineProps {
	icon: ReactNode;
	value: string;
	iconColor?: string;
	delay?: number;
}

const InfoLine = ({ icon, value, iconColor = "text-accent", delay = 0 }: InfoLineProps) => (
	<motion.div
		initial={{ opacity: 0, x: -10 }}
		animate={{ opacity: 1, x: 0 }}
		transition={{ duration: 0.3, delay }}
		className="flex items-center gap-3 font-mono text-sm leading-relaxed"
	>
		<span className={`${iconColor} w-4 flex items-center justify-center shrink-0`}>{icon}</span>
		<span className="text-muted">{value}</span>
	</motion.div>
);

const Separator = ({ delay = 0 }: { delay?: number }) => (
	<motion.div
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		transition={{ duration: 0.2, delay }}
		className="h-2"
	/>
);

interface HistoryEntry {
	command: string;
	output: string;
	isError?: boolean;
}

const BUILTIN_COMMANDS: Record<string, string> = {
	home: "/",
	about: "/about",
	projects: "/projects",
	links: "/links",
};

const UTILITY_COMMANDS = ["help", "clear"];

export const SystemTerminal = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { commands: customCommands } = useData();
	const cfg = siteConfig.terminal;
	const [ip, setIp] = useState<string | null>(null);
	const [battery, setBattery] = useState<number | null>(null);
	const [input, setInput] = useState("");
	const [history, setHistory] = useState<HistoryEntry[]>([]);
	const [cmdIndex, setCmdIndex] = useState(-1);
	const [selectedSuggestion, setSelectedSuggestion] = useState(0);
	const inputRef = useRef<HTMLInputElement>(null);
	const bottomRef = useRef<HTMLDivElement>(null);

	const guestId = useMemo(() => getGuestId(), []);
	const browser = useMemo(() => getBrowserInfo(), []);
	const os = useMemo(() => getDeviceOS(), []);
	const device = useMemo(() => getDeviceName(), []);
	const uptime = useMemo(() => getUptime(cfg.birthDate), [cfg.birthDate]);

	const allCommands = useMemo(() => {
		const merged = { ...BUILTIN_COMMANDS, ...customCommands };
		return [...Object.keys(merged), ...UTILITY_COMMANDS];
	}, [customCommands]);

	const suggestions = useMemo(() => {
		if (!input.trim()) return [];
		return allCommands.filter((c) => c.startsWith(input.toLowerCase()) && c !== input.toLowerCase());
	}, [input, allCommands]);

	useEffect(() => {
		setSelectedSuggestion(0);
	}, [suggestions.length, input]);

	useEffect(() => {
		if (cfg.showIp) {
			fetch("https://api.ipify.org?format=json")
				.then((r) => r.json())
				.then((d: { ip: string }) => setIp(maskIp(d.ip)))
				.catch(() => setIp("***.***.***.***"));
		}
	}, [cfg.showIp]);

	useEffect(() => {
		if ("getBattery" in navigator) {
			(navigator as Navigator & { getBattery: () => Promise<{ level: number }> })
				.getBattery()
				.then((b) => setBattery(Math.round(b.level * 100)))
				.catch(() => { });
		}
	}, []);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [history]);

	const executeCommand = useCallback((raw: string) => {
		const cmd = raw.trim().toLowerCase();
		if (!cmd) return;

		if (cmd === "clear") {
			setHistory([]);
			return;
		}

		if (cmd === "help") {
			const customKeys = Object.keys(customCommands);
			const customHelp = customKeys.length > 0
				? "\n" + customKeys.map((k) => `  ${k}`).join("\n")
				: "";
			setHistory((prev) => [...prev, {
				command: raw,
				output: t("home.terminal.help_text") + customHelp,
			}]);
			return;
		}

		const builtinPath = BUILTIN_COMMANDS[cmd];
		if (builtinPath) {
			setHistory((prev) => [...prev, {
				command: raw,
				output: t("home.terminal.navigating", { page: cmd }),
			}]);
			setTimeout(() => navigate(builtinPath), 400);
			return;
		}

		const customTarget = customCommands[cmd];
		if (customTarget) {
			if (customTarget.startsWith("/")) {
				setHistory((prev) => [...prev, {
					command: raw,
					output: t("home.terminal.navigating", { page: cmd }),
				}]);
				setTimeout(() => navigate(customTarget), 400);
			} else {
				setHistory((prev) => [...prev, {
					command: raw,
					output: `→ ${customTarget}`,
				}]);
				setTimeout(() => window.open(customTarget, "_blank", "noopener,noreferrer"), 400);
			}
			return;
		}

		setHistory((prev) => [...prev, {
			command: raw,
			output: t("home.terminal.not_found", { cmd }),
			isError: true,
		}]);
	}, [navigate, t, customCommands]);

	const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement> | KeyboardEvent) => {
		if (e.key === "Enter") {
			if (suggestions.length > 0) {
				setInput(suggestions[selectedSuggestion]);
				setSelectedSuggestion(0);
			} else {
				executeCommand(input);
				setInput("");
				setCmdIndex(-1);
			}
			e.preventDefault();
		} else if (e.key === "Tab") {
			e.preventDefault();
			if (suggestions.length > 0) {
				setInput(suggestions[selectedSuggestion]);
				setSelectedSuggestion(0);
			}
		} else if (e.key === "Escape") {
			setInput("");
			setSelectedSuggestion(0);
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			if (suggestions.length > 0) {
				setSelectedSuggestion((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
			} else {
				const cmds = history.map((h) => h.command).filter(Boolean);
				if (cmds.length === 0) return;
				const newIdx = cmdIndex < cmds.length - 1 ? cmdIndex + 1 : cmdIndex;
				setCmdIndex(newIdx);
				setInput(cmds[cmds.length - 1 - newIdx]);
			}
		} else if (e.key === "ArrowDown") {
			e.preventDefault();
			if (suggestions.length > 0) {
				setSelectedSuggestion((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
			} else {
				if (cmdIndex <= 0) {
					setCmdIndex(-1);
					setInput("");
				} else {
					const cmds = history.map((h) => h.command).filter(Boolean);
					const newIdx = cmdIndex - 1;
					setCmdIndex(newIdx);
					setInput(cmds[cmds.length - 1 - newIdx]);
				}
			}
		}
	}, [input, suggestions, selectedSuggestion, executeCommand, history, cmdIndex]);

	useEffect(() => {
		const handleGlobalKeyDown = (e: KeyboardEvent) => {
			const tag = (e.target as HTMLElement)?.tagName;
			if (tag === "TEXTAREA" || (tag === "INPUT" && e.target !== inputRef.current)) return;

			if (e.target === inputRef.current) return;

			if (["Enter", "Tab", "Escape", "ArrowUp", "ArrowDown"].includes(e.key)) {
				handleKeyDown(e);
				return;
			}

			if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
				inputRef.current?.focus();
			}

			if (e.key === "Backspace") {
				inputRef.current?.focus();
			}
		};

		window.addEventListener("keydown", handleGlobalKeyDown);
		return () => window.removeEventListener("keydown", handleGlobalKeyDown);
	}, [handleKeyDown]);

	const colorBlocks = ["#ff5555", "#ff8c42", "#f1fa8c", "#50fa7b", "#8be9fd", "#bd93f9", "#ff79c6", "#6272a4"];

	let d = 0;
	const nextDelay = () => (d += 0.05);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, delay: 0.4 }}
			className="flex flex-col w-[70%] items-center justify-center h-full"
			onClick={() => inputRef.current?.focus()}
		>
			<div className="flex flex-col w-full max-h-full overflow-y-auto scrollbar-none">
				<div className="flex shrink-0">
					<div className="w-52 shrink-0 flex items-center justify-center p-5">
						<img
							src={cfg.image}
							alt="Terminal mascot"
							className="w-full h-auto object-contain max-h-72"
						/>
					</div>

					<div className="flex-1 p-6 flex flex-col justify-center gap-1.5 min-w-0">
						<motion.div
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.3, delay: nextDelay() }}
							className="font-mono text-sm leading-relaxed mb-0.5 flex items-center gap-2"
						>
							<span className="text-accent">Guest{guestId}</span>
						</motion.div>

						<Separator delay={nextDelay()} />

						<InfoLine icon={<FaDesktop size={13} />} value={`${os} | ${device}`} delay={nextDelay()} />
						<InfoLine icon={<FaClock size={13} />} value={uptime} delay={nextDelay()} />
						{cfg.showIp && (
							<InfoLine icon={<FaNetworkWired size={13} />} value={ip ?? t("home.terminal.loading")} delay={nextDelay()} />
						)}

						<Separator delay={nextDelay()} />

						{battery !== null && (
							<InfoLine
								icon={getBatteryIcon(battery)}
								value={`${battery}%`}
								iconColor={getBatteryColor(battery)}
								delay={nextDelay()}
							/>
						)}

						<InfoLine icon={<FaGlobe size={13} />} value={browser.name} delay={nextDelay()} />
						<InfoLine icon={<FaGears size={13} />} value={browser.engine} delay={nextDelay()} />

						<Separator delay={nextDelay()} />

						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.3, delay: nextDelay() }}
							className="flex items-center gap-2 font-mono text-sm mt-0.5"
						>
							<span className="text-accent w-4 flex items-center justify-center shrink-0"><FaPalette size={13} /></span>
							{colorBlocks.map((color) => (
								<span
									key={color}
									className="w-4 h-4 rounded-sm"
									style={{ backgroundColor: color }}
								/>
							))}
						</motion.div>
					</div>
				</div>

				<div className="border-t border-muted/10 px-6 py-4 flex flex-col gap-1.5">
					<div className="flex flex-col gap-0.5">
						{history.map((entry, i) => (
							<div key={i} className="font-mono text-sm">
								<div>
									<span className="text-cyan">~</span>
									<span className="text-accent"> ❯ </span>
									<span className="text-main">{entry.command}</span>
								</div>
								<div className={entry.isError ? "text-red-400 pl-5" : "text-muted pl-5"}>
									{entry.output}
								</div>
							</div>
						))}
					</div>

					<div className="relative">
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.3, delay: nextDelay() }}
							className="font-mono text-sm flex items-center gap-0"
						>
							<span className="text-cyan">~</span>
							<span className="text-accent"> ❯ </span>
							<span className="relative flex-1">
								<input
									ref={inputRef}
									type="text"
									value={input}
									onChange={(e) => setInput(e.target.value)}
									onKeyDown={handleKeyDown}
									className="bg-transparent outline-none text-main w-full font-mono text-sm caret-accent relative z-10"
									spellCheck={false}
									autoComplete="off"
								/>
								{suggestions.length > 0 && (
									<span className="absolute inset-0 pointer-events-none font-mono text-sm text-muted/30">
										{suggestions[selectedSuggestion]}
									</span>
								)}
							</span>
						</motion.div>

						{suggestions.length > 0 && (
							<div className="absolute left-0 bottom-full mb-1 ml-[3.5ch] bg-surface/90 backdrop-blur-sm border border-muted/20 rounded-sm overflow-hidden z-20 min-w-[160px]">
								{suggestions.map((cmd, i) => (
									<button
										key={cmd}
										type="button"
										className={`w-full text-left px-3 py-1 font-mono text-sm transition-colors ${i === selectedSuggestion
											? "bg-accent/20 text-accent"
											: "text-muted hover:bg-muted/10"
											}`}
										onMouseEnter={() => setSelectedSuggestion(i)}
										onClick={() => {
											setInput(cmd);
											setSelectedSuggestion(0);
											inputRef.current?.focus();
										}}
									>
										<span className="text-accent">{cmd.slice(0, input.length)}</span>
										<span>{cmd.slice(input.length)}</span>
									</button>
								))}
							</div>
						)}
					</div>
					<div ref={bottomRef} />
				</div>
			</div>
		</motion.div>
	);
};
