// ==========================================
// INHALTSVERZEICHNIS - PlantStack Crops DB
// ==========================================
// 1. Gemüse (Vegetables)
// 2. Kräuter & Nützlinge (Herbs & Companions)
// 3. Beeren (Berries)
// 4. Obst (Fruits)
// 5. Easter Eggs (Secret Gamification)
//
// HINWEISE ZUR DATENSTRUKTUR:
// - Monate: 1 = Jan, 2 = Feb, ..., 12 = Dez
// - nutrition_level: "heavy" (Starkzehrer), "medium" (Mittel), "light" (Schwach)
// - sunlight: "full_sun", "partial_shade", "shade"
// ==========================================

export interface Crop {
  id: string;
  category: "vegetable" | "herb" | "berry" | "fruit";
  name: { de: string; en: string };
  sunlight: "full_sun" | "partial_shade" | "shade";
  watering_interval_days: number;
  pruning: { de: string; en: string };
  sowing_indoors_month?: number;
  planting_month?: number;
  sowing_outdoors_month?: number;
  harvest_months: number[];
  nutrition_level: "heavy" | "medium" | "light";
  spacing_cm: string;
  good_neighbors: string[];
  bad_neighbors: string[];
  frost_hardy: boolean;
  origin?: string;
}

export const cropsData: Crop[] = [
  // ==========================================
  // 1. GEMÜSE (Vegetables)
  // ==========================================
  {
    id: "crop_tomato",
    category: "vegetable",
    name: { de: "Tomate", en: "Tomato" },
    sunlight: "full_sun",
    watering_interval_days: 2,
    pruning: {
      de: "Ausgeizen: Seitentriebe in den Blattachseln regelmäßig entfernen. Überdachung gegen Krautfäule empfohlen.",
      en: "Pruning: Pinch off suckers growing in the leaf axils regularly. Shelter from rain to prevent blight."
    },
    sowing_indoors_month: 3,
    planting_month: 5,
    sowing_outdoors_month: 5,
    harvest_months: [7, 8, 9, 10],
    nutrition_level: "heavy",
    spacing_cm: "60x60",
    good_neighbors: ["crop_basil", "crop_garlic", "crop_marigold", "crop_bush_bean", "crop_parsley", "crop_kohlrabi"],
    bad_neighbors: ["crop_potato", "crop_cucumber", "crop_pea", "crop_fennel"],
    frost_hardy: false,
    origin: "South America"
  },
  {
    id: "crop_carrot",
    category: "vegetable",
    name: { de: "Karotte / Möhre", en: "Carrot" },
    sunlight: "full_sun",
    watering_interval_days: 4,
    pruning: {
      de: "Kein Rückschnitt nötig. Zu dicht stehende Keimlinge vereinzeln.",
      en: "No pruning required. Thin out seedlings if they grow too close."
    },
    sowing_outdoors_month: 3,
    harvest_months: [6, 7, 8, 9, 10],
    nutrition_level: "medium",
    spacing_cm: "5x30",
    good_neighbors: ["crop_onion", "crop_leek", "crop_pea", "crop_dill", "crop_chives", "crop_radish"],
    bad_neighbors: ["crop_parsnip", "crop_celery", "crop_fennel"],
    frost_hardy: true,
    origin: "Central Asia"
  },
  {
    id: "crop_cucumber",
    category: "vegetable",
    name: { de: "Gurke", en: "Cucumber" },
    sunlight: "full_sun",
    watering_interval_days: 1,
    pruning: {
      de: "Seitentriebe nach dem ersten Fruchtansatz einkürzen. Rankhilfe empfohlen.",
      en: "Shorten side shoots after the first fruit set. Trellis recommended."
    },
    sowing_indoors_month: 4,
    planting_month: 5,
    sowing_outdoors_month: 5,
    harvest_months: [7, 8, 9],
    nutrition_level: "heavy",
    spacing_cm: "40x100",
    good_neighbors: ["crop_onion", "crop_dill", "crop_pea", "crop_bush_bean", "crop_corn", "crop_lettuce", "crop_radish"],
    bad_neighbors: ["crop_tomato", "crop_potato", "crop_fennel"],
    frost_hardy: false,
    origin: "India / South Asia"
  },
  {
    id: "crop_zucchini",
    category: "vegetable",
    name: { de: "Zucchini", en: "Zucchini" },
    sunlight: "full_sun",
    watering_interval_days: 2,
    pruning: {
      de: "Kein klassischer Rückschnitt. Alte, bodennahe Blätter entfernen, um Mehltau vorzubeugen.",
      en: "No classic pruning. Remove old leaves near the ground to prevent powdery mildew."
    },
    sowing_indoors_month: 4,
    planting_month: 5,
    sowing_outdoors_month: 5,
    harvest_months: [6, 7, 8, 9, 10],
    nutrition_level: "heavy",
    spacing_cm: "100x100",
    good_neighbors: ["crop_onion", "crop_bush_bean", "crop_corn", "crop_nasturtium"],
    bad_neighbors: ["crop_cucumber", "crop_pumpkin"],
    frost_hardy: false,
    origin: "Central America (Mesoamerica)"
  },
  {
    id: "crop_potato",
    category: "vegetable",
    name: { de: "Kartoffel", en: "Potato" },
    sunlight: "full_sun",
    watering_interval_days: 4,
    pruning: {
      de: "Anhäufeln: Erde um die Pflanze anhäufen, sobald sie 15cm hoch ist, um Ertrag zu steigern.",
      en: "Hilling: Pile soil around the plant once it reaches 15cm to increase yield."
    },
    planting_month: 4,
    sowing_outdoors_month: 4,
    harvest_months: [7, 8, 9, 10],
    nutrition_level: "heavy",
    spacing_cm: "35x70",
    good_neighbors: ["crop_bush_bean", "crop_corn", "crop_marigold", "crop_spinach", "crop_kohlrabi"],
    bad_neighbors: ["crop_tomato", "crop_onion", "crop_cucumber", "crop_apple_tree", "crop_raspberry"],
    frost_hardy: false,
    origin: "South America (Andes)"
  },
  {
    id: "crop_bell_pepper",
    category: "vegetable",
    name: { de: "Paprika / Gemüsepaprika", en: "Bell Pepper" },
    sunlight: "full_sun",
    watering_interval_days: 2,
    pruning: {
      de: "Königsblüte (erste Blüte in der Gabelung) ausbrechen, um buschigeres Wachstum zu fördern.",
      en: "Remove the 'king bloom' (first flower in the fork) to encourage bushier growth."
    },
    sowing_indoors_month: 2,
    planting_month: 5,
    sowing_outdoors_month: 5,
    harvest_months: [7, 8, 9, 10],
    nutrition_level: "heavy",
    spacing_cm: "40x50",
    good_neighbors: ["crop_tomato", "crop_basil", "crop_onion", "crop_carrot"],
    bad_neighbors: ["crop_fennel", "crop_pea", "crop_kohlrabi"],
    frost_hardy: false,
    origin: "Central and South America"
  },
  {
    id: "crop_onion",
    category: "vegetable",
    name: { de: "Zwiebel", en: "Onion" },
    sunlight: "full_sun",
    watering_interval_days: 5,
    pruning: {
      de: "Kein Rückschnitt. Laub nach dem Umknicken im Spätsommer auf dem Beet trocknen lassen.",
      en: "No pruning. Let foliage dry after it falls over in late summer."
    },
    planting_month: 3,
    sowing_outdoors_month: 3,
    harvest_months: [7, 8, 9],
    nutrition_level: "light",
    spacing_cm: "10x25",
    good_neighbors: ["crop_carrot", "crop_strawberry", "crop_lettuce", "crop_dill"],
    bad_neighbors: ["crop_bush_bean", "crop_pea", "crop_cabbage", "crop_leek"],
    frost_hardy: true,
    origin: "Central Asia"
  },
  {
    id: "crop_garlic",
    category: "vegetable",
    name: { de: "Knoblauch", en: "Garlic" },
    sunlight: "full_sun",
    watering_interval_days: 6,
    pruning: {
      de: "Blütenstiele (Scapes) im Frühsommer entfernen, um Energie in die Knolle zu lenken.",
      en: "Remove flower stalks (scapes) in early summer to direct energy to the bulb."
    },
    planting_month: 10,
    sowing_outdoors_month: 10,
    harvest_months: [7, 8],
    nutrition_level: "light",
    spacing_cm: "15x25",
    good_neighbors: ["crop_strawberry", "crop_tomato", "crop_raspberry", "crop_carrot"],
    bad_neighbors: ["crop_bush_bean", "crop_pea", "crop_cabbage"],
    frost_hardy: true,
    origin: "Central Asia"
  },
  {
    id: "crop_radish",
    category: "vegetable",
    name: { de: "Radieschen", en: "Radish" },
    sunlight: "partial_shade",
    watering_interval_days: 2,
    pruning: { de: "Keiner nötig. Zu dicht stehende Keimlinge vereinzeln.", en: "None required. Thin out dense seedlings." },
    sowing_outdoors_month: 3,
    harvest_months: [4, 5, 6, 9, 10],
    nutrition_level: "light",
    spacing_cm: "5x15",
    good_neighbors: ["crop_bush_bean", "crop_carrot", "crop_lettuce", "crop_pea", "crop_spinach", "crop_cucumber"],
    bad_neighbors: ["crop_cabbage"],
    frost_hardy: true,
    origin: "Mediterranean"
  },
  {
    id: "crop_spinach",
    category: "vegetable",
    name: { de: "Spinat", en: "Spinach" },
    sunlight: "partial_shade",
    watering_interval_days: 3,
    pruning: { de: "Einzelne Blätter von außen nach innen ernten; Herz stehen lassen.", en: "Harvest individual leaves from outside in; keep center heart." },
    sowing_outdoors_month: 3,
    harvest_months: [4, 5, 9, 10, 11],
    nutrition_level: "light",
    spacing_cm: "10x25",
    good_neighbors: ["crop_strawberry", "crop_potato", "crop_tomato", "crop_radish", "crop_kohlrabi"],
    bad_neighbors: ["crop_chard", "crop_beetroot"],
    frost_hardy: true,
    origin: "Ancient Persia (Iran)"
  },
  {
    id: "crop_pea",
    category: "vegetable",
    name: { de: "Erbse", en: "Pea" },
    sunlight: "full_sun",
    watering_interval_days: 4,
    pruning: { de: "Rankhilfe ab 10cm Höhe erforderlich. Verbessert als Leguminose den Boden.", en: "Trellis required from 10cm height. Enriches soil with nitrogen." },
    sowing_outdoors_month: 3,
    harvest_months: [6, 7, 8],
    nutrition_level: "light",
    spacing_cm: "5x40",
    good_neighbors: ["crop_carrot", "crop_lettuce", "crop_radish", "crop_corn", "crop_cucumber"],
    bad_neighbors: ["crop_onion", "crop_garlic", "crop_leek", "crop_tomato"],
    frost_hardy: true,
    origin: "Near East / Mediterranean"
  },
  {
    id: "crop_lettuce",
    category: "vegetable",
    name: { de: "Kopfsalat / Pflücksalat", en: "Lettuce" },
    sunlight: "partial_shade",
    watering_interval_days: 2,
    pruning: { de: "Bei Pflücksalat nur äußere Blätter ernten, Herz stehen lassen.", en: "For leaf lettuce, harvest outer leaves only, leave the heart." },
    sowing_indoors_month: 3,
    planting_month: 4,
    sowing_outdoors_month: 4,
    harvest_months: [5, 6, 7, 8, 9],
    nutrition_level: "light",
    spacing_cm: "25x30",
    good_neighbors: ["crop_carrot", "crop_radish", "crop_strawberry", "crop_onion", "crop_dill", "crop_cucumber"],
    bad_neighbors: ["crop_parsley", "crop_celery"],
    frost_hardy: false,
    origin: "Mediterranean / Middle East"
  },
  {
    id: "crop_kohlrabi",
    category: "vegetable",
    name: { de: "Kohlrabi", en: "Kohlrabi" },
    sunlight: "full_sun",
    watering_interval_days: 3,
    pruning: { de: "Gleichmäßig wässern, sonst platzen oder verholzen die Knollen.", en: "Water consistently to prevent bulbs from cracking or turning woody." },
    sowing_indoors_month: 3,
    planting_month: 4,
    sowing_outdoors_month: 4,
    harvest_months: [6, 7, 8, 9, 10],
    nutrition_level: "medium",
    spacing_cm: "25x30",
    good_neighbors: ["crop_bush_bean", "crop_pea", "crop_lettuce", "crop_spinach", "crop_potato"],
    bad_neighbors: ["crop_strawberry", "crop_garlic", "crop_cabbage"],
    frost_hardy: false,
    origin: "Mediterranean"
  },
  {
    id: "crop_beetroot",
    category: "vegetable",
    name: { de: "Rote Bete", en: "Beetroot" },
    sunlight: "full_sun",
    watering_interval_days: 4,
    pruning: { de: "Junge Blätter können als Baby-Leaf-Salat geerntet werden.", en: "Young leaves can be harvested for baby leaf salad." },
    sowing_outdoors_month: 4,
    harvest_months: [8, 9, 10, 11],
    nutrition_level: "medium",
    spacing_cm: "10x30",
    good_neighbors: ["crop_onion", "crop_bush_bean", "crop_lettuce", "crop_dill", "crop_kohlrabi"],
    bad_neighbors: ["crop_chard", "crop_spinach"],
    frost_hardy: false,
    origin: "Mediterranean"
  },
  {
    id: "crop_bush_bean",
    category: "vegetable",
    name: { de: "Buschbohne", en: "Bush Bean" },
    sunlight: "full_sun",
    watering_interval_days: 4,
    pruning: { de: "Anhäufeln bei ca. 15cm Höhe für bessere Standfestigkeit.", en: "Hill up at approx. 15cm height for better stability." },
    sowing_outdoors_month: 5,
    harvest_months: [7, 8, 9, 10],
    nutrition_level: "light",
    spacing_cm: "10x40",
    good_neighbors: ["crop_strawberry", "crop_corn", "crop_beetroot", "crop_savoy_cabbage", "crop_cabbage", "crop_cucumber", "crop_savory"],
    bad_neighbors: ["crop_onion", "crop_garlic", "crop_leek", "crop_pea"],
    frost_hardy: false,
    origin: "Central and South America"
  },
  {
    id: "crop_pumpkin",
    category: "vegetable",
    name: { de: "Kürbis (z.B. Hokkaido)", en: "Pumpkin / Squash" },
    sunlight: "full_sun",
    watering_interval_days: 2,
    pruning: { de: "Haupttrieb nach 2-3 Früchten kappen, um Fruchtgröße zu fördern.", en: "Pinch off main shoot after 2-3 fruits to encourage fruit size." },
    sowing_indoors_month: 4,
    planting_month: 5,
    sowing_outdoors_month: 5,
    harvest_months: [9, 10],
    nutrition_level: "heavy",
    spacing_cm: "150x150",
    good_neighbors: ["crop_corn", "crop_bush_bean", "crop_onion", "crop_marigold"],
    bad_neighbors: ["crop_cucumber", "crop_zucchini"],
    frost_hardy: false,
    origin: "Central and South America"
  },
  {
    id: "crop_chard",
    category: "vegetable",
    name: { de: "Mangold", en: "Swiss Chard" },
    sunlight: "partial_shade",
    watering_interval_days: 3,
    pruning: { de: "Einzelne Blätter von außen ernten; Herz stehen lassen für Nachwuchs.", en: "Harvest individual leaves from outside; leave the heart for regrowth." },
    sowing_outdoors_month: 4,
    harvest_months: [6, 7, 8, 9, 10],
    nutrition_level: "medium",
    spacing_cm: "30x40",
    good_neighbors: ["crop_carrot", "crop_onion", "crop_cabbage", "crop_radish", "crop_bush_bean"],
    bad_neighbors: ["crop_spinach", "crop_beetroot"],
    frost_hardy: true,
    origin: "Mediterranean"
  },
  {
    id: "crop_leek",
    category: "vegetable",
    name: { de: "Lauch / Porree", en: "Leek" },
    sunlight: "full_sun",
    watering_interval_days: 3,
    pruning: { de: "Regelmäßig anhäufeln, um lange, zarte weiße Schäfte zu erzielen.", en: "Hill up soil around stems regularly for long, tender white shafts." },
    sowing_indoors_month: 3,
    planting_month: 5,
    sowing_outdoors_month: 4,
    harvest_months: [7, 8, 9, 10, 11, 12, 1, 2],
    nutrition_level: "heavy",
    spacing_cm: "15x30",
    good_neighbors: ["crop_carrot", "crop_strawberry", "crop_lettuce", "crop_kohlrabi", "crop_celery"],
    bad_neighbors: ["crop_bush_bean", "crop_pea", "crop_onion"],
    frost_hardy: true,
    origin: "Mediterranean"
  },
  {
    id: "crop_corn",
    category: "vegetable",
    name: { de: "Zuckermais", en: "Sweet Corn" },
    sunlight: "full_sun",
    watering_interval_days: 3,
    pruning: { de: "Im Block pflanzen (nicht in Einzelreihe), da Windbestäubung nötig ist!", en: "Plant in blocks rather than single rows for wind pollination!" },
    sowing_indoors_month: 4,
    planting_month: 5,
    sowing_outdoors_month: 5,
    harvest_months: [8, 9, 10],
    nutrition_level: "heavy",
    spacing_cm: "30x60",
    good_neighbors: ["crop_bush_bean", "crop_pumpkin", "crop_zucchini", "crop_cucumber", "crop_potato", "crop_tomato"],
    bad_neighbors: ["crop_celery", "crop_beetroot"],
    frost_hardy: false,
    origin: "Central America (Mexico)"
  },
  {
    id: "crop_pole_bean",
    category: "vegetable",
    name: { de: "Stangenbohne", en: "Pole Bean" },
    sunlight: "full_sun",
    watering_interval_days: 3,
    pruning: { de: "Stabile Kletterhilfe (2-2,5m) nötig. Bei 15cm Höhe anhäufeln.", en: "Requires tall support (2-2.5m). Hill up when 15cm high." },
    sowing_indoors_month: 4,
    planting_month: 5,
    sowing_outdoors_month: 5,
    harvest_months: [7, 8, 9, 10],
    nutrition_level: "light",
    spacing_cm: "50x80",
    good_neighbors: ["crop_corn", "crop_cucumber", "crop_radish", "crop_savory", "crop_zucchini", "crop_tomato"],
    bad_neighbors: ["crop_onion", "crop_garlic", "crop_leek", "crop_pea", "crop_fennel"],
    frost_hardy: false,
    origin: "Central and South America"
  },
  {
    id: "crop_fennel",
    category: "vegetable",
    name: { de: "Knollenfenchel", en: "Florence Fennel" },
    sunlight: "full_sun",
    watering_interval_days: 2,
    pruning: { de: "Bei Knollenbildung leicht anhäufeln. Gleichmäßig feucht halten gegen Schossen.", en: "Lightly hill up developing bulbs. Keep moist to prevent bolting." },
    sowing_indoors_month: 4,
    planting_month: 5,
    sowing_outdoors_month: 6,
    harvest_months: [8, 9, 10],
    nutrition_level: "medium",
    spacing_cm: "30x35",
    good_neighbors: ["crop_cucumber", "crop_lettuce", "crop_pea", "crop_lambs_lettuce"],
    bad_neighbors: ["crop_tomato", "crop_bell_pepper", "crop_bush_bean", "crop_dill", "crop_coriander", "crop_carrot"],
    frost_hardy: false,
    origin: "Mediterranean"
  },
  {
    id: "crop_celery",
    category: "vegetable",
    name: { de: "Sellerie (Knollen-/Stangensellerie)", en: "Celery / Celeriac" },
    sunlight: "full_sun",
    watering_interval_days: 2,
    pruning: { de: "Knolle nicht mit Erde bedecken; welke Außenblätter im Spätsommer entfernen.", en: "Do not bury celeriac crown; remove yellow outer leaves in late summer." },
    sowing_indoors_month: 2,
    planting_month: 5,
    sowing_outdoors_month: 5,
    harvest_months: [9, 10, 11],
    nutrition_level: "heavy",
    spacing_cm: "40x40",
    good_neighbors: ["crop_cabbage", "crop_savoy_cabbage", "crop_leek", "crop_tomato", "crop_bush_bean", "crop_spinach"],
    bad_neighbors: ["crop_carrot", "crop_parsnip", "crop_corn", "crop_potato"],
    frost_hardy: false,
    origin: "Mediterranean"
  },
  {
    id: "crop_parsnip",
    category: "vegetable",
    name: { de: "Pastinake", en: "Parsnip" },
    sunlight: "full_sun",
    watering_interval_days: 4,
    pruning: { de: "Kein Rückschnitt. Keimlinge auf 10-15cm vereinzeln.", en: "No pruning. Thin seedlings to 10-15cm." },
    sowing_outdoors_month: 3,
    harvest_months: [10, 11, 12, 1, 2, 3],
    nutrition_level: "medium",
    spacing_cm: "12x35",
    good_neighbors: ["crop_onion", "crop_lettuce", "crop_radish", "crop_pea"],
    bad_neighbors: ["crop_carrot", "crop_celery", "crop_fennel"],
    frost_hardy: true,
    origin: "Europe / Western Asia"
  },
  {
    id: "crop_cabbage",
    category: "vegetable",
    name: { de: "Kopfkohl (Weißkohl / Rotkohl)", en: "Cabbage (White / Red)" },
    sunlight: "full_sun",
    watering_interval_days: 3,
    pruning: { de: "Gleichmäßig gießen gegen Aufplatzen der Köpfe. Netze gegen Kohlweißling empfohlen.", en: "Water consistently to prevent splitting. Netting against cabbage whites recommended." },
    sowing_indoors_month: 3,
    planting_month: 5,
    sowing_outdoors_month: 5,
    harvest_months: [7, 8, 9, 10, 11],
    nutrition_level: "heavy",
    spacing_cm: "50x50",
    good_neighbors: ["crop_celery", "crop_tomato", "crop_spinach", "crop_bush_bean", "crop_beetroot", "crop_mint", "crop_sage"],
    bad_neighbors: ["crop_onion", "crop_garlic", "crop_strawberry", "crop_radish"],
    frost_hardy: true,
    origin: "Coastal Europe / Mediterranean"
  },
  {
    id: "crop_savoy_cabbage",
    category: "vegetable",
    name: { de: "Wirsing / Wirsingkohl", en: "Savoy Cabbage" },
    sunlight: "full_sun",
    watering_interval_days: 3,
    pruning: { de: "Regelmäßig gießen. Späte Sorten können den ganzen Winter über frisch geerntet werden.", en: "Water regularly. Winter varieties can be harvested fresh all winter." },
    sowing_indoors_month: 3,
    planting_month: 5,
    sowing_outdoors_month: 5,
    harvest_months: [7, 8, 9, 10, 11, 12, 1],
    nutrition_level: "heavy",
    spacing_cm: "50x50",
    good_neighbors: ["crop_bush_bean", "crop_celery", "crop_spinach", "crop_tomato", "crop_mint"],
    bad_neighbors: ["crop_onion", "crop_garlic", "crop_radish", "crop_strawberry"],
    frost_hardy: true,
    origin: "Mediterranean (Italy / Savoy)"
  },
  {
    id: "crop_lambs_lettuce",
    category: "vegetable",
    name: { de: "Feldsalat / Rapunzel", en: "Lamb's Lettuce / Corn Salad" },
    sunlight: "partial_shade",
    watering_interval_days: 4,
    pruning: { de: "Ganze Rosetten knapp über der Wurzel abschneiden. Vollkommen winterhart.", en: "Cut whole rosettes just above the root crown. Fully frost hardy." },
    sowing_outdoors_month: 8,
    harvest_months: [10, 11, 12, 1, 2, 3],
    nutrition_level: "light",
    spacing_cm: "10x15",
    good_neighbors: ["crop_onion", "crop_radish", "crop_strawberry", "crop_leek"],
    bad_neighbors: [],
    frost_hardy: true,
    origin: "Europe / Mediterranean"
  },
  {
    id: "crop_arugula",
    category: "vegetable",
    name: { de: "Rucola / Wilde Rauke", en: "Arugula / Rocket" },
    sunlight: "partial_shade",
    watering_interval_days: 2,
    pruning: { de: "Blätter 2cm über dem Boden schneiden; wächst mehrfach nach.", en: "Cut leaves 2cm above soil; regrows multiple times." },
    sowing_outdoors_month: 4,
    harvest_months: [5, 6, 7, 8, 9, 10],
    nutrition_level: "light",
    spacing_cm: "15x20",
    good_neighbors: ["crop_carrot", "crop_lettuce", "crop_spinach", "crop_bush_bean"],
    bad_neighbors: ["crop_cabbage", "crop_radish"],
    frost_hardy: true,
    origin: "Mediterranean"
  },
  {
    id: "crop_broccoli",
    category: "vegetable",
    name: { de: "Brokkoli", en: "Broccoli" },
    sunlight: "full_sun",
    watering_interval_days: 2,
    pruning: { de: "Hauptkopf zuerst ernten, danach bilden sich noch viele Wochen Seitentriebe.", en: "Harvest main head first, then side shoots continue to produce for weeks." },
    sowing_indoors_month: 4,
    planting_month: 5,
    sowing_outdoors_month: 5,
    harvest_months: [7, 8, 9, 10],
    nutrition_level: "heavy",
    spacing_cm: "50x50",
    good_neighbors: ["crop_celery", "crop_bush_bean", "crop_spinach", "crop_mint", "crop_dill"],
    bad_neighbors: ["crop_onion", "crop_garlic", "crop_strawberry", "crop_tomato"],
    frost_hardy: false,
    origin: "Mediterranean (Italy)"
  },
  {
    id: "crop_cauliflower",
    category: "vegetable",
    name: { de: "Blumenkohl", en: "Cauliflower" },
    sunlight: "full_sun",
    watering_interval_days: 2,
    pruning: { de: "Innere Blätter über den Kopf knicken, damit er strahlend weiß bleibt.", en: "Snap inner leaves over the curd to shield it from sun and keep it white." },
    sowing_indoors_month: 3,
    planting_month: 5,
    sowing_outdoors_month: 5,
    harvest_months: [6, 7, 8, 9, 10],
    nutrition_level: "heavy",
    spacing_cm: "50x50",
    good_neighbors: ["crop_celery", "crop_bush_bean", "crop_spinach", "crop_mint"],
    bad_neighbors: ["crop_onion", "crop_garlic", "crop_strawberry"],
    frost_hardy: false,
    origin: "Mediterranean (Cyprus / Middle East)"
  },
  {
    id: "crop_kale",
    category: "vegetable",
    name: { de: "Grünkohl / Krauskohl", en: "Kale" },
    sunlight: "full_sun",
    watering_interval_days: 3,
    pruning: { de: "Blätter von unten nach oben ernten. Frost wandelt Stärke in Zucker um.", en: "Harvest leaves from bottom up. Frost converts starch into sugar." },
    sowing_indoors_month: 5,
    planting_month: 6,
    sowing_outdoors_month: 6,
    harvest_months: [10, 11, 12, 1, 2],
    nutrition_level: "heavy",
    spacing_cm: "50x50",
    good_neighbors: ["crop_celery", "crop_bush_bean", "crop_spinach", "crop_tomato", "crop_mint"],
    bad_neighbors: ["crop_onion", "crop_garlic", "crop_strawberry"],
    frost_hardy: true,
    origin: "Eastern Mediterranean"
  },
  {
    id: "crop_eggplant",
    category: "vegetable",
    name: { de: "Aubergine / Eierfrucht", en: "Eggplant / Aubergine" },
    sunlight: "full_sun",
    watering_interval_days: 2,
    pruning: { de: "Wärmebedarf wie Paprika. Ersten Fruchtansatz fördern, Triebspitzen im Spätsommer kappen.", en: "Needs high heat. Pinch shoot tips in late summer so existing fruits ripen." },
    sowing_indoors_month: 2,
    planting_month: 5,
    sowing_outdoors_month: 5,
    harvest_months: [7, 8, 9, 10],
    nutrition_level: "heavy",
    spacing_cm: "50x60",
    good_neighbors: ["crop_bush_bean", "crop_spinach", "crop_marigold", "crop_basil"],
    bad_neighbors: ["crop_tomato", "crop_potato", "crop_fennel"],
    frost_hardy: false,
    origin: "India / Southeast Asia"
  },
  {
    id: "crop_chili",
    category: "vegetable",
    name: { de: "Chili / Peperoni", en: "Chili Pepper" },
    sunlight: "full_sun",
    watering_interval_days: 2,
    pruning: { de: "Königsblüte ausbrechen fördert Verzweigung und Ertrag. Vor Kälte schützen.", en: "Pinching the king flower encourages branching. Protect from cold below 10°C." },
    sowing_indoors_month: 2,
    planting_month: 5,
    sowing_outdoors_month: 5,
    harvest_months: [7, 8, 9, 10, 11],
    nutrition_level: "heavy",
    spacing_cm: "40x40",
    good_neighbors: ["crop_tomato", "crop_basil", "crop_onion", "crop_marigold"],
    bad_neighbors: ["crop_fennel", "crop_pea", "crop_kohlrabi"],
    frost_hardy: false,
    origin: "Central and South America (Mexico)"
  },
  {
    id: "crop_rhubarb",
    category: "vegetable",
    name: { de: "Rhabarber", en: "Rhubarb" },
    sunlight: "full_sun",
    watering_interval_days: 3,
    pruning: { de: "Stangen herausdrehen (nicht schneiden!). Ernte ab 24. Juni wegen Oxalsäure beenden.", en: "Twist and pull stalks (do not cut). Stop harvest after June 24 due to oxalic acid." },
    planting_month: 10,
    harvest_months: [4, 5, 6],
    nutrition_level: "heavy",
    spacing_cm: "100x100",
    good_neighbors: ["crop_spinach", "crop_lettuce", "crop_bush_bean"],
    bad_neighbors: ["crop_cucumber", "crop_zucchini"],
    frost_hardy: true,
    origin: "Central Asia / Siberia"
  },
  {
    id: "crop_snap_pea",
    category: "vegetable",
    name: { de: "Zuckerschote / Kaiserschote", en: "Snap Pea / Snow Pea" },
    sunlight: "full_sun",
    watering_interval_days: 3,
    pruning: { de: "Rankhilfe geben. Schoten jung und flach ernten, bevor die Erbsen dick werden.", en: "Provide trellis. Harvest pods young and flat before peas swell." },
    sowing_outdoors_month: 3,
    harvest_months: [5, 6, 7],
    nutrition_level: "light",
    spacing_cm: "5x40",
    good_neighbors: ["crop_carrot", "crop_radish", "crop_lettuce", "crop_cucumber"],
    bad_neighbors: ["crop_onion", "crop_garlic", "crop_leek", "crop_tomato"],
    frost_hardy: true,
    origin: "Near East / Mediterranean"
  },

  // ==========================================
  // 2. KRÄUTER & NÜTZLINGE (Herbs & Companions)
  // ==========================================
  {
    id: "crop_basil",
    category: "herb",
    name: { de: "Basilikum", en: "Basil" },
    sunlight: "full_sun",
    watering_interval_days: 2,
    pruning: {
      de: "Triebspitzen regelmäßig über einem Blattpaar kappen, um buschiges Wachstum zu fördern. Blüten entfernen.",
      en: "Pinch off top shoots above a leaf node to encourage bushy growth. Remove flowers."
    },
    sowing_indoors_month: 3,
    planting_month: 5,
    sowing_outdoors_month: 5,
    harvest_months: [6, 7, 8, 9],
    nutrition_level: "medium",
    spacing_cm: "25x25",
    good_neighbors: ["crop_tomato", "crop_cucumber", "crop_bell_pepper"],
    bad_neighbors: ["crop_lemon_balm", "crop_mint", "crop_rosemary"],
    frost_hardy: false,
    origin: "India"
  },
  {
    id: "crop_rosemary",
    category: "herb",
    name: { de: "Rosmarin", en: "Rosemary" },
    sunlight: "full_sun",
    watering_interval_days: 7,
    pruning: {
      de: "Im Frühjahr leicht in Form schneiden. Nicht ins alte (braune) Holz schneiden.",
      en: "Prune lightly in spring to shape. Do not cut into the old (brown) wood."
    },
    planting_month: 5,
    sowing_outdoors_month: 5,
    harvest_months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    nutrition_level: "light",
    spacing_cm: "50x50",
    good_neighbors: ["crop_sage", "crop_thyme", "crop_carrot"],
    bad_neighbors: ["crop_basil", "crop_mint"],
    frost_hardy: true,
    origin: "Mediterranean"
  },
  {
    id: "crop_thyme",
    category: "herb",
    name: { de: "Thymian", en: "Thyme" },
    sunlight: "full_sun",
    watering_interval_days: 7,
    pruning: {
      de: "Im Frühjahr stark zurückschneiden, um Verholzung vorzubeugen. Nicht bis ins ganz alte Holz.",
      en: "Prune back hard in spring to prevent woodiness. Avoid cutting into very old wood."
    },
    planting_month: 4,
    sowing_outdoors_month: 4,
    harvest_months: [4, 5, 6, 7, 8, 9, 10],
    nutrition_level: "light",
    spacing_cm: "25x25",
    good_neighbors: ["crop_rosemary", "crop_sage", "crop_strawberry"],
    bad_neighbors: ["crop_marjoram"],
    frost_hardy: true,
    origin: "Mediterranean"
  },
  {
    id: "crop_mint",
    category: "herb",
    name: { de: "Minze (z.B. Pfefferminze)", en: "Mint" },
    sunlight: "partial_shade",
    watering_interval_days: 2,
    pruning: {
      de: "Regelmäßig mutig zurückschneiden. Achtung: Breitet sich durch Ausläufer sehr stark aus (Wurzelsperre empfohlen)!",
      en: "Prune back boldly and regularly. Note: Spreads aggressively via runners (root barrier recommended)!"
    },
    planting_month: 4,
    sowing_outdoors_month: 3,
    harvest_months: [5, 6, 7, 8, 9, 10],
    nutrition_level: "medium",
    spacing_cm: "40x40",
    good_neighbors: ["crop_tomato", "crop_cabbage"],
    bad_neighbors: ["crop_basil", "crop_chamomile"],
    frost_hardy: true,
    origin: "Europe / Mediterranean"
  },
  {
    id: "crop_parsley",
    category: "herb",
    name: { de: "Petersilie", en: "Parsley" },
    sunlight: "partial_shade",
    watering_interval_days: 3,
    pruning: {
      de: "Immer die äußeren Stiele ernten, das Herz stehen lassen. Im zweiten Jahr blüht sie und wird ungenießbar.",
      en: "Always harvest outer stalks, leave the heart. In second year it flowers and becomes inedible."
    },
    sowing_outdoors_month: 3,
    harvest_months: [5, 6, 7, 8, 9, 10, 11],
    nutrition_level: "medium",
    spacing_cm: "20x20",
    good_neighbors: ["crop_tomato", "crop_radish", "crop_onion"],
    bad_neighbors: ["crop_lettuce", "crop_fennel"],
    frost_hardy: true,
    origin: "Mediterranean"
  },
  {
    id: "crop_chives",
    category: "herb",
    name: { de: "Schnittlauch", en: "Chives" },
    sunlight: "partial_shade",
    watering_interval_days: 3,
    pruning: {
      de: "Regelmäßig handbreit über dem Boden abschneiden. Blüten sind essbar, schwächen aber das Blattwachstum.",
      en: "Cut back regularly a few inches above ground. Flowers are edible but slow leaf growth."
    },
    planting_month: 3,
    sowing_outdoors_month: 3,
    harvest_months: [3, 4, 5, 6, 7, 8, 9, 10, 11],
    nutrition_level: "medium",
    spacing_cm: "20x20",
    good_neighbors: ["crop_apple_tree", "crop_strawberry", "crop_carrot", "crop_tomato"],
    bad_neighbors: ["crop_bush_bean", "crop_pea"],
    frost_hardy: true,
    origin: "Eurasia / North America"
  },
  {
    id: "crop_sage",
    category: "herb",
    name: { de: "Salbei", en: "Sage" },
    sunlight: "full_sun",
    watering_interval_days: 6,
    pruning: {
      de: "Nach der Blüte oder im zeitigen Frühjahr zurückschneiden, um kompakten Wuchs zu erhalten.",
      en: "Prune after flowering or in early spring to maintain compact growth."
    },
    planting_month: 4,
    sowing_outdoors_month: 4,
    harvest_months: [5, 6, 7, 8, 9, 10],
    nutrition_level: "light",
    spacing_cm: "40x40",
    good_neighbors: ["crop_rosemary", "crop_thyme", "crop_cabbage", "crop_carrot"],
    bad_neighbors: ["crop_basil", "crop_wormwood"],
    frost_hardy: true,
    origin: "Mediterranean"
  },
  {
    id: "crop_oregano",
    category: "herb",
    name: { de: "Oregano / Dost", en: "Oregano" },
    sunlight: "full_sun",
    watering_interval_days: 7,
    pruning: {
      de: "Vor der Blüte ist das Aroma am stärksten. Im Frühjahr bodennah zurückschneiden.",
      en: "Flavor is strongest before flowering. Cut back close to the ground in spring."
    },
    planting_month: 5,
    sowing_outdoors_month: 5,
    harvest_months: [6, 7, 8, 9],
    nutrition_level: "light",
    spacing_cm: "30x30",
    good_neighbors: ["crop_pumpkin", "crop_zucchini", "crop_cucumber"],
    bad_neighbors: ["crop_marjoram"],
    frost_hardy: true,
    origin: "Mediterranean"
  },
  {
    id: "crop_dill",
    category: "herb",
    name: { de: "Dill", en: "Dill" },
    sunlight: "full_sun",
    watering_interval_days: 3,
    pruning: { de: "Kein Rückschnitt. Blütendolden für Gurkenkonservierung nutzen.", en: "No pruning. Use flower umbels for pickling cucumbers." },
    sowing_outdoors_month: 4,
    harvest_months: [6, 7, 8],
    nutrition_level: "light",
    spacing_cm: "15x25",
    good_neighbors: ["crop_cucumber", "crop_carrot", "crop_cabbage", "crop_beetroot", "crop_onion"],
    bad_neighbors: ["crop_fennel", "crop_basil"],
    frost_hardy: false,
    origin: "Mediterranean / Southwest Asia"
  },
  {
    id: "crop_coriander",
    category: "herb",
    name: { de: "Koriander", en: "Cilantro / Coriander" },
    sunlight: "partial_shade",
    watering_interval_days: 3,
    pruning: { de: "Junge Blätter ernten. Bei Samenernte Pflanze komplett ausreifen lassen.", en: "Harvest young leaves. For seed harvest, let the plant fully mature." },
    sowing_outdoors_month: 4,
    harvest_months: [6, 7, 8, 9],
    nutrition_level: "light",
    spacing_cm: "20x20",
    good_neighbors: ["crop_cucumber", "crop_cabbage", "crop_beetroot"],
    bad_neighbors: ["crop_fennel"],
    frost_hardy: false,
    origin: "Mediterranean / Middle East"
  },
  {
    id: "crop_lemon_balm",
    category: "herb",
    name: { de: "Zitronenmelisse", en: "Lemon Balm" },
    sunlight: "partial_shade",
    watering_interval_days: 4,
    pruning: {
      de: "Kann mehrmals im Jahr stark zurückgeschnitten werden. Verhindert unkontrollierte Selbstaussaat.",
      en: "Can be cut back hard several times a year. Prevents uncontrolled self-seeding."
    },
    planting_month: 5,
    sowing_outdoors_month: 5,
    harvest_months: [5, 6, 7, 8, 9, 10],
    nutrition_level: "medium",
    spacing_cm: "35x35",
    good_neighbors: ["crop_apple_tree", "crop_pear_tree", "crop_tomato"],
    bad_neighbors: ["crop_basil"],
    frost_hardy: true,
    origin: "Eastern Mediterranean / Middle East"
  },
  {
    id: "crop_lavender",
    category: "herb",
    name: { de: "Lavendel", en: "Lavender" },
    sunlight: "full_sun",
    watering_interval_days: 8,
    pruning: {
      de: "Zweimal-Schnitt-Regel: Nach der Blüte im Sommer und kräftig im Frühjahr (nicht ins alte Holz).",
      en: "Two-cut rule: After flowering in summer and vigorously in spring (not into old wood)."
    },
    planting_month: 4,
    sowing_outdoors_month: 4,
    harvest_months: [6, 7, 8],
    nutrition_level: "light",
    spacing_cm: "35x35",
    good_neighbors: ["crop_rosemary", "crop_thyme", "crop_rose"],
    bad_neighbors: ["crop_mint"],
    frost_hardy: true,
    origin: "Mediterranean"
  },
  {
    id: "crop_lovage",
    category: "herb",
    name: { de: "Liebstöckel (Maggikraut)", en: "Lovage" },
    sunlight: "partial_shade",
    watering_interval_days: 3,
    pruning: {
      de: "Wächst sehr groß (bis 2m). Regelmäßiger Rückschnitt hält die Pflanze im Zaum.",
      en: "Grows very large (up to 2m). Regular pruning keeps the plant in check."
    },
    planting_month: 4,
    sowing_outdoors_month: 3,
    harvest_months: [4, 5, 6, 7, 8, 9, 10],
    nutrition_level: "heavy",
    spacing_cm: "60x60",
    good_neighbors: ["crop_potato"],
    bad_neighbors: ["crop_sage", "crop_fennel", "crop_basil"],
    frost_hardy: true,
    origin: "Southwest Asia / Mediterranean"
  },
  {
    id: "crop_marjoram",
    category: "herb",
    name: { de: "Majoran", en: "Marjoram" },
    sunlight: "full_sun",
    watering_interval_days: 4,
    pruning: {
      de: "Kurz vor der Blüte schneiden für intensives Aroma. Vor dem ersten Frost ernten.",
      en: "Cut just before flowering for the most intense flavor. Harvest before first frost."
    },
    sowing_indoors_month: 3,
    planting_month: 5,
    sowing_outdoors_month: 5,
    harvest_months: [6, 7, 8, 9],
    nutrition_level: "light",
    spacing_cm: "20x25",
    good_neighbors: ["crop_carrot", "crop_onion", "crop_spinach", "crop_bush_bean"],
    bad_neighbors: ["crop_oregano", "crop_thyme"],
    frost_hardy: false,
    origin: "Cyprus / Eastern Mediterranean"
  },
  {
    id: "crop_marigold",
    category: "herb",
    name: { de: "Ringelblume / Tagetes", en: "Marigold / Calendula" },
    sunlight: "full_sun",
    watering_interval_days: 4,
    pruning: {
      de: "Verblühtes entfernen verlängert die Blütezeit. Wurzeln scheiden nematodentötende Stoffe aus.",
      en: "Deadhead to prolong blooms. Roots secrete nematicidal compounds."
    },
    sowing_outdoors_month: 4,
    harvest_months: [6, 7, 8, 9, 10],
    nutrition_level: "light",
    spacing_cm: "25x25",
    good_neighbors: ["crop_tomato", "crop_potato", "crop_strawberry", "crop_raspberry", "crop_bush_bean"],
    bad_neighbors: [],
    frost_hardy: false,
    origin: "Mediterranean / Central America"
  },
  {
    id: "crop_nasturtium",
    category: "herb",
    name: { de: "Kapuzinerkresse", en: "Nasturtium" },
    sunlight: "full_sun",
    watering_interval_days: 3,
    pruning: {
      de: "Blätter und Blüten sind essbar (kresseartig). Dient als 'Opferpflanze' gegen Blattläuse.",
      en: "Leaves and flowers are edible (peppery). Acts as an aphid trap crop."
    },
    sowing_indoors_month: 4,
    planting_month: 5,
    sowing_outdoors_month: 5,
    harvest_months: [6, 7, 8, 9, 10],
    nutrition_level: "light",
    spacing_cm: "30x30",
    good_neighbors: ["crop_apple_tree", "crop_pear_tree", "crop_zucchini", "crop_pumpkin", "crop_cucumber", "crop_tomato"],
    bad_neighbors: [],
    frost_hardy: false,
    origin: "South America (Andes)"
  },
  {
    id: "crop_chamomile",
    category: "herb",
    name: { de: "Echte Kamille", en: "German Chamomile" },
    sunlight: "full_sun",
    watering_interval_days: 4,
    pruning: {
      de: "Blüten an sonnigen Vormittagen ernten. Fördert die Vitalität benachbarter Pflanzen.",
      en: "Harvest flowers on sunny mornings. Promotes vitality of neighboring crops."
    },
    sowing_outdoors_month: 4,
    harvest_months: [5, 6, 7, 8],
    nutrition_level: "light",
    spacing_cm: "20x20",
    good_neighbors: ["crop_onion", "crop_cabbage", "crop_pea", "crop_lettuce"],
    bad_neighbors: ["crop_mint"],
    frost_hardy: true,
    origin: "Southern and Eastern Europe"
  },
  {
    id: "crop_wormwood",
    category: "herb",
    name: { de: "Wermut", en: "Wormwood" },
    sunlight: "full_sun",
    watering_interval_days: 6,
    pruning: {
      de: "Im Frühjahr bodennah schneiden. Auszug vertreibt Schnecken, Erdflöhe und Rostpilze.",
      en: "Cut back hard in spring. Decoction deters slugs, flea beetles and rust."
    },
    planting_month: 4,
    sowing_outdoors_month: 4,
    harvest_months: [7, 8, 9],
    nutrition_level: "light",
    spacing_cm: "50x50",
    good_neighbors: [],
    bad_neighbors: ["crop_sage", "crop_fennel", "crop_bush_bean", "crop_pea"],
    frost_hardy: true,
    origin: "Eurasia / North Africa"
  },
  {
    id: "crop_savory",
    category: "herb",
    name: { de: "Bohnenkraut", en: "Savory" },
    sunlight: "full_sun",
    watering_interval_days: 5,
    pruning: {
      de: "Zur Blütezeit ernten für stärkstes Aroma. Schützt Bohnen vor der Schwarzen Bohnenlaus!",
      en: "Harvest during flowering. Protects beans from black bean aphids!"
    },
    sowing_indoors_month: 4,
    planting_month: 5,
    sowing_outdoors_month: 5,
    harvest_months: [6, 7, 8, 9, 10],
    nutrition_level: "light",
    spacing_cm: "25x25",
    good_neighbors: ["crop_bush_bean", "crop_pole_bean", "crop_onion", "crop_beetroot"],
    bad_neighbors: [],
    frost_hardy: true,
    origin: "Southern Europe / Mediterranean"
  },
  {
    id: "crop_borage",
    category: "herb",
    name: { de: "Borretsch (Gurkenkraut)", en: "Borage" },
    sunlight: "full_sun",
    watering_interval_days: 3,
    pruning: {
      de: "Junge Blätter und blaue Sternblüten für Salate nutzen. Erstklassige Bienenweide!",
      en: "Use tender leaves and blue flowers for salads. Outstanding bee forage!"
    },
    sowing_outdoors_month: 4,
    harvest_months: [5, 6, 7, 8, 9],
    nutrition_level: "medium",
    spacing_cm: "30x30",
    good_neighbors: ["crop_strawberry", "crop_cucumber", "crop_zucchini", "crop_tomato"],
    bad_neighbors: [],
    frost_hardy: false,
    origin: "Mediterranean / Western Asia"
  },
  {
    id: "crop_rose",
    category: "herb",
    name: { de: "Gartenrose", en: "Garden Rose" },
    sunlight: "full_sun",
    watering_interval_days: 5,
    pruning: {
      de: "Frühjahrsschnitt zur Forsythienblüte. Verblühte Blütenstände regelmäßig ausschneiden.",
      en: "Spring prune when forsythia blooms. Deadhead spent flowers regularly."
    },
    planting_month: 10,
    harvest_months: [6, 7, 8, 9, 10],
    nutrition_level: "heavy",
    spacing_cm: "50x50",
    good_neighbors: ["crop_lavender", "crop_garlic", "crop_onion"],
    bad_neighbors: [],
    frost_hardy: true,
    origin: "Asia / Europe / North America"
  },

  // ==========================================
  // 3. BEEREN (Berries)
  // ==========================================
  {
    id: "crop_strawberry",
    category: "berry",
    name: { de: "Erdbeere", en: "Strawberry" },
    sunlight: "full_sun",
    watering_interval_days: 3,
    pruning: {
      de: "Nach der Ernte Ranken entfernen (außer zur Vermehrung). Altes Laub im Vorfrühling abschneiden.",
      en: "Remove runners after harvest (unless propagating). Cut back old leaves in early spring."
    },
    planting_month: 8,
    harvest_months: [5, 6, 7],
    nutrition_level: "medium",
    spacing_cm: "30x60",
    good_neighbors: ["crop_garlic", "crop_onion", "crop_spinach", "crop_borage", "crop_marigold"],
    bad_neighbors: ["crop_cabbage", "crop_potato"],
    frost_hardy: true,
    origin: "Europe / Americas"
  },
  {
    id: "crop_raspberry",
    category: "berry",
    name: { de: "Himbeere", en: "Raspberry" },
    sunlight: "partial_shade",
    watering_interval_days: 4,
    pruning: {
      de: "Herbsthimbeeren im Spätwinter bodennah abschneiden. Sommerhimbeeren: Nur abgetragene 2-jährige Ruten entfernen.",
      en: "Cut autumn raspberries to ground in late winter. Summer raspberries: remove only fruited 2-year canes."
    },
    planting_month: 10,
    harvest_months: [6, 7, 8, 9, 10],
    nutrition_level: "medium",
    spacing_cm: "50x150",
    good_neighbors: ["crop_garlic", "crop_marigold", "crop_bush_bean"],
    bad_neighbors: ["crop_potato", "crop_blackberry"],
    frost_hardy: true,
    origin: "Europe / Northern Asia"
  },
  {
    id: "crop_blackberry",
    category: "berry",
    name: { de: "Brombeere", en: "Blackberry" },
    sunlight: "full_sun",
    watering_interval_days: 5,
    pruning: {
      de: "Trägt am zweijährigen Holz. Nach der Ernte die alten, abgetragenen Ruten bodennah entfernen.",
      en: "Fruits on second-year wood. After harvest, remove old fruited canes close to the ground."
    },
    planting_month: 10,
    harvest_months: [7, 8, 9, 10],
    nutrition_level: "medium",
    spacing_cm: "150x200",
    good_neighbors: [],
    bad_neighbors: ["crop_raspberry"],
    frost_hardy: true,
    origin: "Europe / Americas"
  },
  {
    id: "crop_blueberry",
    category: "berry",
    name: { de: "Kulturheidelbeere", en: "Blueberry" },
    sunlight: "full_sun",
    watering_interval_days: 3,
    pruning: {
      de: "Erste 3 Jahre nicht schneiden. Danach im Winter vergreiste Triebe entfernen. Zwingend saure Moorbeeterde (pH 4-5)!",
      en: "Do not prune first 3 years. Then thin old branches in winter. Mandatory acidic ericaceous soil (pH 4-5)!"
    },
    planting_month: 4,
    harvest_months: [7, 8, 9],
    nutrition_level: "light",
    spacing_cm: "100x150",
    good_neighbors: ["crop_strawberry"],
    bad_neighbors: ["crop_apple_tree", "crop_tomato"],
    frost_hardy: true,
    origin: "North America"
  },
  {
    id: "crop_gooseberry",
    category: "berry",
    name: { de: "Stachelbeere", en: "Gooseberry" },
    sunlight: "partial_shade",
    watering_interval_days: 5,
    pruning: {
      de: "Mitte des Strauchs freischneiden, damit Licht und Luft herankommen (beugt Mehltau vor).",
      en: "Thin out center of bush to allow light and air in (prevents powdery mildew)."
    },
    planting_month: 10,
    harvest_months: [6, 7, 8],
    nutrition_level: "medium",
    spacing_cm: "100x150",
    good_neighbors: ["crop_strawberry", "crop_redcurrant"],
    bad_neighbors: [],
    frost_hardy: true,
    origin: "Europe / Western Asia"
  },
  {
    id: "crop_redcurrant",
    category: "berry",
    name: { de: "Johannisbeere (Rot/Schwarz)", en: "Redcurrant / Blackcurrant" },
    sunlight: "full_sun",
    watering_interval_days: 5,
    pruning: {
      de: "Altes dunkles Holz bodentief abschneiden, 8-12 starke junge Haupttriebe stehen lassen.",
      en: "Cut old dark wood to the ground, keep 8-12 strong vigorous young shoots."
    },
    planting_month: 10,
    harvest_months: [6, 7],
    nutrition_level: "medium",
    spacing_cm: "150x150",
    good_neighbors: ["crop_gooseberry"],
    bad_neighbors: [],
    frost_hardy: true,
    origin: "Europe / Northern Asia"
  },
  {
    id: "crop_jostaberry",
    category: "berry",
    name: { de: "Jostabeere", en: "Jostaberry" },
    sunlight: "full_sun",
    watering_interval_days: 5,
    pruning: {
      de: "Dornenlose Kreuzung aus Johannis- und Stachelbeere. Älteste Triebe nach 3-4 Jahren bodennah verjüngen.",
      en: "Thornless hybrid of gooseberry & blackcurrant. Rejuvenate oldest canes every 3-4 years."
    },
    planting_month: 10,
    harvest_months: [7, 8],
    nutrition_level: "medium",
    spacing_cm: "150x150",
    good_neighbors: ["crop_strawberry"],
    bad_neighbors: [],
    frost_hardy: true,
    origin: "Germany (Hybrid)"
  },

  // ==========================================
  // 4. OBST (Fruits)
  // ==========================================
  {
    id: "crop_apple_tree",
    category: "fruit",
    name: { de: "Apfelbaum", en: "Apple Tree" },
    sunlight: "full_sun",
    watering_interval_days: 14,
    pruning: {
      de: "Winterschnitt (Jan-März): Nach innen wachsende Zweige und steile Wasserschosse entfernen. Krone auslichten.",
      en: "Winter prune (Jan-Mar): Remove inward-growing branches and water sprouts. Thin canopy."
    },
    planting_month: 10,
    harvest_months: [8, 9, 10],
    nutrition_level: "medium",
    spacing_cm: "300x300",
    good_neighbors: ["crop_nasturtium", "crop_chives", "crop_lemon_balm"],
    bad_neighbors: ["crop_potato"],
    frost_hardy: true,
    origin: "Central Asia (Kazakhstan)"
  },
  {
    id: "crop_pear_tree",
    category: "fruit",
    name: { de: "Birnbaum", en: "Pear Tree" },
    sunlight: "full_sun",
    watering_interval_days: 14,
    pruning: {
      de: "Winterschnitt (Jan-März): Steile Wasserschosse und Konkurrenztriebe entfernen.",
      en: "Winter prune (Jan-Mar): Remove steep water sprouts and competing branches."
    },
    planting_month: 10,
    harvest_months: [8, 9, 10],
    nutrition_level: "medium",
    spacing_cm: "300x300",
    good_neighbors: ["crop_chives", "crop_nasturtium", "crop_lemon_balm"],
    bad_neighbors: ["crop_potato"],
    frost_hardy: true,
    origin: "Europe / Western Asia"
  },
  {
    id: "crop_cherry_tree",
    category: "fruit",
    name: { de: "Kirschbaum", en: "Cherry Tree" },
    sunlight: "full_sun",
    watering_interval_days: 14,
    pruning: {
      de: "Süßkirschen IMMER direkt nach der Ernte im Sommer schneiden. Winterschnitt führt zu Krankheiten (Gummifluss).",
      en: "ALWAYS prune sweet cherries directly after summer harvest. Winter pruning causes gummosis."
    },
    planting_month: 10,
    harvest_months: [6, 7],
    nutrition_level: "medium",
    spacing_cm: "400x400",
    good_neighbors: ["crop_strawberry"],
    bad_neighbors: ["crop_apple_tree"],
    frost_hardy: true,
    origin: "Eurasia / Black Sea"
  },
  {
    id: "crop_plum_tree",
    category: "fruit",
    name: { de: "Pflaumenbaum / Zwetschge", en: "Plum Tree" },
    sunlight: "full_sun",
    watering_interval_days: 12,
    pruning: {
      de: "Spätwinter oder direkt nach der Ernte auslichten. Steil nach oben wachsende Äste ableiten.",
      en: "Thin out in late winter or right after harvest. Redirect steep upright branches."
    },
    planting_month: 10,
    harvest_months: [8, 9],
    nutrition_level: "heavy",
    spacing_cm: "300x300",
    good_neighbors: [],
    bad_neighbors: [],
    frost_hardy: true,
    origin: "Near East / Caucasus"
  },
  {
    id: "crop_peach_tree",
    category: "fruit",
    name: { de: "Pfirsichbaum", en: "Peach Tree" },
    sunlight: "full_sun",
    watering_interval_days: 10,
    pruning: {
      de: "Trägt am einjährigen Holz. Jedes Frühjahr Fruchtholz verjüngen. Frühe März-Blüte vor Spätfrost schützen!",
      en: "Fruits on one-year-old wood. Rejuvenate fruiting shoots each spring. Protect early blooms from frost!"
    },
    planting_month: 4,
    harvest_months: [7, 8],
    nutrition_level: "heavy",
    spacing_cm: "300x300",
    good_neighbors: ["crop_garlic", "crop_onion"],
    bad_neighbors: ["crop_potato"],
    frost_hardy: true,
    origin: "China"
  },
  {
    id: "crop_fig_tree",
    category: "fruit",
    name: { de: "Feigenbaum", en: "Fig Tree" },
    sunlight: "full_sun",
    watering_interval_days: 7,
    pruning: {
      de: "Im zeitigen Frühjahr erfrorene Zweige entfernen. Verträgt Formschnitt gut. Geschützter warmer Standort!",
      en: "Remove frostbitten branches in early spring. Takes well to shaping. Plant in a warm, sheltered spot!"
    },
    planting_month: 5,
    harvest_months: [8, 9, 10],
    nutrition_level: "medium",
    spacing_cm: "200x200",
    good_neighbors: [],
    bad_neighbors: [],
    frost_hardy: true,
    origin: "Mediterranean / Middle East"
  },
  {
    id: "crop_lemon",
    category: "fruit",
    name: { de: "Zitronenbaum", en: "Lemon Tree" },
    sunlight: "full_sun",
    watering_interval_days: 5,
    pruning: {
      de: "Im zeitigen Frühjahr Formschnitt. Wasserschosse entfernen. Kübelpflanze hell und kühl bei 5-10°C überwintern.",
      en: "Prune for shape in early spring. Overwinter indoors in a bright, cool spot at 5-10°C."
    },
    planting_month: 4,
    harvest_months: [10, 11, 12, 1, 2, 3],
    nutrition_level: "medium",
    spacing_cm: "150x150",
    good_neighbors: ["crop_rosemary", "crop_thyme", "crop_lavender"],
    bad_neighbors: [],
    frost_hardy: false,
    origin: "South Asia (North East India / China)"
  },
  {
    id: "crop_grape",
    category: "fruit",
    name: { de: "Weintraube / Weinrebe", en: "Grape Vine" },
    sunlight: "full_sun",
    watering_interval_days: 10,
    pruning: {
      de: "Winterschnitt (Februar) auf 1-2 Augen. Sommerschnitt: Geiztriebe und Blätter vor den Trauben ausdünnen.",
      en: "Winter prune to 1-2 buds in Feb. Summer prune: thin leaves around bunches for optimal sun."
    },
    planting_month: 4,
    harvest_months: [8, 9, 10],
    nutrition_level: "medium",
    spacing_cm: "150x200",
    good_neighbors: ["crop_rose", "crop_chives"],
    bad_neighbors: [],
    frost_hardy: true,
    origin: "Near East / Caucasus"
  },
  {
    id: "crop_apricot_tree",
    category: "fruit",
    name: { de: "Aprikosenbaum / Marille", en: "Apricot Tree" },
    sunlight: "full_sun",
    watering_interval_days: 10,
    pruning: {
      de: "Schnitt direkt nach der Ernte im Spätsommer (beugt Gummifluss vor). Warmer, windgeschützter Standort!",
      en: "Prune right after harvest in late summer (prevents gummosis). Requires warm, sheltered location!"
    },
    planting_month: 10,
    harvest_months: [7, 8],
    nutrition_level: "heavy",
    spacing_cm: "350x350",
    good_neighbors: ["crop_garlic", "crop_onion"],
    bad_neighbors: ["crop_potato"],
    frost_hardy: true,
    origin: "Central Asia / China"
  },

  // ==========================================
  // 5. EASTER EGGS (Secret Gamification)
  // ==========================================
  {
    id: "crop_easteregg_piranha",
    category: "fruit",
    name: { de: "Piranha-Pflanze", en: "Piranha Plant" },
    sunlight: "full_sun",
    watering_interval_days: 1,
    pruning: {
      de: "Vorsicht bissig! Keine grünen Röhren in der Nähe platzieren.",
      en: "Beware, it bites! Keep away from green pipes."
    },
    sowing_outdoors_month: 6,
    harvest_months: [6, 7, 8],
    nutrition_level: "heavy",
    spacing_cm: "100x100",
    good_neighbors: [],
    bad_neighbors: [],
    frost_hardy: false
  },
  {
    id: "crop_easteregg_bohni",
    category: "fruit",
    name: { de: "Bohni", en: "Bohni" },
    sunlight: "partial_shade",
    watering_interval_days: 14,
    pruning: {
      de: "Sieht so aus, als wolltest du Kaffee kochen. Soll ich dir dabei helfen? (Tipp: Einmal im Jahr zurückschneiden).",
      en: "It looks like you're trying to brew coffee. Would you like some help with that? (Tip: Prune once a year)."
    },
    sowing_outdoors_month: 6,
    harvest_months: [10, 11],
    nutrition_level: "heavy",
    spacing_cm: "200x200",
    good_neighbors: [],
    bad_neighbors: [],
    frost_hardy: false
  },
  {
    id: "crop_easteregg_mattr",
    category: "herb",
    name: { de: "mattr", en: "mattr" },
    sunlight: "full_sun",
    watering_interval_days: 2,
    pruning: {
      de: "Sieht so aus, als wolltest du Kaffee kochen. Soll ich dir dabei helfen? (Tipp: Einmal im Jahr zurückschneiden).",
      en: "It looks like you're trying to brew coffee. Would you like some help with that? (Tip: Prune once a year)."
    },
    sowing_outdoors_month: 5,
    harvest_months: [5],
    nutrition_level: "heavy",
    spacing_cm: "80x80",
    good_neighbors: [],
    bad_neighbors: [],
    frost_hardy: false
  },
  {
    id: "crop_easteregg_hugo",
    category: "vegetable",
    name: { de: "HugoBugo", en: "HugoBugo" },
    sunlight: "partial_shade",
    watering_interval_days: 1,
    pruning: {
      de: "Sieht so aus, als wolltest du Kaffee kochen. Soll ich dir dabei helfen? (Tipp: Einmal im Jahr zurückschneiden).",
      en: "It looks like you're trying to brew coffee. Would you like some help with that? (Tip: Prune once a year)."
    },
    sowing_outdoors_month: 6,
    harvest_months: [6],
    nutrition_level: "heavy",
    spacing_cm: "200x200",
    good_neighbors: [],
    bad_neighbors: [],
    frost_hardy: true
  },
  {
    id: "crop_easteregg_dispo",
    category: "fruit",
    name: { de: "DispoZwegat", en: "DispoZwegat" },
    sunlight: "shade",
    watering_interval_days: 4,
    pruning: {
      de: "Sieht so aus, als wolltest du Kaffee kochen. Soll ich dir dabei helfen? (Tipp: Einmal im Jahr zurückschneiden).",
      en: "It looks like you're trying to brew coffee. Would you like some help with that? (Tip: Prune once a year)."
    },
    sowing_outdoors_month: 10,
    harvest_months: [10],
    nutrition_level: "medium",
    spacing_cm: "50x50",
    good_neighbors: [],
    bad_neighbors: [],
    frost_hardy: false
  },
  {
    id: "crop_easteregg_sm4sh",
    category: "fruit",
    name: { de: "sm4sh", en: "sm4sh" },
    sunlight: "full_sun",
    watering_interval_days: 3,
    pruning: {
      de: "Sieht so aus, als wolltest du Kaffee kochen. Soll ich dir dabei helfen? (Tipp: Einmal im Jahr zurückschneiden).",
      en: "It looks like you're trying to brew coffee. Would you like some help with that? (Tip: Prune once a year)."
    },
    sowing_outdoors_month: 1,
    harvest_months: [1],
    nutrition_level: "medium",
    spacing_cm: "100x100",
    good_neighbors: [],
    bad_neighbors: [],
    frost_hardy: false
  },
  {
    id: "crop_easteregg_Lino",
    category: "vegetable",
    name: { de: "LinoZeros", en: "LinoZeros" },
    sunlight: "shade",
    watering_interval_days: 3,
    pruning: {
      de: "Sieht so aus, als wolltest du Kaffee kochen. Soll ich dir dabei helfen? (Tipp: Einmal im Jahr zurückschneiden).",
      en: "It looks like you're trying to brew coffee. Would you like some help with that? (Tip: Prune once a year)."
    },
    sowing_outdoors_month: 5,
    harvest_months: [5],
    nutrition_level: "heavy",
    spacing_cm: "100x100",
    good_neighbors: [],
    bad_neighbors: [],
    frost_hardy: true
  },
  {
    id: "crop_easteregg_Coertez",
    category: "berry",
    name: { de: "Coertez", en: "Coertez" },
    sunlight: "full_sun",
    watering_interval_days: 2,
    pruning: {
      de: "Sieht so aus, als wolltest du Kaffee kochen. Soll ich dir dabei helfen? (Tipp: Einmal im Jahr zurückschneiden).",
      en: "It looks like you're trying to brew coffee. Would you like some help with that? (Tip: Prune once a year)."
    },
    sowing_outdoors_month: 1,
    harvest_months: [1],
    nutrition_level: "heavy",
    spacing_cm: "160x160",
    good_neighbors: [],
    bad_neighbors: [],
    frost_hardy: true
  },
];
