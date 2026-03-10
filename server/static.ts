import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function serveStatic(app: Express) {
  const distPath = path.join(__dirname, "..", "dist", "public");
  console.log(`[StaticDiagnostics] Resolving build from: ${distPath}`);

  if (!fs.existsSync(distPath)) {
    const rootPath = path.join(__dirname, "..");
    const rootFiles = fs.readdirSync(rootPath);
    console.log(`[StaticDiagnostics] Root directory contains: ${rootFiles.join(", ")}`);

    throw new Error(
      `CRITICAL: Build directory NOT FOUND at ${distPath}. Please ensure "npm run build" has successfully completed before starting the server.`,
    );
  }

  app.use(express.static(distPath));

  // SPA catch-all: Use a middleware without a path to match everything.
  // This is the most compatible way to handle SPA routing in Express 5.
  app.use((req, res, next) => {
    // Skip if it's an API request (should have been handled above)
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.join(distPath, "index.html"));
  });
}
