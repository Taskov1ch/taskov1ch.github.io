import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import i18n from "./i18n";
import { I18nextProvider, useTranslation } from "react-i18next";
import { BrowserRouter } from "react-router-dom";

function LoadingFallback() {
	const { t } = useTranslation();
	return <div>{t("loading.text")}</div>;
}

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<I18nextProvider i18n={i18n}>
			<Suspense fallback={<LoadingFallback />}>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</Suspense>
		</I18nextProvider>
	</React.StrictMode>
);
