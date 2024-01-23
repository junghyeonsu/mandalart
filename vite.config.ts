import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { VitePluginRadar } from "vite-plugin-radar";

export default defineConfig({
  plugins: [
    react(),
    VitePluginRadar({
      analytics: {
        id: "G-7S52Y1P368",
        config: {
          send_page_view: true,
        },
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
