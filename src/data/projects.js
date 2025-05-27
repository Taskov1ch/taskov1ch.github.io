// Положите обложки в папку public/images или src/assets/images
// и импортируйте их или используйте пути из public

// Пример с путями из public:
const projectsData = [
  {
    id: 1,
    title: 'Телеграм Бот "Helper"',
    description: 'Многофункциональный бот для Telegram на Python с использованием aiogram.',
    cover: '/images/bot-cover.png', // Путь относительно папки public
    lang: ['Python', 'Aiogram'],
    isMain: true, // Главный проект
    link: 'https://github.com/Taskov1ch/helper-bot' // Ссылка на проект
  },
  {
    id: 2,
    title: 'Веб-парсер "NewsAggregator"',
    description: 'Скрипт на Python для сбора новостей с различных сайтов с помощью BeautifulSoup и Scrapy.',
    cover: '/images/parser-cover.png',
    lang: ['Python', 'BeautifulSoup', 'Scrapy'],
    isMain: true,
    link: '#'
  },
  {
    id: 3,
    title: 'Этот Сайт-Портфолио',
    description: 'Сайт, который вы сейчас видите, созданный на React и Vite.',
    cover: '/images/portfolio-cover.png',
    lang: ['React', 'Vite', 'JS', 'CSS'],
    isMain: false,
    link: '#'
  },
  {
    id: 4,
    title: 'Проект "Еще один"',
    description: 'Краткое описание еще одного вашего проекта.',
    cover: '/images/project4-cover.png',
    lang: ['Python', 'Django'],
    isMain: false,
    link: '#'
  },
    {
    id: 5,
    title: 'Проект "Пятый"',
    description: 'Описание пятого проекта.',
    cover: '/images/project5-cover.png',
    lang: ['Python', 'Flask'],
    isMain: false,
    link: '#'
  },
];

export default projectsData;