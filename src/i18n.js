import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
	.use(HttpApi)
	.use(initReactI18next)
	.use(LanguageDetector)
	.init({
		fallbackLng: "en",
		debug: false,
		detection: {
			order: ["cookie", "localStorage", "navigator", "htmlTag", "path", "subdomain"],

			lookupCookie: "i18next_lng",
			lookupLocalStorage: "i18nextLng",
			lookupQuerystring: "lang",

			caches: ["cookie", "localStorage"],
			cookieMinutes: 60 * 24 * 30 * 365,
			cookieOptions: { path: "/" }
		},
		interpolation: {
			escapeValue: false
		},
		backend: {
			loadPath: "/locales/{{lng}}/translation.json"
		},

		supportedLngs: ["en", "ru"]
	});

export default i18n;
