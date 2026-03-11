import { useAudio } from "./audio-context";
import { useTranslation } from "react-i18next";
import { FaVolumeHigh, FaVolumeXmark } from "react-icons/fa6";
import { cn } from "../../shared/lib/utils";

interface MusicToggleProps {
	showLabel?: boolean;
	className?: string;
}

export const MusicToggle = ({ showLabel = false, className }: MusicToggleProps) => {
	const { playing, toggle } = useAudio();
	const { t } = useTranslation();

	return (
		<button
			onClick={toggle}
			className={cn(
				"flex items-center text-muted hover:text-main transition-colors cursor-pointer",
				className,
			)}
			aria-label={playing ? "Mute" : "Unmute"}
		>
			{showLabel ? (
				<div className="min-w-[5rem] flex justify-center">
					{playing ? (
						<FaVolumeHigh size={20} className="text-accent" />
					) : (
						<FaVolumeXmark size={20} className="text-accent" />
					)}
				</div>
			) : (
				playing ? (
					<FaVolumeHigh size={20} className="text-accent" />
				) : (
					<FaVolumeXmark size={20} className="text-accent" />
				)
			)}
			{showLabel && (
				<span className="font-mono text-xs text-accent whitespace-nowrap tracking-widest">
					{t("common.music")}: [{playing ? "ON" : "OFF"}]
				</span>
			)}
		</button>
	);
};
