export type BadgeTierDef = {
  level: number;
  threshold: number;
  titleDe: string;
  titleEn: string;
  subtitleDe: string;
  subtitleEn: string;
  descDe: string;
  descEn: string;
  badgeKey?: string;
};

export type TieredBadgeChainDef = {
  id: string;
  titleDe: string;
  titleEn: string;
  iconName: string;
  color: string;
  baseBadgeKey: string;
  tiers: BadgeTierDef[];
};

export type TieredBadgeResult = {
  id: string;
  titleDe: string;
  titleEn: string;
  iconName: string;
  color: string;
  baseBadgeKey: string;
  metric: number;
  currentTier: number; // 0 if locked, 1..N if unlocked
  maxTier: number;
  unlocked: boolean;
  activeTier: BadgeTierDef;
  nextTier: BadgeTierDef | null;
  progress: {
    current: number;
    max: number;
    percent: number;
  };
};

export const TIERED_BADGE_CHAINS: TieredBadgeChainDef[] = [
  {
    id: "rainmaker",
    titleDe: "Regenmacher",
    titleEn: "Rainmaker",
    iconName: "Droplet",
    color: "text-care-water",
    baseBadgeKey: "rainmaker",
    tiers: [
      {
        level: 1,
        threshold: 50,
        titleDe: "Regenmacher I",
        titleEn: "Rainmaker I",
        subtitleDe: "Tropfen-Pate",
        subtitleEn: "Sprout Waterer",
        descDe: "50x gegossen",
        descEn: "Watered 50x",
        badgeKey: "rainmaker_t1",
      },
      {
        level: 2,
        threshold: 100,
        titleDe: "Regenmacher II",
        titleEn: "Rainmaker II",
        subtitleDe: "Gießkannen-Meister",
        subtitleEn: "Watering Can Master",
        descDe: "100x gegossen",
        descEn: "Watered 100x",
        badgeKey: "rainmaker_t2",
      },
      {
        level: 3,
        threshold: 250,
        titleDe: "Regenmacher III",
        titleEn: "Rainmaker III",
        subtitleDe: "Regenwolke",
        subtitleEn: "Rain Cloud",
        descDe: "250x gegossen",
        descEn: "Watered 250x",
        badgeKey: "rainmaker_t3",
      },
      {
        level: 4,
        threshold: 500,
        titleDe: "Regenmacher IV",
        titleEn: "Rainmaker IV",
        subtitleDe: "Monsun-Hüter",
        subtitleEn: "Monsoon Keeper",
        descDe: "500x gegossen",
        descEn: "Watered 500x",
        badgeKey: "rainmaker_t4",
      },
      {
        level: 5,
        threshold: 1000,
        titleDe: "Regenmacher V",
        titleEn: "Rainmaker V",
        subtitleDe: "Herr der Gezeiten",
        subtitleEn: "Lord of Tides",
        descDe: "1.000x gegossen",
        descEn: "Watered 1,000x",
        badgeKey: "rainmaker_t5",
      },
    ],
  },
  {
    id: "botanyNerd",
    titleDe: "Botanik-Nerd",
    titleEn: "Botany Nerd",
    iconName: "Leaf",
    color: "text-brand",
    baseBadgeKey: "botanyNerd",
    tiers: [
      {
        level: 1,
        threshold: 10,
        titleDe: "Botanik-Nerd I",
        titleEn: "Botany Nerd I",
        subtitleDe: "Pflanzensammler",
        subtitleEn: "Plant Collector",
        descDe: "10 aktive Pflanzen",
        descEn: "10 active plants",
        badgeKey: "botanyNerd_t1",
      },
      {
        level: 2,
        threshold: 20,
        titleDe: "Botanik-Nerd II",
        titleEn: "Botany Nerd II",
        subtitleDe: "Urbane Oase",
        subtitleEn: "Urban Oasis",
        descDe: "20 aktive Pflanzen",
        descEn: "20 active plants",
        badgeKey: "botanyNerd_t2",
      },
      {
        level: 3,
        threshold: 35,
        titleDe: "Botanik-Nerd III",
        titleEn: "Botany Nerd III",
        subtitleDe: "Dschungel-Kurator",
        subtitleEn: "Jungle Curator",
        descDe: "35 aktive Pflanzen",
        descEn: "35 active plants",
        badgeKey: "botanyNerd_t3",
      },
      {
        level: 4,
        threshold: 50,
        titleDe: "Botanik-Nerd IV",
        titleEn: "Botany Nerd IV",
        subtitleDe: "Botanischer Garten",
        subtitleEn: "Botanical Garden",
        descDe: "50 aktive Pflanzen",
        descEn: "50 active plants",
        badgeKey: "botanyNerd_t4",
      },
    ],
  },
  {
    id: "worldTour",
    titleDe: "Weltreise",
    titleEn: "World Tour",
    iconName: "Globe",
    color: "text-amber-500",
    baseBadgeKey: "worldTour",
    tiers: [
      {
        level: 1,
        threshold: 4,
        titleDe: "Weltreise I",
        titleEn: "World Tour I",
        subtitleDe: "Weltenbummler",
        subtitleEn: "Globe Trotter",
        descDe: "4+ Herkunftsländer",
        descEn: "4+ plant origins",
        badgeKey: "worldTour_t1",
      },
      {
        level: 2,
        threshold: 8,
        titleDe: "Weltreise II",
        titleEn: "World Tour II",
        subtitleDe: "Globetrotter",
        subtitleEn: "World Explorer",
        descDe: "8+ Herkunftsländer",
        descEn: "8+ plant origins",
        badgeKey: "worldTour_t2",
      },
      {
        level: 3,
        threshold: 15,
        titleDe: "Weltreise III",
        titleEn: "World Tour III",
        subtitleDe: "Kosmopolit",
        subtitleEn: "Cosmopolitan",
        descDe: "15+ Herkunftsländer",
        descEn: "15+ plant origins",
        badgeKey: "worldTour_t3",
      },
    ],
  },
  {
    id: "rooms",
    titleDe: "Räume",
    titleEn: "Rooms",
    iconName: "Home",
    color: "text-amber-600",
    baseBadgeKey: "rooms",
    tiers: [
      {
        level: 1,
        threshold: 3,
        titleDe: "Räume I",
        titleEn: "Rooms I",
        subtitleDe: "Gärtnerwohnung",
        subtitleEn: "Gardener's Flat",
        descDe: "3+ Standorte",
        descEn: "3+ locations",
        badgeKey: "rooms_t1",
      },
      {
        level: 2,
        threshold: 6,
        titleDe: "Räume II",
        titleEn: "Rooms II",
        subtitleDe: "Villa mit Wintergarten",
        subtitleEn: "Townhouse & Winter Garden",
        descDe: "6+ Standorte",
        descEn: "6+ locations",
        badgeKey: "rooms_t2",
      },
      {
        level: 3,
        threshold: 10,
        titleDe: "Räume III",
        titleEn: "Rooms III",
        subtitleDe: "Pflanzenschloss",
        subtitleEn: "Plant Castle",
        descDe: "10+ Standorte",
        descEn: "10+ locations",
        badgeKey: "rooms_t3",
      },
    ],
  },
  {
    id: "repotMaster",
    titleDe: "Umtopf-Pate",
    titleEn: "Repot Master",
    iconName: "Layers",
    color: "text-emerald-500",
    baseBadgeKey: "repotMaster",
    tiers: [
      {
        level: 1,
        threshold: 3,
        titleDe: "Umtopf-Pate I",
        titleEn: "Repot Master I",
        subtitleDe: "Frische Erde",
        subtitleEn: "Fresh Soil",
        descDe: "3x umgetopft",
        descEn: "Repotted 3x",
        badgeKey: "repotMaster_t1",
      },
      {
        level: 2,
        threshold: 10,
        titleDe: "Umtopf-Pate II",
        titleEn: "Repot Master II",
        subtitleDe: "Wurzel-Architekt",
        subtitleEn: "Root Architect",
        descDe: "10x umgetopft",
        descEn: "Repotted 10x",
        badgeKey: "repotMaster_t2",
      },
      {
        level: 3,
        threshold: 25,
        titleDe: "Umtopf-Pate III",
        titleEn: "Repot Master III",
        subtitleDe: "Umtopf-Meister",
        subtitleEn: "Master Repotter",
        descDe: "25x umgetopft",
        descEn: "Repotted 25x",
        badgeKey: "repotMaster_t3",
      },
    ],
  },
  {
    id: "pruneMaster",
    titleDe: "Meister-Gärtner",
    titleEn: "Master Gardener",
    iconName: "Scissors",
    color: "text-teal-500",
    baseBadgeKey: "pruneMaster",
    tiers: [
      {
        level: 1,
        threshold: 5,
        titleDe: "Meister-Gärtner I",
        titleEn: "Master Gardener I",
        subtitleDe: "Formschnitt",
        subtitleEn: "Shape Pruner",
        descDe: "5x zurückgeschnitten",
        descEn: "Pruned 5x",
        badgeKey: "pruneMaster_t1",
      },
      {
        level: 2,
        threshold: 15,
        titleDe: "Meister-Gärtner II",
        titleEn: "Master Gardener II",
        subtitleDe: "Bonsai-Adept",
        subtitleEn: "Bonsai Adept",
        descDe: "15x zurückgeschnitten",
        descEn: "Pruned 15x",
        badgeKey: "pruneMaster_t2",
      },
      {
        level: 3,
        threshold: 30,
        titleDe: "Meister-Gärtner III",
        titleEn: "Master Gardener III",
        subtitleDe: "Gartenbaumeister",
        subtitleEn: "Horticulture Master",
        descDe: "30x zurückgeschnitten",
        descEn: "Pruned 30x",
        badgeKey: "pruneMaster_t3",
      },
    ],
  },
  {
    id: "methusalem",
    titleDe: "Methusalem",
    titleEn: "Methuselah",
    iconName: "Hourglass",
    color: "text-indigo-400",
    baseBadgeKey: "methusalem",
    tiers: [
      {
        level: 1,
        threshold: 180,
        titleDe: "Methusalem I",
        titleEn: "Methuselah I",
        subtitleDe: "Grüner Überlebender",
        subtitleEn: "Green Survivor",
        descDe: "180 Tage (6 Mon.) alt",
        descEn: "180 days (6 mo) old",
        badgeKey: "methusalem_t1",
      },
      {
        level: 2,
        threshold: 365,
        titleDe: "Methusalem II",
        titleEn: "Methuselah II",
        subtitleDe: "Jubiläum",
        subtitleEn: "Anniversary",
        descDe: "365 Tage (1 Jahr) alt",
        descEn: "365 days (1 yr) old",
        badgeKey: "methusalem_t2",
      },
      {
        level: 3,
        threshold: 730,
        titleDe: "Methusalem III",
        titleEn: "Methuselah III",
        subtitleDe: "Pflanzen-Veteran",
        subtitleEn: "Plant Veteran",
        descDe: "730 Tage (2 Jahre) alt",
        descEn: "730 days (2 yr) old",
        badgeKey: "methusalem_t3",
      },
      {
        level: 4,
        threshold: 1825,
        titleDe: "Methusalem IV",
        titleEn: "Methuselah IV",
        subtitleDe: "Uralter Wächter",
        subtitleEn: "Ancient Guardian",
        descDe: "1.825 Tage (5 Jahre) alt",
        descEn: "1,825 days (5 yr) old",
        badgeKey: "methusalem_t4",
      },
    ],
  },
  {
    id: "diversity",
    titleDe: "Artenvielfalt",
    titleEn: "Species Diversity",
    iconName: "Sprout",
    color: "text-emerald-600",
    baseBadgeKey: "diversity",
    tiers: [
      {
        level: 1,
        threshold: 5,
        titleDe: "Artenvielfalt I",
        titleEn: "Diversity I",
        subtitleDe: "Bronze-Stufe",
        subtitleEn: "Bronze Tier",
        descDe: "5+ verschiedene Arten",
        descEn: "5+ unique species",
        badgeKey: "diversity_t1",
      },
      {
        level: 2,
        threshold: 10,
        titleDe: "Artenvielfalt II",
        titleEn: "Diversity II",
        subtitleDe: "Silber-Stufe",
        subtitleEn: "Silver Tier",
        descDe: "10+ verschiedene Arten",
        descEn: "10+ unique species",
        badgeKey: "diversity_t2",
      },
      {
        level: 3,
        threshold: 20,
        titleDe: "Artenvielfalt III",
        titleEn: "Diversity III",
        subtitleDe: "Gold-Stufe",
        subtitleEn: "Gold Tier",
        descDe: "20+ verschiedene Arten",
        descEn: "20+ unique species",
        badgeKey: "diversity_t3",
      },
      {
        level: 4,
        threshold: 35,
        titleDe: "Artenvielfalt IV",
        titleEn: "Diversity IV",
        subtitleDe: "Meister-Stufe",
        subtitleEn: "Master Tier",
        descDe: "35+ verschiedene Arten",
        descEn: "35+ unique species",
        badgeKey: "diversity_t4",
      },
    ],
  },
];

