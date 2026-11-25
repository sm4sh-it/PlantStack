import { randomBytes } from "crypto";
import { basename, resolve, sep } from "path";

export const MAX_IMAGE_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
export const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);
export const ALLOWED_IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp"]);

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
  ext?: "jpg" | "png" | "webp";
  mime?: string;
}

/**
 * Validates image magic bytes to prevent file extension spoofing and polyglot uploads.
 */
export function validateImageMagicBytes(buffer: Buffer): ImageValidationResult {
  if (!buffer || buffer.length < 12) {
    return { valid: false, error: "File too small to be a valid image" };
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, ext: "jpg", mime: "image/jpeg" };
  }

  // PNG: 89 50 4E 47
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return { valid: true, ext: "png", mime: "image/png" };
  }

  // WEBP: RIFF .... WEBP
  if (
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return { valid: true, ext: "webp", mime: "image/webp" };
  }

  return {
    valid: false,
    error: "File signature (magic bytes) does not match allowed image formats (JPEG, PNG, WebP)",
  };
}

/**
 * Full validation of an uploaded file: size, declared MIME, and binary magic bytes.
 */
export function validateUploadedImage(
  file: Blob,
  buffer: Buffer
): ImageValidationResult {
  if (file.size > MAX_IMAGE_FILE_SIZE) {
    return {
      valid: false,
      error: `File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the 10 MB limit`,
    };
  }

  if (file.type && !ALLOWED_IMAGE_MIME_TYPES.has(file.type)) {
    return {
      valid: false,
      error: `Unsupported MIME type: ${file.type}. Allowed: JPEG, PNG, WebP`,
    };
  }

  return validateImageMagicBytes(buffer);
}

/**
 * Generates a sanitized, collision-resistant unique filename.
 */
export function generateSafeImageFilename(
  originalName: string | undefined,
  prefix: string = "plant",
  verifiedExt: string = "jpg"
): string {
  const safePrefix = prefix.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 24) || "plant";
  const safeBase = originalName
    ? basename(originalName)
        .replace(/[^a-zA-Z0-9_-]/g, "")
        .slice(0, 30)
    : "";
  const randomSuffix = randomBytes(8).toString("hex");
  const timestamp = Date.now();
  const normalizedExt = verifiedExt.replace(/^\./, "").toLowerCase();
  const ext = ALLOWED_IMAGE_EXTENSIONS.has(normalizedExt) ? normalizedExt : "jpg";

  return safeBase
    ? `${safePrefix}-${timestamp}-${safeBase}-${randomSuffix}.${ext}`
    : `${safePrefix}-${timestamp}-${randomSuffix}.${ext}`;
}

/**
 * Validates that a stored or user-supplied image filename is a single safe basename with an allowed extension.
 */
export function sanitizeStoredImageFilename(
  rawFilename: string | null | undefined
): string | null {
  if (typeof rawFilename !== "string") return null;
  const trimmed = rawFilename.trim();
  if (!trimmed || trimmed.length > 200) return null;
  if (
    trimmed.includes("/") ||
    trimmed.includes("\\") ||
    trimmed.includes("\0") ||
    trimmed.includes("..")
  ) {
    return null;
  }

  const base = basename(trimmed);
  if (base !== trimmed || base === "." || base === "..") {
    return null;
  }
  if (!/^[a-zA-Z0-9_][a-zA-Z0-9._-]*$/.test(base)) {
    return null;
  }

  const ext = base.split(".").pop()?.toLowerCase();
  if (!ext || !ALLOWED_IMAGE_EXTENSIONS.has(ext)) {
    return null;
  }

  return base;
}

/**
 * Resolves a filename strictly inside uploadsDir, preventing directory traversal.
 */
export function resolveSafeUploadPath(
  uploadsDir: string,
  filename: string | null | undefined
): string | null {
  const safeName = sanitizeStoredImageFilename(filename);
  if (!safeName) return null;

  const resolvedBase = resolve(uploadsDir);
  const resolvedTarget = resolve(resolvedBase, safeName);
  if (!resolvedTarget.startsWith(resolvedBase + sep)) {
    return null;
  }
  return resolvedTarget;
}
