import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { siteConfig } from "../../shared/constants/site.config";

const localeFiles = import.meta.glob<{ default: Record<string, unknown> }>(
	"./locales/*.json",
	{ eager: true },
);

const localeMap: Record<string, Record<string, unknown>> = {};
for (const [path, mod] of Object.entries(localeFiles)) {
	const code = path.match(/\/(\w+)\.json$/)?.[1];
	if (code) localeMap[code] = mod.default;
}

const resources = Object.fromEntries(
	siteConfig.languages.map((lang) => [
		lang.code,
		{ translation: localeMap[lang.code] ?? {} },
	]),
);

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources,
		fallbackLng: siteConfig.languages[0]?.code ?? "en",
		debug: false,
		interpolation: {
			escapeValue: false,
		},
		detection: {
			order: ["localStorage", "navigator"],
			caches: ["localStorage"],
		},
	});

export default i18n;
