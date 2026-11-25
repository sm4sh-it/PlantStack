export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { searchPlants } from "@/lib/openplantbook";
import { cropsData } from "@/lib/crops";
import { searchHouseplants, normalizeQuery, houseplantSynonyms } from "@/lib/houseplants";
import { getClientIp, checkRateLimit } from "@/lib/rateLimit";

export async function GET(req: NextRequest) {
  const clientIp = getClientIp(req);
  const rateLimit = checkRateLimit(`opb-search:${clientIp}`, 30, 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many requests to plant search. Please wait a moment." },
      {
        status: 429,
        headers: {
          "Retry-After": rateLimit.resetSeconds.toString(),
        },
      }
    );
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const lang = (searchParams.get("lang") as "en" | "de") || "de";

  if (!q || q.trim().length === 0) {
    return NextResponse.json({ results: [] });
  }

  try {
    const qTrimmed = q.trim();
    const qLower = qTrimmed.toLowerCase();
    const qNorm = normalizeQuery(qTrimmed);

    // 1. Suche in lokalen Zimmerpflanzen (Top-Priorität, 0ms Latenz, offline-fähig)
    const houseplantMatches = searchHouseplants(qTrimmed);
    const localHouseplantResults = houseplantMatches.map((h) => ({
      pid: h.id,
      display_pid: h.scientificName,
      alias: h.name[lang] || h.name.de,
      source: "houseplant",
      pet_toxic: h.pet_toxic,
      difficulty: h.difficulty,
    }));

    // 2. Suche in lokalen Nutzpflanzen & Kräutern (cropsData)
    const cropMatches = cropsData.filter((c) => {
      const deNorm = normalizeQuery(c.name.de);
      const enNorm = normalizeQuery(c.name.en);
      return deNorm.includes(qNorm) || enNorm.includes(qNorm);
    });
    const localCropResults = cropMatches.map((c) => ({
      pid: c.id,
      display_pid: c.name.en,
      alias: c.name[lang] || c.name.de,
      source: "crop",
    }));

    const combinedLocal = [...localHouseplantResults, ...localCropResults];

    // Wenn lokale Treffer vorhanden sind, diese direkt zurückgeben
    if (combinedLocal.length > 0) {
      return NextResponse.json({
        results: combinedLocal.slice(0, 8),
        totalLocal: combinedLocal.length,
      });
    }

    // 3. Fallback: OpenPlantbook (nur wenn lokal nichts gefunden wurde)
    // Falls ein deutsches Synonym existiert, nutzen wir den hinterlegten Namen
    let searchAlias = qTrimmed;
    if (houseplantSynonyms[qLower]) {
      searchAlias = houseplantSynonyms[qLower];
    }

    const opbData = await searchPlants(searchAlias);
    const opbResults = (opbData.results || []).map((r: any) => ({
      pid: r.pid,
      display_pid: r.display_pid,
      alias: r.alias || r.display_pid,
      source: "openplantbook",
    }));

    return NextResponse.json({ results: opbResults.slice(0, 8) });
  } catch (error) {
    console.warn("Notice: Search route error handled gracefully:", error);
    // Bei Fehlern niemals abstürzen, sondern leeres Ergebnis liefern
    return NextResponse.json({ results: [] });
  }
}
