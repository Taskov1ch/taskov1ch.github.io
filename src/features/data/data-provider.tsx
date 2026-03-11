import { createContext, useCallback, useEffect, useState, type ReactNode } from "react";
import type { Project, Skill, LinkItem } from "../../shared/types";
import {
	projects as fallbackProjects,
	skills as fallbackSkills,
	links as fallbackLinks,
	commands as fallbackCommands,
} from "../../shared/constants/data";
import { siteConfig } from "../../shared/constants/site.config";

const GIST_RAW_URL = siteConfig.gistRawUrl;
const CACHE_KEY = siteConfig.cache.key;
const CACHE_TTL = siteConfig.cache.ttl;

interface PortfolioData {
	projects: Project[];
	skills: Skill[];
	links: LinkItem[];
	commands: Record<string, string>;
}

interface DataContextValue extends PortfolioData {
	loading: boolean;
	error: string | null;
	refetch: () => void;
}

const fallbackData: PortfolioData = {
	projects: fallbackProjects,
	skills: fallbackSkills,
	links: fallbackLinks,
	commands: fallbackCommands,
};

export const DataContext = createContext<DataContextValue>({
	...fallbackData,
	loading: true,
	error: null,
	refetch: () => { },
});

interface CachedData {
	data: PortfolioData;
	timestamp: number;
}

function readCache(): PortfolioData | null {
	try {
		const raw = localStorage.getItem(CACHE_KEY);
		if (!raw) return null;
		const cached: CachedData = JSON.parse(raw);
		if (Date.now() - cached.timestamp > CACHE_TTL) {
			localStorage.removeItem(CACHE_KEY);
			return null;
		}
		return cached.data;
	} catch {
		return null;
	}
}

function writeCache(data: PortfolioData) {
	try {
		const cached: CachedData = { data, timestamp: Date.now() };
		localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
	} catch {
	}
}

function isValidData(obj: unknown): obj is PortfolioData {
	if (!obj || typeof obj !== "object") return false;
	const o = obj as Record<string, unknown>;
	if (!Array.isArray(o.projects) || !Array.isArray(o.skills) || !Array.isArray(o.links)) return false;
	if (o.commands === undefined) {
		(o as Record<string, unknown>).commands = {};
	} else if (typeof o.commands !== "object" || Array.isArray(o.commands)) {
		return false;
	}
	return true;
}

export const DataProvider = ({ children }: { children: ReactNode }) => {
	const [data, setData] = useState<PortfolioData>(() => readCache() ?? fallbackData);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchData = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const res = await fetch(GIST_RAW_URL);
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const json: unknown = await res.json();

			if (!isValidData(json)) {
				throw new Error("Invalid data format");
			}

			setData(json);
			writeCache(json);
		} catch (e) {
			const msg = e instanceof Error ? e.message : "Unknown error";
			console.warn("Failed to fetch Gist data, using fallback:", msg);
			setError(msg);

			const cached = readCache();
			if (!cached) {
				setData(fallbackData);
			}
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		const cached = readCache();
		if (cached) {
			setData(cached);
			setLoading(false);
			fetchData();
		} else {
			fetchData();
		}
	}, [fetchData]);

	return (
		<DataContext.Provider value={{ ...data, loading, error, refetch: fetchData }}>
			{children}
		</DataContext.Provider>
	);
};
