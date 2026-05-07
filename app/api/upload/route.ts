import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as Blob | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to Data Directory
    const dataDir = process.env.DATA_DIR || join(process.cwd(), "..", "data", "uploads");
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true });
    }
    
    // Standardize filename
    const uniqueName = `${Date.now()}-${(file as any).name?.replace(/[^a-zA-Z0-9.\-]/g, '') || 'image.jpg'}`;
    const filePath = join(dataDir, uniqueName);

    await writeFile(filePath, buffer);

    return NextResponse.json({ filename: uniqueName });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
