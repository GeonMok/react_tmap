import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path"; // 1. path 모듈 import

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // 2. resolve.alias 옵션 추가
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
