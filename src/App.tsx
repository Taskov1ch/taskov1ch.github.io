import React from "react";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Layout } from "./components/Layout/Layout";
import { Home } from "./pages/Home";
import { Projects } from "./pages/Projects";
import { About } from "./pages/About";
import { Links } from "./pages/Links";
import "./App.css";
import { NotFound } from "./pages/NotFound";

const PageTransition = ({ children }: { children: React.ReactNode }) => (
	<motion.div
		initial={{ opacity: 0, filter: "blur(10px)" }}
		animate={{ opacity: 1, filter: "blur(0px)" }}
		exit={{ opacity: 0, filter: "blur(10px)" }}
		transition={{ duration: 0.3, ease: "circOut" }}
		className="h-full w-full"
	>
		{children}
	</motion.div>
);

const AnimatedRoutes = () => {
	const location = useLocation();
	return (
		<AnimatePresence mode="wait">
			<Routes location={location} key={location.pathname}>
				<Route path="/" element={<PageTransition><Home /></PageTransition>} />
				<Route path="/projects" element={<PageTransition><Projects /></PageTransition>} />
				<Route path="/about" element={<PageTransition><About /></PageTransition>} />
				<Route path="/links" element={<PageTransition><Links /></PageTransition>} />
				<Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
			</Routes>
		</AnimatePresence>
	);
};

const App = () => {
	return (
		<HashRouter>
			<Layout>
				<AnimatedRoutes />
			</Layout>
		</HashRouter>
	);
};

export default App;