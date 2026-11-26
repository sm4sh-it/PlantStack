import { NextRequest, NextResponse } from "next/server";
import { createReadStream, existsSync } from "fs";
import { lstat, writeFile } from "fs/promises";
import { getUploadsDir, resolveSafeThumbPath } from "@/lib/storage";
import { encodeThumbnailImage, resolveSafeUploadPath } from "@/lib/security";

const CACHE_HEADER = "private, max-age=604800, stale-while-revalidate=86400";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ filename: string }> }
) {
  const params = await props.params;
  const dataDir = getUploadsDir();
  const filePath = resolveSafeUploadPath(dataDir, params.filename);

  if (!filePath) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  if (!existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const fileStat = await lstat(filePath);
  if (!fileStat.isFile()) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  let servePath = filePath;
  let serveStat = fileStat;
  let contentType = "application/octet-stream";

  const variant = request.nextUrl.searchParams.get("variant");
  if (variant === "thumb") {
    const thumbPath = resolveSafeThumbPath(params.filename);
    if (thumbPath) {
      let thumbFresh = false;
      try {
        const existingThumb = await lstat(thumbPath);
        if (existingThumb.isFile() && existingThumb.mtimeMs >= fileStat.mtimeMs) {
          servePath = thumbPath;
          serveStat = existingThumb;
          thumbFresh = true;
        }
      } catch {
        // Cache miss
      }

      if (!thumbFresh) {
        try {
          const thumbBuffer = await encodeThumbnailImage(filePath);
          await writeFile(thumbPath, thumbBuffer);
          servePath = thumbPath;
          serveStat = await lstat(thumbPath);
        } catch (err) {
          console.error("Thumbnail generation failed, serving original:", err);
        }
      }

      if (servePath === thumbPath) {
        contentType = "image/webp";
      }
    }
  }

  if (contentType === "application/octet-stream") {
    const ext = params.filename.split(".").pop()?.toLowerCase();
    if (ext === "jpg" || ext === "jpeg") contentType = "image/jpeg";
    else if (ext === "png") contentType = "image/png";
    else if (ext === "webp") contentType = "image/webp";
  }

  const etag = `"${serveStat.size}-${Math.floor(serveStat.mtimeMs)}"`;
  if (request.headers.get("if-none-match") === etag) {
    return new NextResponse(null, {
      status: 304,
      headers: {
        ETag: etag,
        "Cache-Control": CACHE_HEADER,
      },
    });
  }

  const stream = createReadStream(servePath) as any;

  return new NextResponse(stream, {
    headers: {
      "Content-Type": contentType,
      "Content-Length": serveStat.size.toString(),
      "X-Content-Type-Options": "nosniff",
      ETag: etag,
      "Cache-Control": CACHE_HEADER,
    },
  });
}
