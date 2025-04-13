/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				"dark-blue": "#0A192F",
				"navy-blue": "#112240",
				"light-blue": "#CCD6F6",
				"lighter-blue": "#A8B2D1",
				"accent-blue": "#64FFDA",
				"accent-blue-light": "#88FFF7"
			},
			backgroundImage: {
				"header-banner": "url('/images/banner.webp')"
			},
			boxShadow: {
				glow: "0 0 15px 5px rgba(100, 255, 218, 0.2)"
			}
		}
	},
	plugins: []
};
