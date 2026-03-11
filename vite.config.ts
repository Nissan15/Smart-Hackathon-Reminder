import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
    },
  },
  root: "client",
  build: {
    outDir: "../dist/public",
    emptyOutDir: true,
    reportCompressedSize: false,
    sourcemap: false,
    minify: "esbuild",
    cssMinify: true,
    assetsInlineLimit: 0,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
