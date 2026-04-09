import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import fs from "node:fs/promises";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { injectPrerenderedSeo, prerenderRoutes } from "./src/lib/prerender-seo";

const prerenderSeoPlugin = (): Plugin => {
  let outputDir = path.resolve(__dirname, "dist");

  return {
    name: "prerender-seo",
    apply: "build",
    configResolved(config) {
      outputDir = path.resolve(__dirname, config.build.outDir);
    },
    async writeBundle() {
      const templatePath = path.join(outputDir, "index.html");
      const template = await fs.readFile(templatePath, "utf8");

      await Promise.all(
        prerenderRoutes.map(async (route) => {
          const html = injectPrerenderedSeo(template, route);
          const targetPath = route.path === "/"
            ? templatePath
            : path.join(outputDir, route.path.replace(/^\//, ""), "index.html");

          await fs.mkdir(path.dirname(targetPath), { recursive: true });
          await fs.writeFile(targetPath, html, "utf8");
        })
      );
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    prerenderSeoPlugin(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
