const DEFAULT_MAX_DIMENSION = 1600;
const DEFAULT_QUALITY = 0.84;
const SKIP_IF_SMALLER_THAN_BYTES = 350 * 1024;

function replaceExtension(filename: string, ext: string): string {
  const stem = filename.replace(/\.[^.]+$/, "");
  return `${stem || "photo"}.${ext}`;
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), mimeType, quality);
  });
}

/**
 * Downscales and re-encodes an image File in the browser before upload so huge
 * smartphone photos upload faster and stay well under server upload limits.
 * Falls back to the original File if the browser cannot decode or re-encode it.
 */
export async function compressImageForUpload(
  file: File,
  maxDimension: number = DEFAULT_MAX_DIMENSION,
  quality: number = DEFAULT_QUALITY
): Promise<File> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return file;
  }

  if (file.size <= SKIP_IF_SMALLER_THAN_BYTES && file.type === "image/webp") {
    return file;
  }

  let bitmap: ImageBitmap | null = null;
  let objectUrl: string | null = null;

  try {
    let srcWidth = 0;
    let srcHeight = 0;
    let drawSource: CanvasImageSource;

    if (typeof createImageBitmap === "function") {
      bitmap = await createImageBitmap(file);
      srcWidth = bitmap.width;
      srcHeight = bitmap.height;
      drawSource = bitmap;
    } else {
      objectUrl = URL.createObjectURL(file);
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new window.Image();
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error("Image decode failed"));
        el.src = objectUrl!;
      });
      srcWidth = img.naturalWidth;
      srcHeight = img.naturalHeight;
      drawSource = img;
    }

    if (!srcWidth || !srcHeight) {
      return file;
    }

    const scale = Math.min(1, maxDimension / Math.max(srcWidth, srcHeight));
    const targetWidth = Math.max(1, Math.round(srcWidth * scale));
    const targetHeight = Math.max(1, Math.round(srcHeight * scale));

    // Skip re-encoding already compact files that fit within maxDimension
    if (scale === 1 && file.size <= SKIP_IF_SMALLER_THAN_BYTES) {
      return file;
    }

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return file;
    }

    ctx.drawImage(drawSource, 0, 0, targetWidth, targetHeight);

    let blob = await canvasToBlob(canvas, "image/webp", quality);
    let targetExt = "webp";
    if (!blob || blob.type !== "image/webp") {
      blob = await canvasToBlob(canvas, "image/jpeg", quality);
      targetExt = "jpg";
    }

    if (!blob || blob.size === 0 || (scale === 1 && blob.size >= file.size)) {
      return file;
    }

    return new File([blob], replaceExtension(file.name, targetExt), {
      type: blob.type,
      lastModified: file.lastModified,
    });
  } catch {
    return file;
  } finally {
    if (bitmap) {
      bitmap.close();
    }
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }
  }
}
