// Используйте реальные пути к обложкам, если они есть,
// или оставьте null/пустую строку и стилизуйте карточки соответственно.
export const projects = [
  {
    id: 1,
    title: 'Крутой Telegram Бот',
    description: 'Бот для автоматизации задач в Telegram с использованием AI.',
    lang: ['Python', 'aiogram'],
    cover: '/path/to/cover1.jpg', // Замените на реальный путь или URL
    isMain: true, // Флаг для главного проекта
  },
  {
    id: 2,
    title: 'Веб-парсер',
    description: 'Скрипт для сбора данных с веб-сайтов.',
    lang: ['Python', 'BeautifulSoup', 'Requests'],
    cover: null,
    isMain: true,
  },
  {
    id: 3,
    title: 'Этот Сайт-Портфолио',
    description: 'Сайт, который вы сейчас просматриваете, сделанный на React.',
    lang: ['React', 'Vite', 'JS', 'CSS'],
    cover: '/path/to/cover3.jpg',
    isMain: false,
  },
  {
    id: 4,
    title: 'Анализ данных',
    description: 'Небольшой проект по анализу данных с использованием Pandas.',
    lang: ['Python', 'Pandas', 'Jupyter'],
    cover: null,
    isMain: false,
  },
   {
    id: 5,
    title: 'Еще один проект',
    description: 'Описание еще одного важного проекта.',
    lang: ['Python', 'Django'],
    cover: '/path/to/cover5.jpg',
    isMain: true,
  },
];