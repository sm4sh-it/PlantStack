export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  let config = await prisma.appConfig.findUnique({ where: { id: 1 } });
  if (!config) {
    config = await prisma.appConfig.create({ data: { id: 1 } });
  }
  return NextResponse.json(config);
}

export async function PUT(req: Request) {
  const data = await req.json();
  const config = await prisma.appConfig.upsert({
    where: { id: 1 },
    update: {
      onboardingSeen: data.onboardingSeen !== undefined ? data.onboardingSeen : undefined,
      language: data.language !== undefined ? data.language : undefined,
      gridColumns: data.gridColumns !== undefined ? data.gridColumns : undefined,
      dashboardTitle: data.dashboardTitle !== undefined ? data.dashboardTitle : undefined,
    },
    create: {
      id: 1,
      onboardingSeen: data.onboardingSeen || false,
      language: data.language || "en",
      gridColumns: data.gridColumns || 4,
      dashboardTitle: data.dashboardTitle || "My Jungle",
    }
  });
  return NextResponse.json(config);
}
