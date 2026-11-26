import { NextRequest, NextResponse } from "next/server";
import { createReadStream, existsSync } from "fs";
import { lstat } from "fs/promises";
import { getUploadsDir } from "@/lib/storage";
import { resolveSafeUploadPath } from "@/lib/security";

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

  const etag = `"${fileStat.size}-${Math.floor(fileStat.mtimeMs)}"`;
  const ifNoneMatch = request.headers.get("if-none-match");
  if (ifNoneMatch === etag) {
    return new NextResponse(null, {
      status: 304,
      headers: {
        ETag: etag,
        "Cache-Control": "private, max-age=604800, stale-while-revalidate=86400",
      },
    });
  }

  const stream = createReadStream(filePath) as any;

  // Simple extension-based content type matching
  const ext = params.filename.split(".").pop()?.toLowerCase();
  let contentType = "application/octet-stream";
  if (ext === "jpg" || ext === "jpeg") contentType = "image/jpeg";
  else if (ext === "png") contentType = "image/png";
  else if (ext === "webp") contentType = "image/webp";

  return new NextResponse(stream, {
    headers: {
      "Content-Type": contentType,
      "Content-Length": fileStat.size.toString(),
      "X-Content-Type-Options": "nosniff",
      ETag: etag,
      "Cache-Control": "private, max-age=604800, stale-while-revalidate=86400",
    },
  });
}
