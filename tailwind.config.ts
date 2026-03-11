import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Rajdhani", "sans-serif"],
				mono: ["JetBrains Mono", "monospace"],
			},
			colors: {
				bg: "var(--color-bg-val)",
				surface: "var(--color-surface-val)",
				accent: "var(--color-accent-val)",
				cyan: "var(--color-cyan-val)",
				muted: "var(--color-muted-val)",
				main: "var(--color-text-main)",
			},
			backgroundImage: {
				"grid-pattern": "radial-gradient(var(--grid-dot-color) 1px, transparent 1px)",
			}
		},
	},
	plugins: [
		typography,
	],
} satisfies Config;