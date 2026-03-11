import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./i18n";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<React.Suspense fallback={
			<div className="h-screen w-screen bg-[#09090b] flex items-center justify-center text-[#fbbf24] font-mono">
				INITIALIZING CORE...
			</div>
		}>
			<App />
		</React.Suspense>
	</React.StrictMode>,
);