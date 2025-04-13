/**
 * Возвращает текст и CSS классы для одного тега проекта или контакта.
 * @param {string | undefined} tag - Тег ('stable', 'beta', 'active', 'passive', etc.).
 * @returns {{text: string, bgClass: string, textClass: string} | null} - Объект со стилями или null.
 */
export function getTagStyle(tag) {
	if (!tag) return null;

	switch (tag.toLowerCase()) {
		case "stable":
			return { text: "Stable", bgClass: "bg-emerald-600", textClass: "text-emerald-100" };
		case "beta":
			return { text: "Beta", bgClass: "bg-yellow-600", textClass: "text-yellow-100" };
		case "dev":
			return { text: "In Dev", bgClass: "bg-indigo-600", textClass: "text-indigo-100" };
		case "unsupported":
			return { text: "Unsupported", bgClass: "bg-red-700", textClass: "text-red-100" };
		case "not_tested":
			return { text: "Not Tested", bgClass: "bg-purple-600", textClass: "text-purple-100" };
		case "planned":
			return { text: "Planned", bgClass: "bg-cyan-600", textClass: "text-cyan-100" };
		case "paused":
			return { text: "Paused", bgClass: "bg-orange-600", textClass: "text-orange-100" };

		case "active":
			return { text: "Active", bgClass: "bg-sky-600", textClass: "text-sky-100" };
		case "passive":
			return { text: "Passive", bgClass: "bg-slate-500", textClass: "text-slate-100" };
		case "rarely":
			return { text: "Rarely", bgClass: "bg-gray-700", textClass: "text-gray-300" };

		default:
			return null;
	}
}
