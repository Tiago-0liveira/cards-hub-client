import path from "path"
import react from "@vitejs/plugin-react"
import svgr from 'vite-plugin-svgr';
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(/*{
	babel: {
		plugins: ["babel-plugin-react-compiler"]
	}
  }*/), svgr()],
  build: {
	sourcemap: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
	port: 4173
  }
})
