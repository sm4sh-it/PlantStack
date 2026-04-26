// ==========================================
// INHALTSVERZEICHNIS - PlantStack Crops DB
// ==========================================
// 1. Gemüse (Vegetables)
// 2. Kräuter (Herbs)
// 3. Beeren (Berries)
// 4. Obst (Fruits)
//
// HINWEISE ZUR DATENSTRUKTUR:
// - Monate: 1 = Jan, 2 = Feb, ..., 12 = Dez
// - nutrition_level: "heavy" (Starkzehrer), "medium" (Mittel), "light" (Schwach)
// - sunlight: "full_sun", "partial_shade", "shade"
// ==========================================

export interface Crop {
  id: string;
  category: string;
  name: { de: string; en: string };
  sunlight: "full_sun" | "partial_shade" | "shade";
  watering_interval_days: number;
  pruning: { de: string; en: string };
  sowing_outdoors_month: number;
  harvest_months: number[];
  nutrition_level: "heavy" | "medium" | "light";
  spacing_cm: string;
  good_neighbors: string[];
  bad_neighbors: string[];
  frost_hardy: boolean;
}

export const cropsData: Crop[] = [
  // ==========================================
  // 1. GEMÜSE (Vegetables)
  // ==========================================
  {
    id: "crop_tomato",
    category: "vegetable",
    name: {
      de: "Tomate",
      en: "Tomato"
    },
    sunlight: "full_sun",
    watering_interval_days: 2,
    pruning: {
      de: "Ausgeizen: Seitentriebe in den Blattachseln regelmäßig entfernen.",
      en: "Pruning: Pinch off suckers growing in the leaf axils regularly."
    },
    sowing_outdoors_month: 5, // Ab Mai (Eisheilige)
    harvest_months: [7, 8, 9, 10],
    nutrition_level: "heavy",
    spacing_cm: "60x60",
    good_neighbors: ["crop_basil", "crop_garlic", "crop_marigold"],
    bad_neighbors: ["crop_potato", "crop_cucumber", "crop_pea"],
    frost_hardy: false
  },
  {
    id: "crop_carrot",
    category: "vegetable",
    name: {
      de: "Karotte / Möhre",
      en: "Carrot"
    },
    sunlight: "full_sun",
    watering_interval_days: 4,
    pruning: {
      de: "Kein Rückschnitt nötig. Zu dicht stehende Keimlinge vereinzeln.",
      en: "No pruning required. Thin out seedlings if they grow too close."
    },
    sowing_outdoors_month: 3, // Ab März
    harvest_months: [6, 7, 8, 9, 10],
    nutrition_level: "medium",
    spacing_cm: "5x30", // 5cm in der Reihe, 30cm Abstand
    good_neighbors: ["crop_onion", "crop_leek", "crop_pea"], // Zwiebeln schützen vor Möhrenfliege!
    bad_neighbors: ["crop_parsnip", "crop_celery"],
    frost_hardy: true // Verträgt leichten Frost
  },
{
    id: "crop_cucumber",
    category: "vegetable",
    name: { de: "Gurke", en: "Cucumber" },
    sunlight: "full_sun",
    watering_interval_days: 1, // Braucht sehr viel Wasser, besonders bei Fruchtbildung
    pruning: {
      de: "Seitentriebe nach dem ersten Fruchtansatz einkürzen. Rankhilfe empfohlen.",
      en: "Shorten side shoots after the first fruit set. Trellis recommended."
    },
    sowing_outdoors_month: 5,
    harvest_months: [7, 8, 9],
    nutrition_level: "heavy",
    spacing_cm: "40x100",
    good_neighbors: ["crop_onion", "crop_dill", "crop_fennel", "crop_pea"],
    bad_neighbors: ["crop_tomato", "crop_potato", "crop_radish"],
    frost_hardy: false
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
    sowing_outdoors_month: 5,
    harvest_months: [6, 7, 8, 9, 10],
    nutrition_level: "heavy",
    spacing_cm: "100x100", // Braucht extrem viel Platz
    good_neighbors: ["crop_onion", "crop_bean", "crop_corn", "crop_nasturtium"],
    bad_neighbors: ["crop_cucumber", "crop_pumpkin"],
    frost_hardy: false
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
    sowing_outdoors_month: 4,
    harvest_months: [7, 8, 9, 10],
    nutrition_level: "heavy",
    spacing_cm: "35x70",
    good_neighbors: ["crop_bean", "crop_corn", "crop_marigold", "crop_spinach"],
    bad_neighbors: ["crop_tomato", "crop_onion", "crop_cucumber", "crop_apple_tree"],
    frost_hardy: false // Frost schädigt das Kraut massiv
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
    sowing_outdoors_month: 5,
    harvest_months: [7, 8, 9, 10],
    nutrition_level: "heavy",
    spacing_cm: "40x50",
    good_neighbors: ["crop_tomato", "crop_basil", "crop_onion"],
    bad_neighbors: ["crop_fennel", "crop_pea"],
    frost_hardy: false
  },
  {
    id: "crop_onion",
    category: "vegetable",
    name: { de: "Zwiebel", en: "Onion" },
    sunlight: "full_sun",
    watering_interval_days: 5,
    pruning: {
      de: "Kein Rückschnitt. Laub nach dem Umknicken im Spätsommer trocknen lassen.",
      en: "No pruning. Let foliage dry after it falls over in late summer."
    },
    sowing_outdoors_month: 3,
    harvest_months: [7, 8, 9],
    nutrition_level: "light",
    spacing_cm: "10x25",
    good_neighbors: ["crop_carrot", "crop_strawberry", "crop_lettuce"],
    bad_neighbors: ["crop_bean", "crop_pea", "crop_cabbage"],
    frost_hardy: true
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
    sowing_outdoors_month: 10, // Wird idealerweise im Herbst gesteckt
    harvest_months: [7, 8],
    nutrition_level: "medium",
    spacing_cm: "15x25",
    good_neighbors: ["crop_strawberry", "crop_tomato", "crop_raspberry"],
    bad_neighbors: ["crop_bean", "crop_pea"],
    frost_hardy: true
  },
  {
    id: "crop_radish",
    category: "vegetable",
    name: { de: "Radieschen", en: "Radish" },
    sunlight: "partial_shade", // Mag keine extreme Hitze im Sommer
    watering_interval_days: 2, // Gleichmäßige Feuchtigkeit verhindert Pelzigwerden
    pruning: { de: "Keiner nötig.", en: "None required." },
    sowing_outdoors_month: 3,
    harvest_months: [4, 5, 6, 9, 10],
    nutrition_level: "light",
    spacing_cm: "5x15",
    good_neighbors: ["crop_bean", "crop_carrot", "crop_lettuce", "crop_pea"],
    bad_neighbors: ["crop_cucumber"],
    frost_hardy: true
  },
  {
    id: "crop_spinach",
    category: "vegetable",
    name: { de: "Spinat", en: "Spinach" },
    sunlight: "partial_shade",
    watering_interval_days: 3,
    pruning: { de: "Einzelne Blätter von außen nach innen ernten.", en: "Harvest individual leaves from outside in." },
    sowing_outdoors_month: 3,
    harvest_months: [4, 5, 9, 10, 11],
    nutrition_level: "medium",
    spacing_cm: "10x25",
    good_neighbors: ["crop_strawberry", "crop_potato", "crop_tomato", "crop_radish"],
    bad_neighbors: ["crop_chard", "crop_beetroot"],
    frost_hardy: true
  },
  {
    id: "crop_pea",
    category: "vegetable",
    name: { de: "Erbse", en: "Pea" },
    sunlight: "full_sun",
    watering_interval_days: 4,
    pruning: { de: "Rankhilfe ab 10cm Höhe zwingend erforderlich.", en: "Trellis mandatory from 10cm height." },
    sowing_outdoors_month: 3,
    harvest_months: [6, 7, 8],
    nutrition_level: "light", // Stickstoffsammler (gut für den Boden!)
    spacing_cm: "5x40",
    good_neighbors: ["crop_carrot", "crop_lettuce", "crop_radish", "crop_corn"],
    bad_neighbors: ["crop_onion", "crop_garlic", "crop_leek"],
    frost_hardy: true
  },
  {
    id: "crop_lettuce",
    category: "vegetable",
    name: { de: "Kopfsalat / Pflücksalat", en: "Lettuce" },
    sunlight: "partial_shade",
    watering_interval_days: 2,
    pruning: { de: "Bei Pflücksalat nur äußere Blätter ernten, Herz stehen lassen.", en: "For leaf lettuce, harvest outer leaves only, leave the heart." },
    sowing_outdoors_month: 4,
    harvest_months: [5, 6, 7, 8, 9],
    nutrition_level: "medium",
    spacing_cm: "25x30",
    good_neighbors: ["crop_carrot", "crop_radish", "crop_strawberry", "crop_onion"],
    bad_neighbors: ["crop_parsley", "crop_celery"],
    frost_hardy: true
  },
  {
    id: "crop_kohlrabi",
    category: "vegetable",
    name: { de: "Kohlrabi", en: "Kohlrabi" },
    sunlight: "full_sun",
    watering_interval_days: 3,
    pruning: { de: "Keiner nötig. Nicht zu spät ernten, sonst verholzt die Knolle.", en: "None required. Don't harvest too late, or the bulb becomes woody." },
    sowing_outdoors_month: 4,
    harvest_months: [6, 7, 8, 9, 10],
    nutrition_level: "medium",
    spacing_cm: "25x30",
    good_neighbors: ["crop_bean", "crop_pea", "crop_lettuce", "crop_spinach"],
    bad_neighbors: ["crop_strawberry", "crop_garlic"],
    frost_hardy: true
  },
  {
    id: "crop_beetroot",
    category: "vegetable",
    name: { de: "Rote Bete", en: "Beetroot" },
    sunlight: "full_sun",
    watering_interval_days: 4,
    pruning: { de: "Junge Blätter können als Salat geerntet werden (nicht zu viele).", en: "Young leaves can be harvested for salad (don't take too many)." },
    sowing_outdoors_month: 4,
    harvest_months: [8, 9, 10, 11],
    nutrition_level: "medium",
    spacing_cm: "10x30",
    good_neighbors: ["crop_onion", "crop_bean", "crop_lettuce", "crop_dill"],
    bad_neighbors: ["crop_chard", "crop_spinach"],
    frost_hardy: true
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
    good_neighbors: ["crop_strawberry", "crop_corn", "crop_beetroot", "crop_savoy_cabbage"],
    bad_neighbors: ["crop_onion", "crop_garlic", "crop_leek"],
    frost_hardy: false
  },
  {
    id: "crop_pumpkin",
    category: "vegetable",
    name: { de: "Kürbis (z.B. Hokkaido)", en: "Pumpkin / Squash" },
    sunlight: "full_sun",
    watering_interval_days: 2,
    pruning: { de: "Haupttrieb nach 2-3 Früchten kappen, um Fruchtgröße zu fördern.", en: "Pinch off main shoot after 2-3 fruits to encourage fruit size." },
    sowing_outdoors_month: 5,
    harvest_months: [9, 10],
    nutrition_level: "heavy",
    spacing_cm: "150x150",
    good_neighbors: ["crop_corn", "crop_bean", "crop_onion"],
    bad_neighbors: ["crop_cucumber", "crop_zucchini"],
    frost_hardy: false
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
    good_neighbors: ["crop_carrot", "crop_onion", "crop_cabbage", "crop_radish"],
    bad_neighbors: ["crop_spinach", "crop_beetroot"],
    frost_hardy: true
  },

  // ==========================================
  // 2. KRÄUTER (Herbs)
  // ==========================================
  {
    id: "crop_basil",
    category: "herb",
    name: {
      de: "Basilikum",
      en: "Basil"
    },
    sunlight: "full_sun",
    watering_interval_days: 2,
    pruning: {
      de: "Triebspitzen regelmäßig kappen (über einem Blattpaar), um buschiges Wachstum zu fördern. Blüten entfernen.",
      en: "Pinch off top shoots above a leaf node to encourage bushy growth. Remove flowers."
    },
    sowing_outdoors_month: 5,
    harvest_months: [6, 7, 8, 9],
    nutrition_level: "light",
    spacing_cm: "25x25",
    good_neighbors: ["crop_tomato", "crop_cucumber"],
    bad_neighbors: ["crop_lemon_balm", "crop_mint"],
    frost_hardy: false // Sehr kälteempfindlich
  },
  {
    id: "crop_rosemary",
    category: "herb",
    name: {
      de: "Rosmarin",
      en: "Rosemary"
    },
    sunlight: "full_sun",
    watering_interval_days: 7, // Braucht sehr wenig Wasser
    pruning: {
      de: "Im Frühjahr leicht in Form schneiden. Nicht ins alte (braune) Holz schneiden.",
      en: "Prune lightly in spring to shape. Do not cut into the old (brown) wood."
    },
    sowing_outdoors_month: 5,
    harvest_months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // Ganzjährig
    nutrition_level: "light",
    spacing_cm: "50x50",
    good_neighbors: ["crop_sage", "crop_thyme", "crop_carrot"],
    bad_neighbors: ["crop_basil", "crop_mint"],
    frost_hardy: true // Meist winterhart bis zu gewissen Graden
  },
{
    id: "crop_thyme",
    category: "herb",
    name: { de: "Thymian", en: "Thyme" },
    sunlight: "full_sun",
    watering_interval_days: 7, // Liebt Trockenheit
    pruning: {
      de: "Im Frühjahr stark zurückschneiden, um Verholzung vorzubeugen. Nicht bis ins ganz alte Holz.",
      en: "Prune back hard in spring to prevent woodiness. Avoid cutting into very old wood."
    },
    sowing_outdoors_month: 4,
    harvest_months: [4, 5, 6, 7, 8, 9, 10],
    nutrition_level: "light",
    spacing_cm: "25x25",
    good_neighbors: ["crop_rosemary", "crop_sage", "crop_strawberry"],
    bad_neighbors: ["crop_marjoram"],
    frost_hardy: true
  },
  {
    id: "crop_mint",
    category: "herb",
    name: { de: "Minze (z.B. Pfefferminze)", en: "Mint" },
    sunlight: "partial_shade",
    watering_interval_days: 2, // Mag es feuchter als mediterrane Kräuter
    pruning: {
      de: "Regelmäßig mutig zurückschneiden. Achtung: Breitet sich durch Ausläufer sehr stark aus!",
      en: "Prune back boldly and regularly. Note: Spreads aggressively via runners!"
    },
    sowing_outdoors_month: 3,
    harvest_months: [5, 6, 7, 8, 9, 10],
    nutrition_level: "medium",
    spacing_cm: "40x40",
    good_neighbors: ["crop_tomato", "crop_cabbage"],
    bad_neighbors: ["crop_basil", "crop_chamomile"],
    frost_hardy: true
  },
  {
    id: "crop_parsley",
    category: "herb",
    name: { de: "Petersilie", en: "Parsley" },
    sunlight: "partial_shade",
    watering_interval_days: 3,
    pruning: {
      de: "Immer die äußeren Stiele ernten, das Herz stehen lassen. Im zweiten Jahr blüht sie und ist dann ungenießbar.",
      en: "Always harvest outer stalks, leave the heart. In the second year it flowers and becomes inedible."
    },
    sowing_outdoors_month: 3,
    harvest_months: [5, 6, 7, 8, 9, 10, 11],
    nutrition_level: "medium",
    spacing_cm: "20x20",
    good_neighbors: ["crop_tomato", "crop_radish", "crop_onion"],
    bad_neighbors: ["crop_lettuce", "crop_fennel"],
    frost_hardy: true
  },
  {
    id: "crop_chives",
    category: "herb",
    name: { de: "Schnittlauch", en: "Chives" },
    sunlight: "partial_shade",
    watering_interval_days: 3,
    pruning: {
      de: "Regelmäßig handbreit über dem Boden abschneiden. Blüten sind essbar, schwächen aber das Blattwachstum.",
      en: "Cut back regularly a few inches above the ground. Flowers are edible but slow leaf growth."
    },
    sowing_outdoors_month: 3,
    harvest_months: [3, 4, 5, 6, 7, 8, 9, 10, 11],
    nutrition_level: "medium",
    spacing_cm: "20x20",
    good_neighbors: ["crop_apple_tree", "crop_strawberry", "crop_carrot", "crop_tomato"],
    bad_neighbors: ["crop_bean", "crop_pea"],
    frost_hardy: true
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
    sowing_outdoors_month: 4,
    harvest_months: [5, 6, 7, 8, 9, 10],
    nutrition_level: "light",
    spacing_cm: "40x40",
    good_neighbors: ["crop_rosemary", "crop_thyme", "crop_cabbage", "crop_carrot"],
    bad_neighbors: ["crop_basil", "crop_wormwood"],
    frost_hardy: true
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
    sowing_outdoors_month: 5,
    harvest_months: [6, 7, 8, 9],
    nutrition_level: "light",
    spacing_cm: "30x30",
    good_neighbors: ["crop_pumpkin", "crop_zucchini", "crop_cucumber"],
    bad_neighbors: ["crop_marjoram"],
    frost_hardy: true
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
    nutrition_level: "medium",
    spacing_cm: "15x25",
    good_neighbors: ["crop_cucumber", "crop_carrot", "crop_cabbage", "crop_beetroot"],
    bad_neighbors: ["crop_fennel", "crop_basil"],
    frost_hardy: false
  },
  {
    id: "crop_coriander",
    category: "herb",
    name: { de: "Koriander", en: "Cilantro / Coriander" },
    sunlight: "partial_shade", // Schießt in praller Sonne zu schnell in die Blüte
    watering_interval_days: 3,
    pruning: { de: "Junge Blätter ernten. Bei Samenernte Pflanze komplett ausreifen lassen.", en: "Harvest young leaves. For seed harvest, let the plant fully mature." },
    sowing_outdoors_month: 4,
    harvest_months: [6, 7, 8, 9],
    nutrition_level: "medium",
    spacing_cm: "20x20",
    good_neighbors: ["crop_cucumber", "crop_cabbage", "crop_beetroot"],
    bad_neighbors: ["crop_fennel"],
    frost_hardy: true
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
    sowing_outdoors_month: 5,
    harvest_months: [5, 6, 7, 8, 9, 10],
    nutrition_level: "medium",
    spacing_cm: "35x35",
    good_neighbors: ["crop_apple_tree", "crop_pear_tree", "crop_tomato"],
    bad_neighbors: ["crop_basil"],
    frost_hardy: true
  },
  {
    id: "crop_lavender",
    category: "herb",
    name: { de: "Lavendel", en: "Lavender" },
    sunlight: "full_sun",
    watering_interval_days: 8, // Extrem trockenheitsverträglich
    pruning: {
      de: "Zweimal-Schnitt-Regel: Nach der Blüte im Sommer und kräftig im Frühjahr (nicht ins alte Holz).",
      en: "Two-cut rule: After flowering in summer and vigorously in spring (not into old wood)."
    },
    sowing_outdoors_month: 4,
    harvest_months: [6, 7, 8],
    nutrition_level: "light",
    spacing_cm: "35x35",
    good_neighbors: ["crop_rosemary", "crop_thyme", "crop_rose"], // Rosen & Lavendel sind ein Klassiker (trotz unterschiedlicher Bodenansprüche)
    bad_neighbors: ["crop_mint"],
    frost_hardy: true
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
    sowing_outdoors_month: 3,
    harvest_months: [4, 5, 6, 7, 8, 9, 10],
    nutrition_level: "heavy", // Ein seltenes Beispiel für ein Kräuter-Starkzehrer
    spacing_cm: "60x60",
    good_neighbors: ["crop_potato"], // Verträgt sich mit fast niemandem, außer Kartoffeln
    bad_neighbors: ["crop_sage", "crop_fennel", "crop_basil"],
    frost_hardy: true
  },

  // ==========================================
  // 3. BEEREN (Berries)
  // ==========================================
  {
    id: "crop_strawberry",
    category: "berry",
    name: {
      de: "Erdbeere",
      en: "Strawberry"
    },
    sunlight: "full_sun",
    watering_interval_days: 3,
    pruning: {
      de: "Nach der Ernte Ranken entfernen (außer man will sie vermehren). Altes Laub im Frühjahr abschneiden.",
      en: "Remove runners after harvest (unless propagating). Cut back old leaves in spring."
    },
    sowing_outdoors_month: 8, // Werden oft im Spätsommer gepflanzt
    harvest_months: [5, 6, 7],
    nutrition_level: "medium",
    spacing_cm: "30x60",
    good_neighbors: ["crop_garlic", "crop_onion", "crop_spinach"],
    bad_neighbors: ["crop_cabbage", "crop_potato"],
    frost_hardy: true
  },
{
    id: "crop_raspberry",
    category: "berry",
    name: { de: "Himbeere", en: "Raspberry" },
    sunlight: "partial_shade",
    watering_interval_days: 4,
    pruning: {
      de: "Herbsthimbeeren im Spätwinter bodennah abschneiden. Sommerhimbeeren: Nur abgetragene Ruten entfernen.",
      en: "Cut autumn raspberries to the ground in late winter. Summer raspberries: remove only fruited canes."
    },
    sowing_outdoors_month: 10, // Pflanzung idealerweise im Herbst
    harvest_months: [6, 7, 8, 9, 10], // Je nach Sorte
    nutrition_level: "medium",
    spacing_cm: "50x150",
    good_neighbors: ["crop_garlic", "crop_marigold", "crop_bush_bean"],
    bad_neighbors: ["crop_potato", "crop_blackberry"], // Konkurrieren zu stark mit Brombeeren
    frost_hardy: true
  },
  {
    id: "crop_blackberry",
    category: "berry",
    name: { de: "Brombeere", en: "Blackberry" },
    sunlight: "full_sun",
    watering_interval_days: 5,
    pruning: {
      de: "Trägt am zweijährigen Holz. Nach der Ernte die alten, abgetragenen Ruten bodennah entfernen.",
      en: "Fruits on second-year wood. After harvest, remove the old, fruited canes close to the ground."
    },
    sowing_outdoors_month: 10,
    harvest_months: [7, 8, 9, 10],
    nutrition_level: "medium",
    spacing_cm: "150x200", // Brauchen extrem viel Platz und ein Spalier
    good_neighbors: [], // Wachsen am besten für sich allein
    bad_neighbors: ["crop_raspberry"],
    frost_hardy: true
  },
  {
    id: "crop_blueberry",
    category: "berry",
    name: { de: "Kulturheidelbeere", en: "Blueberry" },
    sunlight: "full_sun",
    watering_interval_days: 3, // Flachwurzler, trocknen schnell aus
    pruning: {
      de: "Die ersten 3 Jahre gar nicht. Danach im Winter alte (graue) Äste entfernen, um junge Triebe zu fördern.",
      en: "No pruning for the first 3 years. Then remove old (gray) branches in winter to encourage new shoots."
    },
    sowing_outdoors_month: 4,
    harvest_months: [7, 8, 9],
    nutrition_level: "light", // WICHTIG: Brauchen saure Moorbeeterde!
    spacing_cm: "100x150",
    good_neighbors: ["crop_strawberry"],
    bad_neighbors: ["crop_apple_tree", "crop_tomato"],
    frost_hardy: true
  },
  {
    id: "crop_gooseberry",
    category: "berry",
    name: { de: "Stachelbeere", en: "Gooseberry" },
    sunlight: "partial_shade", // Bekommen in der Prallsonne schnell Sonnenbrand
    watering_interval_days: 5,
    pruning: {
      de: "Mitte des Strauchs freischneiden, damit Licht und Luft herankommen (beugt Mehltau vor).",
      en: "Thin out the center of the bush to allow light and air in (prevents powdery mildew)."
    },
    sowing_outdoors_month: 10,
    harvest_months: [6, 7, 8],
    nutrition_level: "medium",
    spacing_cm: "100x150",
    good_neighbors: ["crop_strawberry"],
    bad_neighbors: [],
    frost_hardy: true
  },
  {
    id: "crop_redcurrant",
    category: "berry",
    name: { de: "Johannisbeere (Rot/Schwarz)", en: "Redcurrant / Blackcurrant" },
    sunlight: "full_sun",
    watering_interval_days: 5,
    pruning: {
      de: "Altes Holz (dunkel und dick) bodentief abschneiden, 8-12 starke junge Triebe stehen lassen.",
      en: "Cut old wood (dark and thick) to the ground, leave 8-12 strong young shoots."
    },
    sowing_outdoors_month: 10,
    harvest_months: [6, 7],
    nutrition_level: "medium",
    spacing_cm: "150x150",
    good_neighbors: ["crop_gooseberry"],
    bad_neighbors: [],
    frost_hardy: true
  },

  // ==========================================
  // 4. OBST (Fruits)
  // ==========================================
  {
    id: "crop_apple_tree",
    category: "fruit",
    name: {
      de: "Apfelbaum",
      en: "Apple Tree"
    },
    sunlight: "full_sun",
    watering_interval_days: 14, // Tiefwurzler, brauchen nur bei Hitze Wasser
    pruning: {
      de: "Winterschnitt (Jan-März): Nach innen wachsende Zweige und Wasserschosse entfernen. Krone auslichten.",
      en: "Winter prune (Jan-Mar): Remove inward-growing branches and water sprouts. Thin the canopy."
    },
    sowing_outdoors_month: 10, // Baum-Pflanzung meist im Herbst
    harvest_months: [8, 9, 10],
    nutrition_level: "medium",
    spacing_cm: "300x300", // Bäume brauchen Platz
    good_neighbors: ["crop_nasturtium", "crop_chives"], // Schnittlauch schützt vor Schorf
    bad_neighbors: ["crop_potato"],
    frost_hardy: true
  },
{
    id: "crop_pear_tree",
    category: "fruit",
    name: { de: "Birnbaum", en: "Pear Tree" },
    sunlight: "full_sun",
    watering_interval_days: 14, // Tiefwurzler
    pruning: {
      de: "Winterschnitt (Jan-März): Wasserschosse (steil nach oben wachsende Triebe) und Konkurrenztriebe entfernen.",
      en: "Winter prune (Jan-Mar): Remove water sprouts (steeply upward growing shoots) and competing branches."
    },
    sowing_outdoors_month: 10,
    harvest_months: [8, 9, 10],
    nutrition_level: "medium",
    spacing_cm: "300x300",
    good_neighbors: ["crop_chives", "crop_nasturtium"],
    bad_neighbors: ["crop_potato"], // Kartoffeln in Baumnähe ziehen Wühlmäuse an
    frost_hardy: true
  },
  {
    id: "crop_cherry_tree",
    category: "fruit",
    name: { de: "Kirschbaum", en: "Cherry Tree" },
    sunlight: "full_sun",
    watering_interval_days: 14,
    pruning: {
      de: "Süßkirschen IMMER direkt nach der Ernte im Sommer schneiden. Winterschnitt führt zu Krankheiten.",
      en: "ALWAYS prune sweet cherries directly after harvest in summer. Winter pruning leads to disease."
    },
    sowing_outdoors_month: 10,
    harvest_months: [6, 7],
    nutrition_level: "medium",
    spacing_cm: "400x400", // Kirschen werden oft sehr groß
    good_neighbors: ["crop_strawberry"],
    bad_neighbors: ["crop_apple_tree"],
    frost_hardy: true
  },
  {
    id: "crop_plum_tree",
    category: "fruit",
    name: { de: "Pflaumenbaum / Zwetschge", en: "Plum Tree" },
    sunlight: "full_sun",
    watering_interval_days: 12,
    pruning: {
      de: "Spätwinter oder direkt nach der Ernte auslichten. Äste, die steil nach oben wachsen, ableiten.",
      en: "Thin out in late winter or right after harvest. Redirect branches that grow steeply upwards."
    },
    sowing_outdoors_month: 10,
    harvest_months: [8, 9],
    nutrition_level: "heavy", // Pflaumen brauchen viele Nährstoffe für den Fruchtansatz
    spacing_cm: "300x300",
    good_neighbors: [],
    bad_neighbors: [],
    frost_hardy: true
  },
  {
    id: "crop_peach_tree",
    category: "fruit",
    name: { de: "Pfirsichbaum", en: "Peach Tree" },
    sunlight: "full_sun",
    watering_interval_days: 10,
    pruning: {
      de: "Trägt nur am einjährigen Holz! Muss jedes Frühjahr streng zurückgeschnitten werden (Fruchtholz verjüngen).",
      en: "Fruits only on one-year-old wood! Must be pruned strictly every spring (rejuvenate fruiting wood)."
    },
    sowing_outdoors_month: 4, // Besser im Frühjahr pflanzen wegen Frostgefahr im ersten Winter
    harvest_months: [7, 8],
    nutrition_level: "heavy",
    spacing_cm: "300x300",
    good_neighbors: ["crop_garlic", "crop_onion"], // Helfen gegen Kräuselkrankheit
    bad_neighbors: ["crop_potato"],
    frost_hardy: false // Der Baum ist winterhart, aber die extrem frühe Blüte erfriert oft!
  },
  {
    id: "crop_fig_tree",
    category: "fruit",
    name: { de: "Feigenbaum", en: "Fig Tree" },
    sunlight: "full_sun", // Braucht den wärmsten, geschütztesten Platz im Garten (Südwand)
    watering_interval_days: 7,
    pruning: {
      de: "Im zeitigen Frühjahr erfrorene Zweige entfernen. Lässt sich gut in Form schneiden.",
      en: "Remove frostbitten branches in early spring. Takes well to shaping."
    },
    sowing_outdoors_month: 5,
    harvest_months: [8, 9, 10],
    nutrition_level: "medium",
    spacing_cm: "200x200",
    good_neighbors: [],
    bad_neighbors: [],
    frost_hardy: false // In Deutschland meist Winterschutz (Vlies) nötig
  }
];