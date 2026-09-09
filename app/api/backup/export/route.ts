import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import AdmZip from "adm-zip";
import { getUploadsDir } from "@/lib/storage";
import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";

export async function GET() {
  try {
    const [locations, plants, config] = await Promise.all([
      prisma.location.findMany(),
      prisma.plant.findMany({
        include: {
          events: true,
          photos: true,
        },
      }),
      prisma.appConfig.findFirst(),
    ]);

    const backupData = {
      version: "3.0.0",
      exportedAt: new Date().toISOString(),
      locations,
      plants,
      config,
    };

    const zip = new AdmZip();
    zip.addFile("data.json", Buffer.from(JSON.stringify(backupData, null, 2), "utf-8"));

    const uploadsDir = getUploadsDir();
    if (existsSync(uploadsDir)) {
      const files = readdirSync(uploadsDir);
      for (const file of files) {
        const filePath = join(uploadsDir, file);
        try {
          if (statSync(filePath).isFile()) {
            const fileData = readFileSync(filePath);
            zip.addFile(`uploads/${file}`, fileData);
          }
        } catch (e) {
          console.error(`Failed to add ${file} to backup:`, e);
        }
      }
    }

    const zipBuffer = zip.toBuffer();
    const dateStr = new Date().toISOString().slice(0, 10);

    return new NextResponse(new Uint8Array(zipBuffer), {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="plantstack-backup-${dateStr}.zip"`,
        "Content-Length": zipBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Backup export error:", error);
    return NextResponse.json({ error: "Failed to generate backup" }, { status: 500 });
  }
}
