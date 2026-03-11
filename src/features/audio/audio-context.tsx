import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Howl } from "howler";

interface AudioContextValue {
	playing: boolean;
	toggle: () => void;
	startAudio: () => void;
	playClick: () => void;
}

const AudioCtx = createContext<AudioContextValue>({
	playing: false,
	toggle: () => { },
	startAudio: () => { },
	playClick: () => { },
});

export const useAudio = () => useContext(AudioCtx);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
	const [playing, setPlaying] = useState(false);
	const bgRef = useRef<Howl | null>(null);
	const welcomeRef = useRef<Howl | null>(null);
	const clickRef = useRef<Howl | null>(null);
	const startedRef = useRef(false);

	useEffect(() => {
		bgRef.current = new Howl({
			src: ["/audios/bg.ogg"],
			loop: true,
			volume: 0.4,
		});
		welcomeRef.current = new Howl({
			src: ["/audios/welcome.ogg"],
			volume: 0.6,
		});
		clickRef.current = new Howl({
			src: ["/audios/click.ogg"],
			volume: 0.5,
		});

		return () => {
			bgRef.current?.unload();
			welcomeRef.current?.unload();
			clickRef.current?.unload();
		};
	}, []);

	const startAudio = useCallback(() => {
		if (startedRef.current) return;
		startedRef.current = true;
		bgRef.current?.play();
		welcomeRef.current?.play();
		setPlaying(true);
	}, []);

	const toggle = useCallback(() => {
		if (!bgRef.current) return;
		if (playing) {
			bgRef.current.pause();
			setPlaying(false);
		} else {
			bgRef.current.play();
			setPlaying(true);
		}
	}, [playing]);

	const playClick = useCallback(() => {
		clickRef.current?.play();
	}, []);

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			if (target.closest("button, a, [role='button']")) {
				playClick();
			}
		};
		document.addEventListener("click", handler);
		return () => document.removeEventListener("click", handler);
	}, [playClick]);

	return (
		<AudioCtx.Provider value={{ playing, toggle, startAudio, playClick }}>
			{children}
		</AudioCtx.Provider>
	);
};
