import { basename } from "path";

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
  const safeBase = originalName
    ? basename(originalName)
        .replace(/[^a-zA-Z0-9_-]/g, "")
        .slice(0, 30)
    : "";
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const timestamp = Date.now();
  const ext = verifiedExt.replace(/^\./, "").toLowerCase();

  return safeBase
    ? `${prefix}-${timestamp}-${safeBase}-${randomSuffix}.${ext}`
    : `${prefix}-${timestamp}-${randomSuffix}.${ext}`;
}
