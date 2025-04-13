import React, { useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import NavigationBar from "./components/NavigationBar";
import ContentArea from "./components/ContentArea";
import LanguageSwitcher from "./components/LanguageSwitcher";
import CryptoModal from "./components/CryptoModal";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

const VALID_SECTIONS = ["projects", "links", "donate"];
const VALID_LANGS = ["en", "ru"];
const HEADER_EFFECTIVE_HEIGHT = 100;

function App() {
	const { t, i18n } = useTranslation();
	const location = useLocation();
	const navigate = useNavigate();

	const [currentSection, setCurrentSection] = useState(() => {
		const params = new URLSearchParams(location.search);
		const slideParam = params.get("slide");
		return VALID_SECTIONS.includes(slideParam) ? slideParam : "projects";
	});
	const [appData, setAppData] = useState(null);
	const [error, setError] = useState(null);
	const [isCryptoModalOpen, setIsCryptoModalOpen] = useState(false);
	const [currentCryptoWallets, setCurrentCryptoWallets] = useState(null);

	const openCryptoModal = wallets => {
		setCurrentCryptoWallets(wallets);
		setIsCryptoModalOpen(true);
	};

	const closeCryptoModal = () => {
		setIsCryptoModalOpen(false);
		setCurrentCryptoWallets(null);
	};

	const sectionVariants = {
		initial: { opacity: 0, y: 20 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: -20 }
	};

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const slideParam = params.get("slide");
		const langParam = params.get("lang");

		const targetSection = VALID_SECTIONS.includes(slideParam) ? slideParam : "projects";
		setCurrentSection(prevSection => (targetSection !== prevSection ? targetSection : prevSection));

		const currentBaseLang = i18n.language.split("-")[0];
		if (langParam && VALID_LANGS.includes(langParam) && langParam !== currentBaseLang) {
			i18n.changeLanguage(langParam);
		}
	}, [location.search, i18n]);

	useEffect(() => {
		const loadData = async () => {
			const lang = i18n.language.split("-")[0];
			const dataPath = `/data/content_${lang}.json`;
			setError(null);
			try {
				const response = await fetch(dataPath);
				if (!response.ok)
					throw new Error(`HTTP error! status: ${response.status} loading ${dataPath}`);
				const data = await response.json();
				setAppData(data);
			} catch (e) {
				console.error("Failed to load content data:", e);
				setError(`Failed to load content for '${lang}'.`);
				setAppData(null);
			}
		};

		loadData();
	}, [i18n.language]);

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, [currentSection]);

	const handleSectionChange = useCallback(
		section => {
			if (VALID_SECTIONS.includes(section)) {
				const currentParams = new URLSearchParams(location.search);
				currentParams.set("slide", section);
				navigate(`?${currentParams.toString()}`, { replace: true });
			}
		},
		[navigate, location.search]
	);

	const handleLanguageChange = useCallback(
		lang => {
			if (VALID_LANGS.includes(lang)) {
				const currentParams = new URLSearchParams(location.search);
				currentParams.set("lang", lang);
				navigate(`?${currentParams.toString()}`, { replace: true });
			}
		},
		[navigate, location.search]
	);

	useEffect(() => {
		const preloaderElement = document.getElementById("preloader");
		if (preloaderElement && (appData || error)) {
			preloaderElement.classList.add("hidden");
			const animationDuration = 500;
			setTimeout(() => {
				if (preloaderElement.parentNode) {
					preloaderElement.parentNode.removeChild(preloaderElement);
				}
			}, animationDuration);
		}
	}, [appData, error]);

	return (
		<div className="min-h-screen flex flex-col">
			<LanguageSwitcher onLanguageChange={handleLanguageChange} />
			<Header />
			<NavigationBar currentSection={currentSection} setCurrentSection={handleSectionChange} />

			<main
				className={`flex-grow relative z-10 overflow-hidden pt-[${HEADER_EFFECTIVE_HEIGHT + 10}px]`}
			>
				{error && <div className="text-center text-red-400 py-4">{error}</div>}
				<AnimatePresence mode="wait">
					{appData ? (
						<motion.div
							key={currentSection}
							variants={sectionVariants}
							initial="initial"
							animate="animate"
							exit="exit"
							transition={{ duration: 0.3, ease: "easeInOut" }}
						>
							<ContentArea
								currentSection={currentSection}
								data={appData}
								openCryptoModal={openCryptoModal}
							/>
						</motion.div>
					) : !error ? (
						<motion.div
							key="loading"
							variants={sectionVariants}
							initial="initial"
							animate="animate"
						>
							<div className="text-center py-10">{t("loading.text")}</div>
						</motion.div>
					) : null}
				</AnimatePresence>
			</main>

			<AnimatePresence>
				{isCryptoModalOpen && (
					<CryptoModal
						isOpen={isCryptoModalOpen}
						onClose={closeCryptoModal}
						wallets={currentCryptoWallets}
					/>
				)}
			</AnimatePresence>
		</div>
	);
}

export default App;
