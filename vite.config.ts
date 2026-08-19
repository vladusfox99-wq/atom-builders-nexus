import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { sites } from "@openai/sites-vite-plugin";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const { cloudflare } = await import("@cloudflare/vite-plugin");

  return {
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    sites(),
    cloudflare({
      viteEnvironment: { name: "server" },
      config: {
        main: "./worker/index.ts",
        compatibility_flags: ["nodejs_compat"],
        assets: {
          not_found_handling: "single-page-application",
        },
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  };
});