export function calculateTieredBadges(metrics: Record<string, number>): TieredBadgeResult[] {
  return TIERED_BADGE_CHAINS.map((chain) => {
    const rawVal = metrics[chain.id] ?? (chain.id === "rooms" ? metrics["castle"] : 0) ?? 0;
    const metric = Math.max(0, rawVal);

    // Find highest unlocked tier
    let currentTier = 0;
    for (let i = 0; i < chain.tiers.length; i++) {
      if (metric >= chain.tiers[i].threshold) {
        currentTier = i + 1;
      } else {
        break;
      }
    }

    const maxTier = chain.tiers.length;
    const unlocked = currentTier > 0;
    const activeTier = unlocked ? chain.tiers[currentTier - 1] : chain.tiers[0];
    const nextTier = currentTier < maxTier ? chain.tiers[currentTier] : null;

    let progressCurrent = 0;
    let progressMax = 0;
    let progressPercent = 0;

    if (!unlocked) {
      // Locked: Target is Tier 1
      progressMax = chain.tiers[0].threshold;
      progressCurrent = Math.min(metric, progressMax);
      progressPercent = progressMax > 0 ? Math.min(100, Math.round((progressCurrent / progressMax) * 100)) : 0;
    } else if (nextTier) {
      // Unlocked: Target is next Tier
      progressMax = nextTier.threshold;
      progressCurrent = Math.min(metric, progressMax);
      progressPercent = progressMax > 0 ? Math.min(100, Math.round((progressCurrent / progressMax) * 100)) : 0;
    } else {
      // Max Level reached
      progressMax = activeTier.threshold;
      progressCurrent = metric;
      progressPercent = 100;
    }

    return {
      id: chain.id,
      titleDe: chain.titleDe,
      titleEn: chain.titleEn,
      iconName: chain.iconName,
      color: chain.color,
      baseBadgeKey: chain.baseBadgeKey,
      metric,
      currentTier,
      maxTier,
      unlocked,
      activeTier,
      nextTier,
      progress: {
        current: progressCurrent,
        max: progressMax,
        percent: progressPercent,
      },
    };
  });
}
