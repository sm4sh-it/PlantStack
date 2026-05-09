import { prisma } from "@/lib/prisma";
import StatisticsClient from "../../components/StatisticsClient";
import { cropsData } from "@/lib/crops";

export const dynamic = "force-dynamic";

export default async function StatisticsPage() {
  const plants = await prisma.plant.findMany();
  
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

  const hasVegetableOrFruit = activePlants.some(p => p.isVegetableOrFruit);
  const hasEasterEgg = enrichedPlants.some(p => p.isBohniOrPiranha); // keep for all (even archived) or just active? Prompt: "owning" usually means active. We'll use active for gamification.
  const hasEasterEggActive = activePlants.some(p => p.isBohniOrPiranha);

  // Helper for names
  const hasName = (p: any, names: string[]) => {
    const searchString = `${p.name} ${p.alias || ''} ${p.scientificName || ''}`.toLowerCase();
    return names.some(n => searchString.includes(n.toLowerCase()));
  };

  // Combinations
  const hasTomato = activePlants.some(p => p.apiId === 'crop_tomato' || hasName(p, ['tomato', 'tomate']));
  const hasBasil = activePlants.some(p => p.apiId === 'crop_basil' || hasName(p, ['basil', 'basilikum']));
  const hasPotato = activePlants.some(p => p.apiId === 'crop_potato' || hasName(p, ['potato', 'kartoffel']));
  const hasRosemary = activePlants.some(p => p.apiId === 'crop_rosemary' || hasName(p, ['rosemary', 'rosmarin']));
  
  const monsteraCount = activePlants.filter(p => hasName(p, ['monstera'])).length;
  const hasStrelitzie = activePlants.some(p => hasName(p, ['strelitzie', 'bird of paradise']));

  const desertCount = activePlants.filter(p => hasName(p, ['kaktus', 'cactus', 'aloe', 'sukkulente', 'succulent']) || p.waterInterval >= 21).length;

  const isValidOrigin = (o: string | null | undefined) => {
    if (!o) return false;
    const trimmed = o.trim();
    return trimmed !== '' && trimmed.toLowerCase() !== 'unbekannt' && trimmed.toLowerCase() !== 'unknown';
  };

  const validOriginsList = activePlants.map(p => p.origin).filter(isValidOrigin) as string[];
  const uniqueOrigins = new Set(validOriginsList);

  const originCounts: Record<string, number> = {};
  validOriginsList.forEach(o => {
    originCounts[o] = (originCounts[o] || 0) + 1;
  });
  const topOrigins = Object.entries(originCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const hasLemon = activePlants.some(p => p.apiId === 'crop_lemon' || hasName(p, ['lemon', 'zitrone', 'citrus']));
  const hasCucumber = activePlants.some(p => p.apiId === 'crop_cucumber' || hasName(p, ['cucumber', 'gurke']));
  const hasDramaQueen = activePlants.some(p => hasName(p, ['spathiphyllum', 'peace lily', 'einblatt', 'fittonia', 'mosaikpflanze']));
  
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
  const recentArchivedCount = plants.filter(p => p.isArchived && p.archivedAt && new Date(p.archivedAt) >= twoMonthsAgo).length;

  const isGothic = (p: any) => {
    if (p.sunlightInfo && p.sunlightInfo.toLowerCase().includes('shade')) return true;
    if (hasName(p, ['dark', 'black', 'raven', 'schwarz', 'dunkel'])) return true;
    return false;
  };
  const gothicCount = activePlants.filter(isGothic).length;

  const uniqueLocations = new Set(plants.map(p => p.locationId).filter(Boolean));
  const uniqueSpecies = new Set(activePlants.map(p => p.apiId || p.scientificName || p.name).filter(Boolean)).size;
  
  const hasThyme = activePlants.some(p => p.apiId === 'crop_thyme' || hasName(p, ['thymian', 'thyme']));
  const hasOregano = activePlants.some(p => p.apiId === 'crop_oregano' || hasName(p, ['oregano']));
  const hasMarjoram = activePlants.some(p => p.apiId === 'crop_marjoram' || hasName(p, ['majoran', 'marjoram']));
  const mediterraneanCount = [hasThyme, hasRosemary, hasOregano, hasBasil, hasMarjoram].filter(Boolean).length;

  const badges = {
    rainmaker: totalWatered >= 100,
    botanyNerd: activeCount >= 10,
    harvestTime: hasVegetableOrFruit,
    petSematary: archivedCount >= 1,
    itSupport: hasEasterEggActive,
    pizzaMargherita: hasTomato && hasBasil,
    wedges: hasPotato && hasRosemary,
    jungle: monsteraCount >= 4,
    rainforest: monsteraCount >= 1 && hasStrelitzie,
    desert: desertCount >= 3,
    worldTour: uniqueOrigins.size >= 3,
    ginTonic: hasLemon && hasCucumber,
    dramaQueen: hasDramaQueen,
    serialKiller: recentArchivedCount >= 3,
    gothicGarden: gothicCount >= 3,
    castle: uniqueLocations.size >= 6,
    hauntedCastle: archivedCount >= 10,
    diversityBronze: uniqueSpecies >= 5,
    diversitySilver: uniqueSpecies >= 10,
    diversityGold: uniqueSpecies >= 20,
    mediterraneanMix: mediterraneanCount >= 3
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

  const matrixData = activePlants.map(p => ({
    name: p.name,
    x: getSunlightScore(p), // 1 = Shade, 2 = Partial, 3 = Sun
    y: Math.max(1, 30 - p.waterInterval), // Inverted: low days -> high Y
    originalInterval: p.waterInterval,
    originalSunlight: p.sunlightInfo
  }));

  const stats = {
    totalWatered,
    activeCount,
    archivedCount,
    survivalRate,
    oldestPlantDate,
    eventSummary,
    topOrigins,
    matrixData
  };

  return (
    <StatisticsClient 
      plants={enrichedPlants}
      badges={badges}
      stats={stats}
    />
  );
}
