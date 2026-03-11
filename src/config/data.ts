import { type Project, type LinkItem, type Skill } from "../types";

export const projects: Project[] = [
	{
		id: "01",
		name: "TASKOV1CH_WEBSITE",
		description: "HIndustrial Futurism Portfolio Interface.",
		description_ru: "",
		tags: ["REACT", "TYPESCRIPT", "TAILWIND", "VITE"],
		isMain: true,
		status: "BETA",
		repoUrl: "https://github.com/Taskov1ch-Repos/taskov1ch-website",
		repoBranch: "main"
	},
	{
		id: "02",
		name: "BANEDETTA",
		description: "It's time to ban violators in front of everyone.",
		description_ru: "",
		tags: ["PHP", "PMMP"],
		isMain: true,
		status: "STABLE",
		repoBranch: "v3",
		repoUrl: "https://github.com/BANedetta/pmmp5-plugin",
	},
	{
		id: "03",
		name: "GM_INVENTORIES",
		description: "Separate inventories for each gamemode.",
		description_ru: "",
		tags: ["PHP", "PMMP"],
		isMain: false,
		status: "STABLE",
		repoBranch: "Be",
		repoUrl: "https://github.com/Taskov1ch/GmInventories"
	}
];

export const skills: Skill[] = [
	{ name: "PYTHON", level: 60, category: "LANG" },
	{ name: "TYPESCRIPT/JAVASCRIPT", level: 15, category: "LANG" },
	{ name: "COMMMAND_BLOCKS", level: 80, category: "MINECRAFT" },
	{ name: "REACT", level: 30, category: "FRAMEWORK" },
	{ name: "GIT", level: 90, category: "TOOL" },
	{ name: "PHP", level: 70, category: "LANG" },
	{ name: "PMMP", level: 95, category: "MINECRAFT" },
	{ name: "LUMI", level: 10, category: "MINECRAFT" },
	{ name: "BASH", level: 40, category: "TOOL" }
];

export const links: LinkItem[] = [
	{ id: "L0", label: "GITHUB", url: "https://github.com/taskov1ch", category: "CODE" },
	{ id: "L1", label: "GITHUB_2", url: "https://github.com/taskov1ch-repos", category: "CODE" },
	{ id: "L2", label: "VK", url: "https://vk.com/taskov1ch", category: "SOCIAL" },
	{ id: "L3", label: "TELEGRAM", url: "https://t.me/taskov1ch", category: "CONTACT" },
	{ id: "L4", label: "MAIL", url: "mailto:sudo.taskov1ch@gmail.com", category: "CONTACT" },
	{ id: "L5", label: "STEAM", url: "https://steamcommunity.com/id/taskov1ch/", category: "SOCIAL" },
	{ id: "L6", label: "DISCORD", url: "https://discord.gg/BjrYgnD8p", category: "CONTACT" },
	{ id: "L7", label: "ANIXART", url: "https://anixart-app.com/profile/1932711", category: "OTHERS" },
	{ id: "L8", label: "MY_NICKNAME", url: "https://mynickname.com/taskov1ch", category: "OTHERS" }
];
