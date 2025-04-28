export function getTagStyle(tag) {
	if (!tag) return null;

	const lowerTag = tag.toLowerCase();

	const tagStyles = {
		stable: { bgClass: "bg-emerald-600", textClass: "text-emerald-100" },
		beta: { bgClass: "bg-yellow-600", textClass: "text-yellow-100" },
		dev: { bgClass: "bg-indigo-600", textClass: "text-indigo-100" },
		unsupported: { bgClass: "bg-red-700", textClass: "text-red-100" },
		not_tested: { bgClass: "bg-purple-600", textClass: "text-purple-100" },
		planned: { bgClass: "bg-cyan-600", textClass: "text-cyan-100" },
		paused: { bgClass: "bg-orange-600", textClass: "text-orange-100" },
		soon: { bgClass: "bg-sky-600", textClass: "text-sky-100" },
		idk: { bgClass: "bg-orange-600", textClass: "text-orange-100" },

		active: { bgClass: "bg-sky-600", textClass: "text-sky-100" },
		passive: { bgClass: "bg-slate-500", textClass: "text-slate-100" },
		rarely: { bgClass: "bg-gray-700", textClass: "text-gray-300" },

		not_playing: { bgClass: "bg-gray-700", textClass: "text-gray-300" },
	};

	const style = tagStyles[lowerTag];

	if (!style) return null;

	return {
		tKey: `tags.${lowerTag}`,
		...style
	};
}
