import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import purgecss from "vite-plugin-purgecss"

export default defineConfig({
  plugins: [
    react()
  ],
  base: "/",
})
