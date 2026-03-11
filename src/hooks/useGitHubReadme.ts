import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const useGitHubReadme = (repoUrl?: string, branch: string = "main", fallbackDesc?: string) => {
	const [content, setContent] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const { t } = useTranslation();

	useEffect(() => {
		let isMounted = true;

		const fetchReadme = async () => {
			if (!repoUrl) {
				if (isMounted) setContent(fallbackDesc || t("projects.no_data"));
				return;
			}

			setLoading(true);
			const cleanPath = repoUrl.replace("https://github.com/", "").replace(/\/$/, "");
			const branches = [branch, "master", "main"];

			for (const b of branches) {
				try {
					const res = await fetch(`https://raw.githubusercontent.com/${cleanPath}/${b}/README.md`);
					if (res.ok) {
						const text = await res.text();
						if (isMounted) {
							setContent(text);
							setLoading(false);
						}
						return;
					}
				} catch (e) { console.warn(e); }
			}

			if (isMounted) {
				setContent(fallbackDesc || t("projects.no_data"));
				setLoading(false);
			}
		};

		fetchReadme();
		return () => { isMounted = false; };
	}, [repoUrl, branch, fallbackDesc, t]);

	return { content, loading };
};