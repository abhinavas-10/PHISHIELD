import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tanstackStart({
      server: {
        entry: "server",
      },
    }),
    tailwindcss(),
    viteReact(),
  ],

  resolve: {
    tsconfigPaths: true,
  },

  server: {
    proxy: {
      "/api": {
        target:
          process.env["FLASK_API_URL"] ??
          "http://127.0.0.1:5000",
        changeOrigin: true,
      },
    },
  },
});