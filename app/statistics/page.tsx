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

  const uniqueOrigins = new Set(activePlants.map(p => p.origin).filter(o => o && o.trim() !== ''));

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
    worldTour: uniqueOrigins.size >= 3
  };

  const oldestPlantDate = plants.length > 0 
    ? new Date(Math.min(...plants.map(p => new Date(p.createdAt).getTime()))) 
    : null;

  const stats = {
    totalWatered,
    activeCount,
    archivedCount,
    oldestPlantDate,
  };

  return (
    <StatisticsClient 
      plants={enrichedPlants}
      badges={badges}
      stats={stats}
    />
  );
}
