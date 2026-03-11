/**
 * ═══════════════════════════════════════════════════════════════
 *  SITE CONFIGURATION
 *  Измени значения ниже, чтобы настроить портфолио под себя.
 *  Change the values below to customize the portfolio for yourself.
 * ═══════════════════════════════════════════════════════════════
 */

export const siteConfig = {
	/** Имя, отображаемое на сайте (hero, sidebar, about) */
	name: "TASKOV1CH",

	/** Короткий тег после имени (sidebar header) */
	tagline: "DEV",

	/** Уникальный идентификатор в sidebar / footer */
	id: "04-05-08",

	/** Год/текст копирайта */
	copyright: "© 2025 TASKOV1CH. CREATED WITH AI.",

	/** Заголовок вкладки браузера */
	title: "TASKOV1CH",

	/** Логотип */
	logo: "/images/taskov1ch.svg",

	/** Фавикон */
	favicon: "/images/taskov1ch.svg",

	/**
	 * URL для загрузки данных (projects, skills, links) из GitHub Gist.
	 * Если пусто — используются локальные данные из shared/constants/data.ts.
	 */
	gistRawUrl:
		"https://gist.githubusercontent.com/Taskov1ch/d8de6f1397bf4e75d6d545eb398c40f7/raw/data.json",

	/** Настройки кэширования данных Gist */
	cache: {
		/** Ключ localStorage для кэша */
		key: "portfolio_data_cache",
		/** Время жизни кэша в миллисекундах (по умолчанию 10 минут) */
		ttl: 10 * 60 * 1000,
	},

	/**
	 * Доступные языки.
	 * - 1 язык → кнопка смены языка скрыта
	 * - 2 языка → кнопка-переключатель
	 * - 3+ языков → модалка выбора с флагами
	 *
	 * Первый язык в массиве — fallback.
	 * Для каждого языка нужен соответствующий файл locales/<code>.json
	 */
	languages: [
		{ code: "en", flag: "🇬🇧", name: "English" },
		{ code: "ru", flag: "🇷🇺", name: "Русский" },
		{ code: "uk", flag: "🇺🇦", name: "Українська" },
	],

	/** Мини-терминал на главной (fastfetch-style) */
	terminal: {
		/** Изображение рядом с инфо (APNG / PNG / GIF) */
		image: "/images/md.png",
		/** Имя владельца (первая часть title-строки) */
		ownerName: "taskov1ch (Асхат)",
		/** Дата рождения для подсчёта uptime (ISO формат) */
		birthDate: "2008-05-04",
		/** Показывать замаскированный IP */
		showIp: true,
	},
} as const;
