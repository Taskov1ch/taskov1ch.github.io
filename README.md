<div align="center">
  <img src="public/images/taskov1ch.svg" width="120" height="120" alt="Logo" />
  <h1>TASKOV1CH'S // WEBSITE</h1>
  <p>
    <strong>Cyberpunk Portfolio Terminal</strong>
    <br />
    Inspired by <em><a href="https://endfield.gryphline.com/">Arknights: Endfield</a></em> & <a href="https://www.cyberpunk.net/">Cyberpunk 2077</a> aesthetics.
  </p>

  <p>
    <a href="https://react.dev/">
      <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    </a>
    <a href="https://vitejs.dev/">
      <img src="https://img.shields.io/badge/Vite_7-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    </a>
    <a href="https://tailwindcss.com/">
      <img src="https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    </a>
  </p>
</div>

---

## ⚡ About the Project

**Taskov1ch Website** — web portfolio in a cyberpunk / industrial futurism style, inspired by **Arknights: Endfield** and **Cyberpunk 2077**.
Simulates a cyber-terminal interface with glitch animations, scan-line effects, and neon accents.

### ✨ Key Features

- **🏗 Feature-Based Architecture:** Clean modular structure — `features/`, `widgets/`, `pages/`, `shared/`.
- **📱 Responsive Interface:**
  - **Desktop:** Sidebar with hover-expand, content area.
  - **Mobile:** Burger menu with Ark UI Drawer.
- **🌍 i18n Localization:**
  - Multi-language support with auto-detection. Add a locale JSON and a config entry — done.
- **🐙 GitHub Integration:**
  - Fetches `README.md` from repositories in real time.
  - Loads projects/skills/links data from a GitHub Gist (with local fallback + caching).
- **🔄 Animations:**
  - Page transitions, glitch text, scan-line, neon card hover, skill bar fill — powered by **Framer Motion** + CSS.
- **⚙️ Easy Customisation:**
  - Single config file (`src/shared/constants/site.config.ts`) to set name, logo, copyright, Gist URL, languages, cache TTL.

---

## 🛠 Tech Stack

| Category | Technologies |
| --- | --- |
| **Core** | React 19, TypeScript 5.9 |
| **Build Tool** | Vite 7 |
| **Styling** | Tailwind CSS 4 (CSS-first config) |
| **Router** | React Router DOM 7 (HashRouter) |
| **Animation** | Framer Motion |
| **UI Primitives** | Ark UI |
| **Icons** | React Icons |
| **i18n** | i18next, react-i18next, i18next-browser-languagedetector |
| **Markdown** | react-markdown, remark-gfm, rehype-raw |
| **Deploy** | GitHub Pages (gh-pages) |

---

## 🚀 Quick Start

### Use as a template

1. **Fork / clone the repo:**

   ```bash
   git clone https://github.com/Taskov1ch/taskov1ch.github.io.git
   cd taskov1ch.github.io
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Edit the config to make it yours:**

   Open [`src/shared/constants/site.config.ts`](src/shared/constants/site.config.ts) and change:

   ```ts
   export const siteConfig = {
     name: "YOUR_NAME",
     tagline: "DEV",
     id: "XX-XX-XX",
     copyright: "© 2025 YOUR_NAME",
     title: "YOUR_NAME",
     logo: "/images/your-logo.svg",
     favicon: "/images/your-logo.svg",
     gistRawUrl: "https://gist.githubusercontent.com/...",
     // ...
   };
   ```

4. **Start the dev server:**

   ```bash
   npm run dev
   ```

5. **Deploy to GitHub Pages:**

   ```bash
   npm run deploy
   ```

---

## 📂 Project Structure

```text
src/
├── app/                  # Entry point, App, providers, routes
├── features/
│   ├── data/             # Gist data fetching + caching
│   ├── github/           # README.md loader
│   └── i18n/             # i18next config, locale JSONs, language switcher
├── pages/
│   ├── home/             # Hero with glitch effect
│   ├── about/            # Bio + animated skill bars
│   ├── projects/         # Project list + live README preview
│   ├── links/            # Contact links grid
│   └── not-found/        # 404 with glitch
├── shared/
│   ├── constants/        # site.config.ts, fallback data
│   ├── hooks/            # useDeviceDetect
│   ├── lib/              # cn() utility
│   ├── types/            # TypeScript interfaces
│   └── ui/               # Reusable UI components (Button, Card, Badge, Drawer)
├── styles/
│   ├── globals.css        # Tailwind imports, @theme tokens, body
│   ├── themes.css         # Dark theme CSS variables
│   └── animations.css     # Glitch, scanline, neon, grid, skill-bar
└── widgets/
    ├── layout/            # Main layout wrapper
    ├── sidebar/           # Desktop sidebar (hover-expand)
    └── mobile-header/     # Mobile header + burger drawer
```

---

## 📄 License

This project is distributed under the **MIT** License.
See the [LICENSE](LICENSE) file for details.

<div align="center">
<br />
<sub>Designed & Built by <strong>Taskov1ch</strong> // 2026</sub>
</div>
