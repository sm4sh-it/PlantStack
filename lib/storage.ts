import { existsSync, mkdirSync } from "fs";
import { lstat, readdir, unlink } from "fs/promises";
import { join, resolve, sep } from "path";
import prisma from "@/lib/prisma";
import { resolveSafeUploadPath, sanitizeStoredImageFilename } from "@/lib/security";

export const ORPHAN_UPLOAD_TTL_MS = 60 * 60 * 1000; // 1 hour
export const MAX_UNATTACHED_UPLOADS = 25;
export const MAX_UPLOADS_FILE_COUNT = 1000;
export const MAX_UPLOADS_DIR_BYTES = 500 * 1024 * 1024; // 500 MB

export function getThumbsDir(): string {
  const thumbsDir = join(getUploadsDir(), ".thumbs");
  if (!existsSync(thumbsDir)) {
    mkdirSync(thumbsDir, { recursive: true });
  }
  return thumbsDir;
}

export function resolveSafeThumbPath(filename: string | null | undefined): string | null {
  const safeName = sanitizeStoredImageFilename(filename);
  if (!safeName) return null;

  const thumbsDir = getThumbsDir();
  const resolvedBase = resolve(thumbsDir);
  const resolvedTarget = resolve(resolvedBase, `${safeName}.webp`);
  if (!resolvedTarget.startsWith(resolvedBase + sep)) {
    return null;
  }
  return resolvedTarget;
}

export async function removeCachedThumb(filename: string | null | undefined): Promise<void> {
  const thumbPath = resolveSafeThumbPath(filename);
  if (!thumbPath) return;
  try {
    const st = await lstat(thumbPath);
    if (st.isFile()) {
      await unlink(thumbPath);
    }
  } catch {
    // Ignore missing cached thumbnail
  }
}

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

/**
 * Collects all image filenames currently referenced by Plant or PlantPhoto records.
 */
export async function getReferencedImageFilenames(): Promise<Set<string>> {
  const [plants, photos] = await Promise.all([
    prisma.plant.findMany({
      where: { imagePath: { not: null } },
      select: { imagePath: true },
    }),
    prisma.plantPhoto.findMany({
      select: { imagePath: true },
    }),
  ]);

  const referenced = new Set<string>();
  for (const plant of plants) {
    const safe = sanitizeStoredImageFilename(plant.imagePath);
    if (safe) referenced.add(safe);
  }
  for (const photo of photos) {
    const safe = sanitizeStoredImageFilename(photo.imagePath);
    if (safe) referenced.add(safe);
  }
  return referenced;
}

/**
 * Unlinks candidate image files on disk only when no DB row still references them
 * and the target is a regular file strictly inside uploadsDir (never a symlink).
 */
export async function unlinkUnusedImages(
  candidates: Array<string | null | undefined>
): Promise<void> {
  const uniqueSet = new Set<string>();
  for (const candidate of candidates) {
    const safe = sanitizeStoredImageFilename(candidate);
    if (safe) uniqueSet.add(safe);
  }
  const unique = Array.from(uniqueSet);
  if (unique.length === 0) return;

  const [stillInPlants, stillInPhotos] = await Promise.all([
    prisma.plant.findMany({
      where: { imagePath: { in: unique } },
      select: { imagePath: true },
    }),
    prisma.plantPhoto.findMany({
      where: { imagePath: { in: unique } },
      select: { imagePath: true },
    }),
  ]);

  const stillReferenced = new Set<string>();
  for (const p of stillInPlants) {
    const safe = sanitizeStoredImageFilename(p.imagePath);
    if (safe) stillReferenced.add(safe);
  }
  for (const ph of stillInPhotos) {
    const safe = sanitizeStoredImageFilename(ph.imagePath);
    if (safe) stillReferenced.add(safe);
  }

  const uploadsDir = getUploadsDir();
  for (const name of unique) {
    if (stillReferenced.has(name)) continue;
    const filePath = resolveSafeUploadPath(uploadsDir, name);
    if (!filePath) continue;
    try {
      const st = await lstat(filePath);
      if (st.isFile()) {
        await unlink(filePath);
      }
    } catch {
      // Ignore missing files (ENOENT) or concurrent cleanup
    }
    await removeCachedThumb(name);
  }
}

/**
 * Evicts expired unattached temp uploads older than ORPHAN_UPLOAD_TTL_MS and enforces
 * pending-upload and total uploads directory storage limits before persisting a new upload.
 */
// ponytail: O(n) readdir scan per upload; bounded by MAX_UPLOADS_FILE_COUNT (1000).
export async function enforceUploadQuotaAndCleanup(
  incomingBytes: number
): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const uploadsDir = getUploadsDir();
  const [entries, referenced] = await Promise.all([
    readdir(uploadsDir),
    getReferencedImageFilenames(),
  ]);

  const now = Date.now();
  let unattachedCount = 0;
  let totalFiles = 0;
  let totalBytes = 0;

  for (const entry of entries) {
    const filePath = join(uploadsDir, entry);
    let st;
    try {
      st = await lstat(filePath);
    } catch {
      continue;
    }
    if (!st.isFile()) continue;

    const safeName = sanitizeStoredImageFilename(entry);
    const isUnattached = Boolean(safeName && !referenced.has(safeName));

    if (isUnattached && now - st.mtimeMs > ORPHAN_UPLOAD_TTL_MS) {
      await unlink(filePath).catch(() => {});
      continue;
    }

    if (isUnattached) {
      unattachedCount += 1;
    }
    totalFiles += 1;
    totalBytes += st.size;
  }

  if (unattachedCount >= MAX_UNATTACHED_UPLOADS) {
    return {
      ok: false,
      status: 429,
      error: "Too many pending unattached uploads. Please save existing plants or try again later.",
    };
  }

  if (
    totalFiles >= MAX_UPLOADS_FILE_COUNT ||
    totalBytes + incomingBytes > MAX_UPLOADS_DIR_BYTES
  ) {
    return {
      ok: false,
      status: 507,
      error: "Upload storage quota exceeded.",
    };
  }

  return { ok: true };
}
