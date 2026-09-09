import { NextRequest, NextResponse } from "next/server";
import { createReadStream, existsSync } from "fs";
import { join, basename, resolve } from "path";
import { stat } from "fs/promises";
import { getUploadsDir } from "@/lib/storage";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ filename: string }> }
) {
  const params = await props.params;
  const dataDir = getUploadsDir();
  const secureFilename = basename(params.filename);
  const filePath = join(dataDir, secureFilename);

  // Canonical path containment check
  const resolvedPath = resolve(filePath);
  const resolvedDataDir = resolve(dataDir);
  if (
    !resolvedPath.startsWith(resolvedDataDir + "/") &&
    !resolvedPath.startsWith(resolvedDataDir + "\\")
  ) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  if (!existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const fileStat = await stat(filePath);
  const stream = createReadStream(filePath) as any;

  // Simple extension-based content type matching
  const ext = params.filename.split('.').pop()?.toLowerCase();
  let contentType = 'application/octet-stream';
  if (ext === 'jpg' || ext === 'jpeg') contentType = 'image/jpeg';
  else if (ext === 'png') contentType = 'image/png';
  else if (ext === 'webp') contentType = 'image/webp';
  else if (ext === 'gif') contentType = 'image/gif';

  return new NextResponse(stream, {
    headers: {
      "Content-Type": contentType,
      "Content-Length": fileStat.size.toString(),
      "X-Content-Type-Options": "nosniff",
      // Cache images heavily
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
