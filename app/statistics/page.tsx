import { prisma } from "@/lib/prisma";
import StatisticsClient from "../../components/StatisticsClient";
import { cropsData } from "@/lib/crops";

export const dynamic = "force-dynamic";

export default async function StatisticsPage() {
  const [plants, appConfig] = await Promise.all([
    prisma.plant.findMany(),
    prisma.appConfig.findUnique({ where: { id: 1 } })
  ]);
  const badgesResetAt = appConfig?.badgesResetAt || new Date(0);
  
  // Helper for names
  const hasName = (p: any, names: string[]) => {
    const searchString = `${p.name} ${p.alias || ''} ${p.scientificName || ''}`.toLowerCase();
    return names.some(n => searchString.includes(n.toLowerCase()));
  };

  const isValidOrigin = (o: string | null | undefined) => {
    if (!o) return false;
    const trimmed = o.trim();
    return trimmed !== '' && trimmed.toLowerCase() !== 'unbekannt' && trimmed.toLowerCase() !== 'unknown';
  };

  const isGothic = (p: any) => {
    if (p.sunlightInfo && p.sunlightInfo.toLowerCase().includes('shade')) return true;
    if (hasName(p, ['dark', 'black', 'raven', 'schwarz', 'dunkel'])) return true;
    return false;
  };
  // Transform or enrich data if needed
  const enrichedPlants = plants.map((plant) => {
    let isVegetableOrFruit = false;
    let isBohniOrPiranha = false;
    let category = "Indoor"; // fallback

    if (plant.locationType === "OUTDOOR") category = "Outdoor";
    if (plant.locationType === "INDOOR") category = "Indoor";

    if (plant.apiId) {
      const crop = cropsData.find(c => c.id === plant.apiId);
      if (crop) {
        if (crop.category === "vegetable" || crop.category === "fruit" || crop.category === "berry") {
          isVegetableOrFruit = true;
          // Sub-categorize further for the charts
          category = crop.category.charAt(0).toUpperCase() + crop.category.slice(1);
        }
        if (crop.category === "herb") category = "Herb";
        if (plant.apiId === "crop_easteregg_bohni" || plant.apiId === "crop_easteregg_piranha") {
          isBohniOrPiranha = true;
          category = "Easter Egg";
        }
      }
    }

    return {
      ...plant,
      isVegetableOrFruit,
      isBohniOrPiranha,
      chartCategory: category
    };
  });

  // Calculate Badges Server-Side (or pass down to client)
  const totalWatered = plants.reduce((sum, p) => sum + p.wateredCount, 0);
  const activeCount = plants.filter(p => !p.isArchived).length;
  const archivedCount = plants.filter(p => p.isArchived).length;

  const activePlants = enrichedPlants.filter(p => !p.isArchived);

  const totalCount = activeCount + archivedCount;
  const survivalRate = totalCount === 0 ? "N/A" : Math.round((activeCount / totalCount) * 100) + "%";

  // Calculate Badges Server-Side using New Season Logic
  const badgePlants = enrichedPlants.filter(p => new Date(p.createdAt) >= badgesResetAt);
  const badgeActivePlants = badgePlants.filter(p => !p.isArchived);
  const badgeArchivedCount = badgePlants.filter(p => p.isArchived).length;
  const badgeActiveCount = badgeActivePlants.length;

  const badgeWaterings = await prisma.plantEvent.count({
    where: {
      type: "WATER",
      createdAt: { gte: badgesResetAt }
    }
  });

  const badgeHasVegetableOrFruit = badgeActivePlants.some(p => p.isVegetableOrFruit);
  const badgeHasEasterEggActive = badgeActivePlants.some(p => p.isBohniOrPiranha);

  const badgeHasTomato = badgeActivePlants.some(p => p.apiId === 'crop_tomato' || hasName(p, ['tomato', 'tomate']));
  const badgeHasBasil = badgeActivePlants.some(p => p.apiId === 'crop_basil' || hasName(p, ['basil', 'basilikum']));
  const badgeHasPotato = badgeActivePlants.some(p => p.apiId === 'crop_potato' || hasName(p, ['potato', 'kartoffel']));
  const badgeHasRosemary = badgeActivePlants.some(p => p.apiId === 'crop_rosemary' || hasName(p, ['rosemary', 'rosmarin']));
  
  const badgeMonsteraCount = badgeActivePlants.filter(p => hasName(p, ['monstera'])).length;
  const badgeHasStrelitzie = badgeActivePlants.some(p => hasName(p, ['strelitzie', 'bird of paradise']));

  const badgeDesertCount = badgeActivePlants.filter(p => hasName(p, ['kaktus', 'cactus', 'aloe', 'sukkulente', 'succulent']) || p.waterInterval >= 21).length;

  const validOriginsList = activePlants.map(p => p.origin).filter(isValidOrigin) as string[];
  const originCounts: Record<string, number> = {};
  validOriginsList.forEach(o => {
    originCounts[o] = (originCounts[o] || 0) + 1;
  });
  const topOrigins = Object.entries(originCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const badgeValidOriginsList = badgeActivePlants.map(p => p.origin).filter(isValidOrigin) as string[];
  const badgeUniqueOrigins = new Set(badgeValidOriginsList);

  const badgeHasLemon = badgeActivePlants.some(p => p.apiId === 'crop_lemon' || hasName(p, ['lemon', 'zitrone', 'citrus']));
  const badgeHasCucumber = badgeActivePlants.some(p => p.apiId === 'crop_cucumber' || hasName(p, ['cucumber', 'gurke']));
  const badgeHasDramaQueen = badgeActivePlants.some(p => hasName(p, ['spathiphyllum', 'peace lily', 'einblatt', 'fittonia', 'mosaikpflanze']));
  
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
  const badgeRecentArchivedCount = plants.filter(p => p.isArchived && p.archivedAt && new Date(p.archivedAt) >= badgesResetAt && new Date(p.archivedAt) >= twoMonthsAgo).length;

  const badgeGothicCount = badgeActivePlants.filter(isGothic).length;
  const badgeUniqueLocations = new Set(badgePlants.map(p => p.locationId).filter(Boolean));
  const badgeUniqueSpecies = new Set(badgeActivePlants.map(p => p.apiId || p.scientificName || p.name).filter(Boolean)).size;
  
  const badgeHasThyme = badgeActivePlants.some(p => p.apiId === 'crop_thyme' || hasName(p, ['thymian', 'thyme']));
  const badgeHasOregano = badgeActivePlants.some(p => p.apiId === 'crop_oregano' || hasName(p, ['oregano']));
  const badgeHasMarjoram = badgeActivePlants.some(p => p.apiId === 'crop_marjoram' || hasName(p, ['majoran', 'marjoram']));
  const badgeMediterraneanCount = [badgeHasThyme, badgeHasRosemary, badgeHasOregano, badgeHasBasil, badgeHasMarjoram].filter(Boolean).length;

  const badges = {
    rainmaker: badgeWaterings >= 100,
    botanyNerd: badgeActiveCount >= 10,
    harvestTime: badgeHasVegetableOrFruit,
    petSematary: badgeArchivedCount >= 1,
    itSupport: badgeHasEasterEggActive,
    pizzaMargherita: badgeHasTomato && badgeHasBasil,
    wedges: badgeHasPotato && badgeHasRosemary,
    jungle: badgeMonsteraCount >= 4,
    rainforest: badgeMonsteraCount >= 1 && badgeHasStrelitzie,
    desert: badgeDesertCount >= 3,
    worldTour: badgeUniqueOrigins.size >= 8,
    ginTonic: badgeHasLemon && badgeHasCucumber,
    dramaQueen: badgeHasDramaQueen,
    serialKiller: badgeRecentArchivedCount >= 3,
    gothicGarden: badgeGothicCount >= 3,
    castle: badgeUniqueLocations.size >= 6,
    hauntedCastle: badgeArchivedCount >= 10,
    diversityBronze: badgeUniqueSpecies >= 5,
    diversitySilver: badgeUniqueSpecies >= 10,
    diversityGold: badgeUniqueSpecies >= 20,
    mediterraneanMix: badgeMediterraneanCount >= 3
  };

  const oldestPlantDate = plants.length > 0 
    ? new Date(Math.min(...plants.map(p => new Date(p.createdAt).getTime()))) 
    : null;

  // Fetch Events for Monthly/Yearly summary
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const events = await prisma.plantEvent.findMany({
    where: {
      createdAt: {
        gte: new Date(currentYear, 0, 1) // From start of year
      }
    }
  });

  const eventSummary = {
    monthWater: 0, monthFertilize: 0, monthCreate: 0, monthArchive: 0,
    yearWater: 0, yearFertilize: 0, yearCreate: 0, yearArchive: 0,
  };

  events.forEach(e => {
    const isCurrentMonth = e.createdAt.getMonth() === currentMonth;
    if (e.type === "WATER") { eventSummary.yearWater++; if (isCurrentMonth) eventSummary.monthWater++; }
    if (e.type === "FERTILIZE") { eventSummary.yearFertilize++; if (isCurrentMonth) eventSummary.monthFertilize++; }
    if (e.type === "CREATE") { eventSummary.yearCreate++; if (isCurrentMonth) eventSummary.monthCreate++; }
    if (e.type === "ARCHIVE") { eventSummary.yearArchive++; if (isCurrentMonth) eventSummary.monthArchive++; }
  });

  // Calculate matrix data
  const getSunlightScore = (p: any) => {
    const s = p.sunlightInfo?.toLowerCase() || "";
    if (s.includes('full_sun') || s.includes('direct')) return 3;
    if (s.includes('partial_shade') || s.includes('indirect')) return 2;
    if (s.includes('shade') || s.includes('low')) return 1;
    return 2; // Default to partial
  };

  const matrixData = activePlants.map(p => {
    const baseX = getSunlightScore(p);
    const baseY = Math.max(1, 30 - p.waterInterval);
    
    // Random jitter to prevent overlapping dots (clusters)
    const jitterX = (Math.random() - 0.5) * 0.3;
    const jitterY = (Math.random() - 0.5) * 1.5;

    return {
      name: p.name,
      x: baseX + jitterX,
      y: baseY + jitterY,
      originalInterval: p.waterInterval,
      originalSunlight: p.sunlightInfo
    };
  });

  // Calculate Radar Data (The Garden Vibe)
  let totalWaterInterval = 0;
  let totalLightScore = 0;
  let diversitySet = new Set<string>();
  let nutzCount = 0;
  let freiluftCount = 0;

  activePlants.forEach(p => {
    totalWaterInterval += Math.min(30, p.waterInterval); // Cap at 30
    totalLightScore += getSunlightScore(p);
    if (p.apiId || p.scientificName || p.name) {
      diversitySet.add(p.apiId || p.scientificName || p.name);
    }
    const pType = (p as any).plantType || "Zierpflanze";
    const placement = (p as any).placement || "Drinnen";
    if (pType === "Nutzpflanze") nutzCount++;
    if (placement === "Draußen" || placement === "Balkon" || p.locationType === "OUTDOOR") freiluftCount++;
  });

  const avgWater = activePlants.length ? (totalWaterInterval / activePlants.length) : 15;
  const avgLight = activePlants.length ? (totalLightScore / activePlants.length) : 2;
  
  const scoreWater = Math.max(0, 100 - (avgWater / 30) * 100); // 1 = 100%, 30 = 0%
  const scoreLight = (avgLight / 3) * 100; // 3 = 100%, 1 = 33%
  const scoreDiversity = Math.min(100, (diversitySet.size / 15) * 100); // 15 unique = 100%
  const scoreCare = Math.min(100, (avgWater / 21) * 100); // 21+ days interval = 100% (easy care)
  const scoreNutz = activePlants.length ? (nutzCount / activePlants.length) * 100 : 0;
  const scoreFreiluft = activePlants.length ? (freiluftCount / activePlants.length) * 100 : 0;

  const radarData = [
    { subject: 'Durst', A: scoreWater, fullMark: 100 },
    { subject: 'Lichthunger', A: scoreLight, fullMark: 100 },
    { subject: 'Pflegeleichtigkeit', A: scoreCare, fullMark: 100 },
    { subject: 'Artenvielfalt', A: scoreDiversity, fullMark: 100 },
    { subject: 'Nutzgarten-Anteil', A: scoreNutz, fullMark: 100 },
    { subject: 'Freiluft-Faktor', A: scoreFreiluft, fullMark: 100 },
  ];

  const stats = {
    totalWatered,
    activeCount,
    archivedCount,
    survivalRate,
    oldestPlantDate,
    eventSummary,
    topOrigins,
    matrixData,
    radarData
  };

  return (
    <StatisticsClient 
      plants={enrichedPlants}
      badges={badges}
      stats={stats}
    />
  );
}
