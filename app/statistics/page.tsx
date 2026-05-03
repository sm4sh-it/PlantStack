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

  const hasVegetableOrFruit = enrichedPlants.some(p => p.isVegetableOrFruit && !p.isArchived);
  const hasEasterEgg = enrichedPlants.some(p => p.isBohniOrPiranha);

  const badges = {
    rainmaker: totalWatered >= 100,
    botanyNerd: activeCount >= 10,
    harvestTime: hasVegetableOrFruit,
    petSematary: archivedCount >= 1,
    itSupport: hasEasterEgg
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
