import { lazy } from "react";

const HomePage = lazy(() =>
	import("../pages/home/HomePage").then((m) => ({ default: m.HomePage })),
);
const ProjectsPage = lazy(() =>
	import("../pages/projects/ProjectsPage").then((m) => ({ default: m.ProjectsPage })),
);
const AboutPage = lazy(() =>
	import("../pages/about/AboutPage").then((m) => ({ default: m.AboutPage })),
);
const LinksPage = lazy(() =>
	import("../pages/links/LinksPage").then((m) => ({ default: m.LinksPage })),
);
const NotFoundPage = lazy(() =>
	import("../pages/not-found/NotFoundPage").then((m) => ({ default: m.NotFoundPage })),
);

export const routes = [
	{ path: "/", element: HomePage },
	{ path: "/projects", element: ProjectsPage },
	{ path: "/about", element: AboutPage },
	{ path: "/links", element: LinksPage },
	{ path: "*", element: NotFoundPage },
] as const;
