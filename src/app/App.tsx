import { Suspense } from "react";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Layout } from "../widgets/layout/Layout";
import { Providers } from "./providers";
import { routes } from "./routes";

const PageTransition = ({ children }: { children: React.ReactNode }) => (
	<motion.div
		initial={{ opacity: 0, filter: "blur(6px)" }}
		animate={{ opacity: 1, filter: "blur(0px)" }}
		exit={{ opacity: 0, filter: "blur(6px)" }}
		transition={{ duration: 0.2, ease: "circOut" }}
		className="h-full w-full"
	>
		{children}
	</motion.div>
);

const PageFallback = () => (
	<div className="h-full w-full flex items-center justify-center">
		<div className="font-mono text-accent text-sm tracking-widest animate-pulse">
			LOADING MODULE...
		</div>
	</div>
);

const AnimatedRoutes = () => {
	const location = useLocation();
	return (
		<AnimatePresence mode="wait">
			<Routes location={location} key={location.pathname}>
				{routes.map(({ path, element: Element }) => (
					<Route
						key={path}
						path={path}
						element={
							<PageTransition>
								<Suspense fallback={<PageFallback />}>
									<Element />
								</Suspense>
							</PageTransition>
						}
					/>
				))}
			</Routes>
		</AnimatePresence>
	);
};

const App = () => {
	return (
		<Providers>
			<HashRouter>
				<Layout>
					<AnimatedRoutes />
				</Layout>
			</HashRouter>
		</Providers>
	);
};

export default App;
