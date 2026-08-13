// @Lovable.dev/vite-tanstack-config already provides the
// standard TanStack Start, React, Tailwind, path alias,
// Nitro, and development tooling configuration.

import { defineConfig } from "@Lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: {
      entry: "server",
    },
  },

  vite: {
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
  },
});