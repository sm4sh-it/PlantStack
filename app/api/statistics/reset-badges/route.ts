import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    // 1. Set badgesResetAt to current date
    await prisma.appConfig.update({
      where: { id: 1 },
      data: { badgesResetAt: new Date() }
    });

    return NextResponse.json({ success: true, message: "Gamification badges reset successfully. A new season has started!" });
  } catch (error) {
    console.error("Failed to reset badges:", error);
    return NextResponse.json({ error: "Failed to reset badges" }, { status: 500 });
  }
}
