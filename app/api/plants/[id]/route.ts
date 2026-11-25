import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitizeStoredImageFilename } from "@/lib/security";
import { unlinkUnusedImages } from "@/lib/storage";

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const plant = await prisma.plant.findUnique({
      where: { id: params.id },
      include: {
        location: true,
        events: {
          orderBy: { createdAt: "desc" },
          take: 50,
        },
        photos: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!plant) {
      return NextResponse.json({ error: "Plant not found" }, { status: 404 });
    }

    // Ensure the latest PRUNE and REPOT events are always included even if older than 50 events
    const hasPrune = plant.events.some((e) => e.type === "PRUNE");
    const hasRepot = plant.events.some((e) => e.type === "REPOT");

    if (!hasPrune || !hasRepot) {
      const typesToFetch: string[] = [];
      if (!hasPrune) typesToFetch.push("PRUNE");
      if (!hasRepot) typesToFetch.push("REPOT");

      const olderEvents = await prisma.plantEvent.findMany({
        where: {
          plantId: params.id,
          type: { in: typesToFetch },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      });

      if (olderEvents.length > 0) {
        const eventMap = new Map();
        [...plant.events, ...olderEvents].forEach((e) => eventMap.set(e.id, e));
        plant.events = Array.from(eventMap.values()).sort(
          (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
    }

    return NextResponse.json(plant);
  } catch (error) {
    console.error("Fetch plant error:", error);
    return NextResponse.json({ error: "Failed to fetch plant" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const data = await req.json();

    let nextImagePath: string | null | undefined = undefined;
    if (data.imagePath !== undefined) {
      if (data.imagePath === null || data.imagePath === "") {
        nextImagePath = null;
      } else {
        const safe = sanitizeStoredImageFilename(data.imagePath);
        if (!safe) {
          return NextResponse.json({ error: "Invalid imagePath" }, { status: 400 });
        }
        nextImagePath = safe;
      }
    }

    const existing = await prisma.plant.findUnique({
      where: { id: params.id },
      select: { imagePath: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Plant not found" }, { status: 404 });
    }

    const plant = await prisma.plant.update({
      where: { id: params.id },
      data: {
        name: data.name,
        locationId: data.locationId !== undefined ? data.locationId : undefined,
        waterInterval: parseInt(data.waterInterval),
        fertilizerInterval: data.fertilizerInterval ? parseInt(data.fertilizerInterval) : null,
        bugInterval: data.bugInterval ? parseInt(data.bugInterval) : null,
        fungusInterval: data.fungusInterval ? parseInt(data.fungusInterval) : null,
        lastPruned: data.lastPruned !== undefined ? (data.lastPruned ? new Date(data.lastPruned) : null) : undefined,
        lastRepotted: data.lastRepotted !== undefined ? (data.lastRepotted ? new Date(data.lastRepotted) : null) : undefined,
        imagePath: nextImagePath,
        notes: data.notes !== undefined ? data.notes : undefined,
        scientificName: data.scientificName !== undefined ? data.scientificName : undefined,
        alias: data.alias !== undefined ? data.alias : undefined,
        wateringInfo: data.wateringInfo !== undefined ? data.wateringInfo : undefined,
        sunlightInfo: data.sunlightInfo !== undefined ? data.sunlightInfo : undefined,
        locationType: data.locationType !== undefined ? data.locationType : (data.placement ? (data.placement === "Drinnen" ? "INDOOR" : "OUTDOOR") : undefined),
        placement: data.placement !== undefined ? data.placement : undefined,
        plantType: data.plantType !== undefined ? data.plantType : undefined,
        pruningInfo: data.pruningInfo !== undefined ? data.pruningInfo : undefined,
        apiId: data.apiId !== undefined ? data.apiId : undefined,
        origin: data.origin !== undefined ? data.origin : undefined,
      },
    });

    if (existing.imagePath && existing.imagePath !== plant.imagePath) {
      await unlinkUnusedImages([existing.imagePath]);
    }

    return NextResponse.json(plant);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update plant" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { searchParams } = new URL(req.url);
    const force = searchParams.get("force") === "true";

    if (force) {
      const existing = await prisma.plant.findUnique({
        where: { id: params.id },
        select: {
          imagePath: true,
          photos: { select: { imagePath: true } },
        },
      });
      if (!existing) {
        return NextResponse.json({ error: "Plant not found" }, { status: 404 });
      }

      await prisma.plant.delete({
        where: { id: params.id },
      });

      await unlinkUnusedImages([
        existing.imagePath,
        ...existing.photos.map((photo) => photo.imagePath),
      ]);
    } else {
      await prisma.plant.update({
        where: { id: params.id },
        data: { 
          isArchived: true,
          archivedAt: new Date()
        },
      });

      await prisma.plantEvent.create({
        data: {
          plantId: params.id,
          type: "ARCHIVE"
        }
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete plant" }, { status: 500 });
  }
}
