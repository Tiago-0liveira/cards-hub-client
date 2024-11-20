import path from "path"
import react from "@vitejs/plugin-react"
import svgr from 'vite-plugin-svgr';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), svgr()],
  build: {
	sourcemap: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
