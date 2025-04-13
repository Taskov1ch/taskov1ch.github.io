const iconMap = {
	python: "devicon-python-plain",
	javascript: "devicon-javascript-plain",
	react: "devicon-react-original",
	go: "devicon-go-original-wordmark",
	typescript: "devicon-typescript-plain",
	html: "devicon-html5-plain",
	html5: "devicon-html5-plain",
	css: "devicon-css3-plain",
	css3: "devicon-css3-plain",
	vue: "devicon-vuejs-plain",
	vuejs: "devicon-vuejs-plain",
	svelte: "devicon-svelte-plain",
	java: "devicon-java-plain",
	php: "devicon-php-plain",
	bash: "devicon-bash-plain"
};

const fallbackSvgPath = "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4";

export function getLanguageIconInfo(languageString) {
	if (!languageString) {
		return null;
	}

	const lowerLang = languageString.toLowerCase();
	let foundIconClass = null;

	for (const keyword in iconMap) {
		if (lowerLang.includes(keyword)) {
			foundIconClass = iconMap[keyword];
			break;
		}
	}

	if (foundIconClass) {
		return { type: "devicon", class: foundIconClass };
	} else {
		return { type: "svg", path: fallbackSvgPath };
	}
}
