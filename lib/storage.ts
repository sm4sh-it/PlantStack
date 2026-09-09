import { join } from "path";
import { existsSync, mkdirSync } from "fs";

export function getUploadsDir(): string {
  // If explicitly configured via environment variable (e.g. inside Docker)
  if (process.env.DATA_DIR) {
    if (!existsSync(process.env.DATA_DIR)) {
      mkdirSync(process.env.DATA_DIR, { recursive: true });
    }
    return process.env.DATA_DIR;
  }

  // Standard in-project data directory
  const localProjectDir = join(process.cwd(), "data", "uploads");
  if (!existsSync(localProjectDir)) {
    // Check if legacy sibling ../data/uploads exists
    const siblingDir = join(process.cwd(), "..", "data", "uploads");
    if (existsSync(siblingDir)) {
      return siblingDir;
    }
    mkdirSync(localProjectDir, { recursive: true });
  }

  return localProjectDir;
}
