import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import purgeCss from 'vite-plugin-purgecss'; // Убедитесь, что импорт правильный

export default defineConfig({
  plugins: [
    react(),
    purgeCss({
      content: [
        './index.html', // Главный HTML-файл
        './src/**/*.{js,ts,jsx,tsx}', // Все ваши React-компоненты
      ],
      // Дополнительные опции, если нужны
      safelist: [
          'some-dynamic-class', // Классы, которые добавляются динамически
          /^modal-/, // Классы, соответствующие регулярному выражению
      ],
    }),
  ],
});