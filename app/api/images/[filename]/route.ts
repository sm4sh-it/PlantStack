import { NextRequest, NextResponse } from "next/server";
import { createReadStream, existsSync } from "fs";
import { join } from "path";
import { stat } from "fs/promises";

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  // Read from the data directory which will be mounted in Docker
  // Default to ../data/uploads for local dev without Docker, or /app/data/uploads inside Docker
  const dataDir = process.env.DATA_DIR || join(process.cwd(), "..", "data", "uploads");
  const filePath = join(dataDir, params.filename);

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
      // Cache images heavily
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
