// ============================================================================
// PlantStack Houseplants Database (Kuratierter lokaler Zimmerpflanzen-Katalog)
// ============================================================================
// Vollständig offline-fähiger, typisierter Datensatz der beliebtesten Zimmerpflanzen.
// Enthält praxiserprobte Gieß- und Lichtdaten, ASPCA-geprüfte Haustier-Toxizität,
// deutsche Trivialnamen, Synonyme und Pflegetipps.
// ============================================================================

export interface Houseplant {
  id: string; // z. B. "houseplant_monstera_deliciosa"
  name: { de: string; en: string };
  scientificName: string;
  synonyms: string[]; // Deutsche & englische Alltagsnamen, alternative Schreibweisen
  category: "aroid" | "succulent" | "palm" | "ficus" | "fern" | "dracaena" | "flowering" | "foliage";
  watering_interval_days: number;
  fertilizer_interval_days?: number;
  sunlight: "full_sun" | "bright_indirect" | "partial_shade" | "shade";
  sunlight_text: { de: string; en: string };
  watering_text: { de: string; en: string };
  min_temp: number;
  max_temp: number;
  min_env_humid: number;
  min_soil_moist?: number;
  max_soil_moist?: number;
  min_light_lux: number;
  max_light_lux: number;
  pet_toxic: boolean;
  toxicity_notes?: { de: string; en: string };
  difficulty: "easy" | "medium" | "hard";
  pruning?: { de: string; en: string };
  propagation?: { de: string; en: string };
  origin?: string;
}

export const houseplantsData: Houseplant[] = [
  // ==========================================================================
  // 1. ARONSTABGEWÄCHSE (Aroids / Monstera, Philodendron, Epipremnum, etc.)
  // ==========================================================================
  {
    id: "houseplant_monstera_deliciosa",
    name: { de: "Köstliches Fensterblatt (Monstera)", en: "Swiss Cheese Plant (Monstera)" },
    scientificName: "Monstera deliciosa",
    synonyms: ["Monstera", "Fensterblatt", "Monstera Deliciosa", "Köstliches Fensterblatt", "Swiss Cheese Plant"],
    category: "aroid",
    watering_interval_days: 7,
    fertilizer_interval_days: 14,
    sunlight: "bright_indirect",
    sunlight_text: {
      de: "Hell bis halbschattig, keine pralle Mittagssonne. Morgen- oder Abendsonne wird toleriert.",
      en: "Bright indirect light, avoid harsh direct midday sun."
    },
    watering_text: {
      de: "Mäßig gießen: Obere Erdschicht (ca. 2-3 cm) vor dem nächsten Gießen leicht antrocknen lassen. Staunässe zwingend vermeiden.",
      en: "Water moderately: Allow top 2-3 cm of soil to dry out between waterings. Avoid waterlogging."
    },
    min_temp: 15,
    max_temp: 30,
    min_env_humid: 50,
    min_soil_moist: 25,
    max_soil_moist: 60,
    min_light_lux: 1500,
    max_light_lux: 8000,
    pet_toxic: true,
    toxicity_notes: {
      de: "Giftig für Katzen und Hunde durch unlösliche Calciumoxalat-Kristalle (Reizung von Mundschleimhaut und Rachen).",
      en: "Toxic to cats and dogs due to insoluble calcium oxalate crystals."
    },
    difficulty: "easy",
    pruning: {
      de: "Luftwurzeln nicht abschneiden, sondern vorsichtig in die Erde leiten. Zu lange Triebe im Frühjahr einkürzen.",
      en: "Do not cut aerial roots; guide them into the pot soil. Prune leggy vines in spring."
    },
    propagation: {
      de: "Kopf- oder Stammstecklinge mit mindestens einem Knoten und Luftwurzelansatz im Wasserglas bewurzeln.",
      en: "Stem or tip cuttings with at least one node and aerial root nub rooted in water."
    },
    origin: "Mittelamerika (Mexiko, Panama)"
  },
  {
    id: "houseplant_monstera_adansonii",
    name: { de: "Monstera Monkey Leaf", en: "Monstera Adansonii (Monkey Mask)" },
    scientificName: "Monstera adansonii",
    synonyms: ["Monkey Leaf", "Monkey Mask", "Lochpflanze", "Adansonii", "Monstera Adansonii"],
    category: "aroid",
    watering_interval_days: 6,
    fertilizer_interval_days: 14,
    sunlight: "bright_indirect",
    sunlight_text: {
      de: "Hell, indirektes Licht. Sehr empfindlich gegen direkte Sonneneinstrahlung.",
      en: "Bright indirect light. Sensitive to direct sunlight."
    },
    watering_text: {
      de: "Substrat gleichmäßig leicht feucht halten, niemals durchnässt. Verträgt keine Ballentrockenheit.",
      en: "Keep soil consistently lightly moist, never waterlogged."
    },
    min_temp: 16,
    max_temp: 28,
    min_env_humid: 60,
    min_soil_moist: 30,
    max_soil_moist: 65,
    min_light_lux: 1500,
    max_light_lux: 6500,
    pet_toxic: true,
    toxicity_notes: {
      de: "Giftig für Haustiere (Calciumoxalate). Außer Reichweite von kletterfreudigen Katzen aufhängen.",
      en: "Toxic to pets (calcium oxalate crystals)."
    },
    difficulty: "easy",
    pruning: {
      de: "Kann als Hängepflanze oder an einer Rankhilfe kultiviert werden. Triebe bei Bedarf einfach kappen.",
      en: "Can grow trailing or climbing up a moss pole. Trim vines to encourage bushy growth."
    },
    propagation: {
      de: "Stammstecklinge mit einem Blatt und Knoten bewurzeln extrem schnell im Wasser.",
      en: "Single-node stem cuttings root very quickly in water."
    },
    origin: "Mittel- und Südamerika"
  },
  {
    id: "houseplant_epipremnum_aureum",
    name: { de: "Goldene Efeutute", en: "Golden Pothos (Devil's Ivy)" },
    scientificName: "Epipremnum aureum",
    synonyms: ["Efeutute", "Goldene Efeutute", "Pothos", "Devils Ivy", "Scindapsus aureus", "Efeutute grün", "Efeutüte"],
    category: "aroid",
    watering_interval_days: 7,
    fertilizer_interval_days: 21,
    sunlight: "partial_shade",
    sunlight_text: {
      de: "Halbschatten bis hell ohne direkte Sonne. Extrem anpassungsfähig, wächst auch an dunkleren Standorten.",
      en: "Tolerates low light up to bright indirect light. Very adaptable."
    },
    watering_text: {
      de: "Erst gießen, wenn die oberen 2-3 cm Erde trocken sind. Verzeiht gelegentliches Vergessen.",
      en: "Water once top 2-3 cm of soil is dry. Forgiving of missed waterings."
    },
    min_temp: 14,
    max_temp: 30,
    min_env_humid: 40,
    min_soil_moist: 20,
    max_soil_moist: 55,
    min_light_lux: 800,
    max_light_lux: 6000,
    pet_toxic: true,
    toxicity_notes: {
      de: "Giftig für Hunde und Katzen. Ideal als Ampelpflanze in sicherer Höhe geeignet.",
      en: "Toxic to dogs and cats (calcium oxalates)."
    },
    difficulty: "easy",
    pruning: {
      de: "Regelmäßiges Stutzen regt dichteren Wuchs an der Basis an.",
      en: "Prune long tendrils to keep plant lush and full at the base."
    },
    propagation: {
      de: "Triebstücke mit Luftwurzelansatz im Wasserglas – kinderleichte Vermehrung.",
      en: "Extremely easy stem cutting propagation in water."
    },
    origin: "Französisch-Polynesien (Moorea)"
  },
  {
    id: "houseplant_scindapsus_pictus",
    name: { de: "Gefleckte Efeutute (Silbertute)", en: "Satin Pothos (Silver Vine)" },
    scientificName: "Scindapsus pictus",
    synonyms: ["Silbertute", "Gefleckte Efeutute", "Satin Pothos", "Scindapsus", "Silber-Efeutute"],
    category: "aroid",
    watering_interval_days: 7,
    fertilizer_interval_days: 21,
    sunlight: "bright_indirect",
    sunlight_text: {
      de: "Hell, keine direkte Sonne (damit das edle Silbermuster auf den Blättern intensiv bleibt).",
      en: "Bright indirect light to maintain intense silver leaf variegation."
    },
    watering_text: {
      de: "Warten, bis die Erdoberfläche trocken ist. Rollen sich die Blätter leicht ein, ist Zeit zum Gießen.",
      en: "Water when topsoil is dry. Curled leaves indicate thirst."
    },
    min_temp: 16,
    max_temp: 28,
    min_env_humid: 50,
    min_soil_moist: 20,
    max_soil_moist: 50,
    min_light_lux: 1200,
    max_light_lux: 5500,
    pet_toxic: true,
    toxicity_notes: {
      de: "Giftig für Haustiere bei Verzehr (Schleimhautreizung).",
      en: "Toxic to cats and dogs."
    },
    difficulty: "easy",
    pruning: {
      de: "Lange Ranken im Frühjahr zurückschneiden für buschigeren Wuchs.",
      en: "Trim long vines to stimulate branching."
    },
    propagation: {
      de: "Kopfstecklinge in Wasser oder feuchtem Moos bewurzeln.",
      en: "Root tip cuttings in water or damp sphagnum moss."
    },
    origin: "Südostasien (Indonesien, Thailand, Philippinen)"
  },
  {
    id: "houseplant_spathiphyllum_wallisii",
    name: { de: "Einblatt (Friedenslilie)", en: "Peace Lily (Spathiphyllum)" },
    scientificName: "Spathiphyllum wallisii",
    synonyms: ["Friedenslilie", "Einblatt", "Spathiphyllum", "Peace Lily", "Scheidenblatt", "Blattfahne"],
    category: "aroid",
    watering_interval_days: 5,
    fertilizer_interval_days: 21,
    sunlight: "partial_shade",
    sunlight_text: {
      de: "Halbschatten bis Schatten. Verträgt keine direkte Sonneneinstrahlung (Verbrennungsgefahr der Blüten).",
      en: "Low to moderate indirect light. Never direct sun."
    },
    watering_text: {
      de: "Gleichmäßig feucht halten. Zeigt Wassermangel durch dramatisch herabhängende Blätter, erholt sich nach dem Gießen rasch.",
      en: "Keep evenly moist. Leaves dramatically droop when thirsty and bounce back quickly after watering."
    },
    min_temp: 16,
    max_temp: 26,
    min_env_humid: 55,
    min_soil_moist: 35,
    max_soil_moist: 70,
    min_light_lux: 800,
    max_light_lux: 4000,
    pet_toxic: true,
    toxicity_notes: {
      de: "Giftig für Katzen und Hunde (Mundbrennen, Erbrechen). Von Haustieren fernhalten.",
      en: "Toxic to dogs and cats (calcium oxalates)."
    },
    difficulty: "easy",
    pruning: {
      de: "Verblühte weiße Hochblätter und gelbe Blätter an der Basis bodennah abschneiden.",
      en: "Cut faded flower spathes and yellowed leaves at the base."
    },
    propagation: {
      de: "Teilung des Wurzelballens beim Umtopfen im Frühjahr.",
      en: "Division of rhizome root clumps during repotting in spring."
    },
    origin: "Kolumbien, Venezuela"
  },
  {
    id: "houseplant_philodendron_hederaceum",
    name: { de: "Herzblatt-Philodendron", en: "Heartleaf Philodendron" },
    scientificName: "Philodendron hederaceum",
    synonyms: ["Philodendron scandens", "Kletternder Philodendron", "Herzblatt-Philodendron", "Heartleaf Philodendron"],
    category: "aroid",
    watering_interval_days: 7,
    fertilizer_interval_days: 21,
    sunlight: "bright_indirect",
    sunlight_text: {
      de: "Halbschattig bis hell ohne direkte Sonne. Äußerst tolerant gegenüber unterschiedlichen Lichtverhältnissen.",
      en: "Medium to bright indirect light, tolerates low light."
    },
    watering_text: {
      de: "Mäßig gießen: Obere Erdhälfte antrocknen lassen. Staunässe führt schnell zu Wurzelfäule.",
      en: "Allow top half of soil to dry before watering again."
    },
    min_temp: 15,
    max_temp: 28,
    min_env_humid: 45,
    min_soil_moist: 25,
    max_soil_moist: 55,
    min_light_lux: 1000,
    max_light_lux: 5500,
    pet_toxic: true,
    toxicity_notes: {
      de: "Giftig für Haustiere (Calciumoxalate).",
      en: "Toxic to pets."
    },
    difficulty: "easy",
    pruning: {
      de: "Beliebig einkürzbar. Kann als Kletter- oder Hängepflanze gehalten werden.",
      en: "Prune freely to shape or encourage bushier growth."
    },
    propagation: {
      de: "Stammstecklinge mit Knoten bewurzeln zuverlässig im Wasserglas.",
      en: "Stem cuttings root reliably in water."
    },
    origin: "Mittelamerika & Karibik"
  },
  {
    id: "houseplant_philodendron_birkin",
    name: { de: "Philodendron Birkin", en: "Philodendron Birkin" },
    scientificName: "Philodendron 'Birkin'",
    synonyms: ["Birkin", "Philodendron Birkin", "Weißgestreifter Philodendron"],
    category: "aroid",
    watering_interval_days: 7,
    fertilizer_interval_days: 14,
    sunlight: "bright_indirect",
    sunlight_text: {
      de: "Hell, indirektes Licht. Benötigt gutes Licht, um die markanten weißen Blattstreifen auszubilden.",
      en: "Bright indirect light is required to maintain crisp white variegation."
    },
    watering_text: {
      de: "Oberste 3 cm antrocknen lassen. Kein stehendes Wasser im Übertopf dulden.",
      en: "Let top 3 cm dry. Sensitive to wet feet."
    },
    min_temp: 16,
    max_temp: 28,
    min_env_humid: 50,
    min_soil_moist: 25,
    max_soil_moist: 60,
    min_light_lux: 1800,
    max_light_lux: 7000,
    pet_toxic: true,
    toxicity_notes: {
      de: "Giftig für Haustiere (Reizung der Mundschleimhäute).",
      en: "Toxic to pets."
    },
    difficulty: "easy",
    pruning: {
      de: "Wächst kompakt und bildet keinen Stamm. Nur vertrocknete untere Blätter entfernen.",
      en: "Compact growth habit; only remove dead lower leaves."
    },
    propagation: {
      de: "Kopfstecklinge oder Seitentriebe beim Umtopfen abtrennen.",
      en: "Propagate via basal shoot separation or stem cuttings."
    },
    origin: "Kulturform (Hybrid)"
  },
  {
    id: "houseplant_alocasia_amazonica",
    name: { de: "Skelettblatt-Alokasie (Polly)", en: "Alocasia Amazonica (Polly)" },
    scientificName: "Alocasia x amazonica",
    synonyms: ["Alokasie", "Alocasia", "Pfeilblatt", "Skelettblatt", "Alocasia Polly", "Amazonas-Pfeilblatt"],
    category: "aroid",
    watering_interval_days: 6,
    fertilizer_interval_days: 14,
    sunlight: "bright_indirect",
    sunlight_text: {
      de: "Sehr hell, aber strikt ohne pralle Mittagssonne. Braucht ausreichend Licht für kräftige Blätter.",
      en: "Bright, filtered light. Sensitive to direct hot sun."
    },
    watering_text: {
      de: "Gleichmäßig mäßig feucht halten. Ballentrockenheit führt zu Blattverlust, Staunässe zu Knollenfäule.",
      en: "Keep soil lightly moist. Avoid drought and wet feet to protect the tuber."
    },
    min_temp: 18,
    max_temp: 28,
    min_env_humid: 65,
    min_soil_moist: 30,
    max_soil_moist: 60,
    min_light_lux: 2000,
    max_light_lux: 8000,
    pet_toxic: true,
    toxicity_notes: {
      de: "Stark giftig für Hunde und Katzen. Enthält scharfen Pflanzensaft mit Oxalatkristallen.",
      en: "Toxic to cats and dogs (calcium oxalate crystals)."
    },
    difficulty: "medium",
    pruning: {
      de: "Ältere Blätter welken naturbedingt, sobald ein neues Blatt austreibt – bodennah abschneiden.",
      en: "Older outer leaves naturally decline when new leaves emerge; cut close to tuber."
    },
    propagation: {
      de: "Vermehrung über Knöllchen (Rhizom-Corms) beim Umtopfen im Frühjahr.",
      en: "Separate small corms attached to root system during repotting."
    },
    origin: "Kulturform (Zucht aus asiatischen Alocasia-Arten)"
  },
  {
    id: "houseplant_alocasia_zebrina",
    name: { de: "Zebra-Alokasie", en: "Alocasia Zebrina (Zebra Plant)" },
    scientificName: "Alocasia zebrina",
    synonyms: ["Zebra-Alokasie", "Zebrapflanze", "Alocasia Zebrina", "Zebrina"],
    category: "aroid",
    watering_interval_days: 6,
    fertilizer_interval_days: 14,
    sunlight: "bright_indirect",
    sunlight_text: {
      de: "Viel indirektes Licht. Neigt dazu, sich stark zum Licht zu neigen – regelmäßig drehen.",
      en: "Lots of bright indirect light. Rotate pot periodically for upright stems."
    },
    watering_text: {
      de: "Im Sommer regelmäßig mäßig gießen, im Winter sparsamer. Auf hohe Luftfeuchte achten.",
      en: "Water moderately; avoid standing water in the drainage tray."
    },
    min_temp: 18,
    max_temp: 28,
    min_env_humid: 60,
    min_soil_moist: 30,
    max_soil_moist: 60,
    min_light_lux: 2200,
    max_light_lux: 8500,
    pet_toxic: true,
    toxicity_notes: {
      de: "Giftig für Haustiere.",
      en: "Toxic to dogs and cats."
    },
    difficulty: "medium",
    pruning: {
      de: "Verwelkte Blattstiele erst entfernen, wenn sie vollständig abgetrocknet sind.",
      en: "Trim expired leaf stems once they have naturally dried out."
    },
    propagation: {
      de: "Über Knollen/Corms beim Umtopfen.",
      en: "Propagate via corms found in root ball."
    },
    origin: "Philippinen"
  },
  {
    id: "houseplant_syngonium_podophyllum",
    name: { de: "Purpurtute (Pfeilblatt)", en: "Arrowhead Plant (Syngonium)" },
    scientificName: "Syngonium podophyllum",
    synonyms: ["Purpurtute", "Pfeilblatt-Syngonium", "Syngonium", "Arrowhead Plant"],
    category: "aroid",
    watering_interval_days: 6,
    fertilizer_interval_days: 14,
    sunlight: "bright_indirect",
    sunlight_text: {
      de: "Hell bis halbschattig. Sorten mit Pink- oder Weißanteil brauchen mehr Licht.",
      en: "Bright indirect light to light shade. Pink/variegated varieties need brighter light."
    },
    watering_text: {
      de: "Substrat antrocknen lassen, dann durchdringend gießen. Staunässe meiden.",
      en: "Allow top layer to dry out slightly between waterings."
    },
    min_temp: 16,
    max_temp: 27,
    min_env_humid: 55,
    min_soil_moist: 25,
    max_soil_moist: 60,
    min_light_lux: 1200,
    max_light_lux: 6000,
    pet_toxic: true,
    toxicity_notes: {
      de: "Giftig für Haustiere (Calciumoxalate).",
      en: "Toxic to pets."
    },
    difficulty: "easy",
    pruning: {
      de: "Triebspitzen stutzen für kompakten Wuchs, oder an einem Moosstab klettern lassen.",
      en: "Pinch climbing stems to maintain bushiness or train onto trellis."
    },
    propagation: {
      de: "Stammstecklinge wurzeln sehr zügig im Wasser.",
      en: "Stem cuttings root easily in water."
    },
    origin: "Mittel- und Südamerika"
  },
  {
    id: "houseplant_aglaonema_commutatum",
    name: { de: "Kolbenfaden", en: "Chinese Evergreen (Aglaonema)" },
    scientificName: "Aglaonema commutatum",
    synonyms: ["Kolbenfaden", "Aglaonema", "Chinese Evergreen"],
    category: "aroid",
    watering_interval_days: 9,
    fertilizer_interval_days: 28,
    sunlight: "partial_shade",
    sunlight_text: {
      de: "Halbschatten bis schattig. Gehört zu den schattenverträglichsten Zimmerpflanzen überhaupt.",
      en: "Low light to moderate indirect light. Exceptionally shade-tolerant."
    },
    watering_text: {
      de: "Wenig gießen: Erde zwischen den Wassergaben zu 50% abtrocknen lassen.",
      en: "Low water needs: Let half the soil dry out before watering again."
    },
    min_temp: 16,
    max_temp: 26,
    min_env_humid: 45,
    min_soil_moist: 15,
    max_soil_moist: 45,
    min_light_lux: 600,
    max_light_lux: 4000,
    pet_toxic: true,
    toxicity_notes: {
      de: "Giftig für Haustiere bei Verzehr.",
      en: "Toxic to cats and dogs."
    },
    difficulty: "easy",
    pruning: {
      de: "Kaum Schnitt nötig. Unansehnliche Blätter am Grund kappen.",
      en: "Minimal pruning; clip yellow leaves at base."
    },
    propagation: {
      de: "Teilung beim Umtopfen oder Kopfstecklinge.",
      en: "Divide root clumps during repotting."
    },
    origin: "Südostasien (Philippinen, Malaysia)"
  },
  {
    id: "houseplant_dieffenbachia_seguine",
    name: { de: "Dieffenbachie", en: "Dumb Cane (Dieffenbachia)" },
    scientificName: "Dieffenbachia seguine",
    synonyms: ["Dieffenbachie", "Giftaron", "Dumb Cane", "Dieffenbachia"],
    category: "aroid",
    watering_interval_days: 7,
    fertilizer_interval_days: 14,
    sunlight: "bright_indirect",
    sunlight_text: {
      de: "Hell ohne direkte Sonne. Bei zu wenig Licht verblasst die spektakuläre Blattmusterung.",
      en: "Bright indirect light. Variegation fades in low light."
    },
    watering_text: {
      de: "Mäßig feucht halten, oberste 2 cm antrocknen lassen. Ballentrockenheit vermeiden.",
      en: "Keep moderately moist; avoid soggy soil and complete drying."
    },
    min_temp: 17,
    max_temp: 27,
    min_env_humid: 55,
    min_soil_moist: 25,
    max_soil_moist: 55,
    min_light_lux: 1500,
    max_light_lux: 6000,
    pet_toxic: true,
    toxicity_notes: {
      de: "STARK GIFTIG! Pflanzensaft schädigt Schleimhäute und kann Stimmbandlähmung auslösen. Handschuhe tragen, absolut unzugänglich für Haustiere aufstellen.",
      en: "HIGHLY TOXIC! Sap irritates skin and mucous membranes. Keep strictly away from pets and small children."
    },
    difficulty: "easy",
    pruning: {
      de: "Bei Rückschnitt zwingend Handschuhe tragen! Saft nicht berühren.",
      en: "Always wear gloves when pruning due to irritating sap."
    },
    propagation: {
      de: "Stammabschnitte waagerecht auf feuchte Erde legen.",
      en: "Root cane sections horizontally on damp substrate."
    },
    origin: "Tropisches Amerika & Karibik"
  },

  // ==========================================================================
  // 2. SUKKULENTEN & WÜSTENPFLANZEN (Sansevieria, Zamioculcas, Crassula, etc.)
  // ==========================================================================
  {
    id: "houseplant_zamioculcas_zamiifolia",
    name: { de: "Glücksfeder (Zamioculcas)", en: "ZZ Plant (Zamioculcas)" },
    scientificName: "Zamioculcas zamiifolia",
    synonyms: ["Glücksfeder", "Gluecksfeder", "Zamioculcas", "Zamie", "ZZ Plant", "Kartonpapier-Palme", "Smaragdpalme"],
    category: "succulent",
    watering_interval_days: 18,
    fertilizer_interval_days: 45,
    sunlight: "partial_shade",
    sunlight_text: {
      de: "Schattig bis hell, verträgt fast jeden Standort außer pralle sengende Mittagssonne. Extrem robust.",
      en: "Low light to bright indirect light. One of the most resilient indoor plants."
    },
    watering_text: {
      de: "Sehr sparsam gießen! Speichert Wasser in knollenartigen Rhizomen. Vor dem Gießen Erde komplett abtrocknen lassen. Überwässerung ist Todesursache Nr. 1.",
      en: "Water very sparingly. Stores water in bulbous rhizomes. Allow soil to dry completely between waterings."
    },
    min_temp: 15,
    max_temp: 32,
    min_env_humid: 30,
    min_soil_moist: 10,
    max_soil_moist: 35,
    min_light_lux: 500,
    max_light_lux: 5000,
    pet_toxic: true,
    toxicity_notes: {
      de: "Giftig für Katzen und Hunde (Oxalate). Kann bei Verzehr Magen-Darm-Beschwerden auslösen.",
      en: "Toxic to pets upon ingestion."
    },
    difficulty: "easy",
    pruning: {
      de: "Gelbe oder alte Triebe ganz unten an der Knolle abschneiden. Kein Formschnitt nötig.",
      en: "Clip old yellowed stalks flush with the soil line."
    },
    propagation: {
      de: "Teilung der Wurzelknollen beim Umtopfen oder über einzelne Fiederblättchen in Anzuchterde.",
      en: "Rhizome division during repotting or leaf cuttings in soil."
    },
    origin: "Ostafrika (Kenia, Sansibar, Tansania)"
  },
  {
    id: "houseplant_sansevieria_trifasciata",
    name: { de: "Bogenhanf (Schwiegermutterzunge)", en: "Snake Plant (Sansevieria)" },
    scientificName: "Dracaena trifasciata",
    synonyms: ["Bogenhanf", "Schwiegermutterzunge", "Sansevieria", "Sansevierie", "Snake Plant", "Sansevieria trifasciata", "Bogenhanfpflanze"],
    category: "succulent",
    watering_interval_days: 18,
    fertilizer_interval_days: 45,
    sunlight: "bright_indirect",
    sunlight_text: {
      de: "Sonne bis Schatten. Wächst bei hellem Licht schneller, überlebt aber problemlos dunkle Ecken.",
      en: "Tolerates full sun down to low light. Thrives on neglect."
    },
    watering_text: {
      de: "Sehr sparsam gießen. Das Substrat muss vor dem nächsten Wässern vollständig austrocknen.",
      en: "Very drought tolerant. Soil must be completely dry before watering."
    },
    min_temp: 12,
    max_temp: 32,
    min_env_humid: 30,
    min_soil_moist: 10,
    max_soil_moist: 30,
    min_light_lux: 600,
    max_light_lux: 8000,
    pet_toxic: true,
    toxicity_notes: {
      de: "Giftig für Hunde und Katzen durch Saponine (Übelkeit, Speicheln).",
      en: "Toxic to cats and dogs (saponins cause nausea)."
    },
    difficulty: "easy",
    pruning: {
      de: "Beschädigte Außenblätter an der Basis abschneiden. Nicht die Blattspitzen kürzen.",
      en: "Cut damaged outer blades at ground level; do not trim tips."
    },
    propagation: {
      de: "Ausläufer/Kindel beim Umtopfen abtrennen oder Blattstecklinge (ca. 8 cm) in Erde setzen.",
      en: "Divide root pups or take leaf cuttings."
    },
    origin: "Westafrika (Nigeria, Kongo)"
  },
  {
    id: "houseplant_sansevieria_cylindrica",
    name: { de: "Zylindrischer Bogenhanf", en: "Cylindrical Snake Plant" },
    scientificName: "Dracaena cylindrica",
    synonyms: ["Zylindrischer Bogenhanf", "Sansevieria cylindrica", "Stabbogenhanf", "Afrikanischer Bogenhanf"],
    category: "succulent",
    watering_interval_days: 20,
    fertilizer_interval_days: 45,
    sunlight: "bright_indirect",
    sunlight_text: {
      de: "Hell bis vollsonnig. Kommt auch mit Halbschatten zurecht.",
      en: "Bright indirect to full sun. Tolerates partial shade."
    },
    watering_text: {
      de: "Alle 2-3 Wochen schlückchenweise gießen. Im Winter oft nur 1x pro Monat.",
      en: "Water every 2-3 weeks in summer, once a month in winter."
    },
    min_temp: 12,
    max_temp: 32,
    min_env_humid: 30,
    min_soil_moist: 10,
    max_soil_moist: 30,
    min_light_lux: 800,
    max_light_lux: 10000,
    pet_toxic: true,
    toxicity_notes: {
      de: "Giftig für Haustiere (Saponine).",
      en: "Toxic to pets."
    },
    difficulty: "easy",
    pruning: {
      de: "Kein Schnitt nötig.",
      en: "No pruning required."
    },
    propagation: {
      de: "Über Kindel/Ausläufer.",
      en: "Propagate by separating pups."
    },
    origin: "Angola"
  },
  {
    id: "houseplant_crassula_ovata",
    name: { de: "Geldbaum (Pfennigbaum)", en: "Jade Plant (Money Tree)" },
    scientificName: "Crassula ovata",
    synonyms: ["Geldbaum", "Pfennigbaum", "Dickblatt", "Jade Plant", "Crassula", "Glücksbaum"],
    category: "succulent",
    watering_interval_days: 14,
    fertilizer_interval_days: 30,
    sunlight: "full_sun",
    sunlight_text: {
      de: "Vollsonnig bis sehr hell. Braucht direktes Sonnenlicht für kompakte Wuchsform und rote Blattränder.",
      en: "Full sun to very bright light. Direct sunlight promotes compact growth."
    },
    watering_text: {
      de: "Durchdringend gießen, danach Erde völlig austrocknen lassen. Fette Blätter speichern wochenlang Wasser.",
      en: "Soak and dry method: Allow soil to dry out thoroughly between waterings."
    },
    min_temp: 10,
    max_temp: 32,
    min_env_humid: 30,
    min_soil_moist: 10,
    max_soil_moist: 35,
    min_light_lux: 3000,
    max_light_lux: 25000,
    pet_toxic: true,
    toxicity_notes: {
      de: "Giftig für Katzen und Hunde (führt zu Erbrechen, Lethargie und verlangsamtem Puls).",
      en: "Toxic to cats and dogs (causes vomiting and lethargy)."
    },
    difficulty: "easy",
    pruning: {
      de: "Kann problemlos zurückgeschnitten werden, um eine baumartige Krone zu formen.",
      en: "Responds great to pruning to develop a bonsai-like trunk and canopy."
    },
    propagation: {
      de: "Blatt- oder Kopfstecklinge 2 Tage antrocknen lassen, dann in feine Kakteenerde stecken.",
      en: "Leaf or stem cuttings calloused for 2 days, then planted in cactus mix."
    },
    origin: "Südafrika, Mosambik"
  },
  {
    id: "houseplant_beaucarnea_recurvata",
    name: { de: "Elefantenfuß (Flaschenbaum)", en: "Ponytail Palm (Elephant Foot)" },
    scientificName: "Beaucarnea recurvata",
    synonyms: ["Elefantenfuß", "Elefantenfuss", "Flaschenbaum", "Ponytail Palm", "Wasserpalme", "Nolina"],
    category: "succulent",
    watering_interval_days: 16,
    fertilizer_interval_days: 30,
    sunlight: "full_sun",
    sunlight_text: {
      de: "Sehr hell bis vollsonnig. Liebt Fensterplätze mit direkter Sonneneinstrahlung.",
      en: "Bright direct sunlight to bright indirect light."
    },
    watering_text: {
      de: "Wenig gießen: Der dicke, knollige Stamm (Caudex) dient als riesiger Wasserspeicher. Vor dem nächsten Gießen komplett austrocknen lassen.",
      en: "Water sparingly: Bulbous trunk stores large reserves of water. Allow soil to dry completely."
    },
    min_temp: 10,
    max_temp: 30,
    min_env_humid: 35,
    min_soil_moist: 10,
    max_soil_moist: 35,
    min_light_lux: 2500,
    max_light_lux: 20000,
    pet_toxic: false,
    toxicity_notes: {
      de: "🐾 100% UNGIFTIG für Katzen und Hunde! Katzen spielen gern mit den herabhängenden Blättern.",
      en: "🐾 PET SAFE: Non-toxic to cats and dogs according to ASPCA."
    },
    difficulty: "easy",
    pruning: {
      de: "Braune Blattspitzen mit der Schere vorsichtig stutzen, dabei einen feinen braunen Rand stehen lassen.",
      en: "Trim brown tips with shears; do not cut into green tissue."
    },
    propagation: {
      de: "Abtrennung von Nebentrieben an der Stammbasis (anspruchsvoll).",
      en: "Separation of side offshoots in spring."
    },
    origin: "Ost-Mexiko"
  },
  {
    id: "houseplant_aloe_vera",
    name: { de: "Echte Aloe (Aloe Vera)", en: "Aloe Vera" },
    scientificName: "Aloe vera",
    synonyms: ["Aloe Vera", "Echte Aloe", "Wüstenlilie", "Aloe"],
    category: "succulent",
    watering_interval_days: 14,
    fertilizer_interval_days: 30,
    sunlight: "full_sun",
    sunlight_text: {
      de: "Sonnig bis vollsonnig. Ideal für Südfenster.",
      en: "Full sun to bright direct light."
    },
    watering_text: {
      de: "Mäßig gießen: Substrat vollständig abtrocknen lassen. Keinesfalls Wasser in die Rosette gießen (Fäulnisgefahr).",
      en: "Soak and dry. Never pour water into the central rosette."
    },
    min_temp: 10,
    max_temp: 35,
    min_env_humid: 30,
    min_soil_moist: 10,
    max_soil_moist: 35,
    min_light_lux: 3000,
    max_light_lux: 25000,
    pet_toxic: true,
    toxicity_notes: {
      de: "Giftig für Hunde und Katzen (Aloin in der Blattrinde führt zu Durchfall und Lethargie).",
      en: "Toxic to cats and dogs (aloin causes lethargy and diarrhea)."
    },
    difficulty: "easy",
    pruning: {
      de: "Untere, verbrauchte Blätter direkt an der Basis vorsichtig abschneiden.",
      en: "Harvest or prune outer mature leaves at the base."
    },
    propagation: {
      de: "Bildet zahlreiche Kindel (Seitensprosse), die einfach mit Wurzeln abgetrennt und eingetopft werden.",
      en: "Readily produces pups (offsets) around base."
    },
    origin: "Arabische Halbinsel"
  },
  {
    id: "houseplant_senecio_rowleyanus",
    name: { de: "Erbsenpflanze (Perlenschnur)", en: "String of Pearls" },
    scientificName: "Curio rowleyanus",
    synonyms: ["Erbsenpflanze", "Perlenschnur", "String of Pearls", "Senecio rowleyanus", "Erbsenkette"],
    category: "succulent",
    watering_interval_days: 14,
    fertilizer_interval_days: 30,
    sunlight: "bright_indirect",
    sunlight_text: {
      de: "Sehr hell mit etwas milder Morgen- oder Abendsonne. Auf ausreichende Beleuchtung der Oberseite im Topf achten.",
      en: "Bright indirect light with a few hours of gentle morning sun. Ensure top of pot gets light."
    },
    watering_text: {
      de: "Erst gießen, wenn die kugeligen 'Erbsen' leicht einschrumpeln und das Substrat trocken ist. Extrem anfällig für Wurzelfäule.",
      en: "Water only when pearls slightly shrivel and soil is dry."
    },
    min_temp: 13,
    max_temp: 28,
    min_env_humid: 35,
    min_soil_moist: 10,
    max_soil_moist: 30,
    min_light_lux: 2500,
    max_light_lux: 12000,
    pet_toxic: true,
    toxicity_notes: {
      de: "Giftig für Haustiere bei Verzehr (Pyrrolizidinalkaloide). Unbedingt hoch aufhängen.",
      en: "Toxic to cats and dogs."
    },
    difficulty: "medium",
    pruning: {
      de: "Zu lange Perlenstränge einkürzen; Schnittreste oben auf die Erde legen, um die Pflanze dichter zu machen.",
      en: "Trim long strands and coil cuttings back into pot to create full crown."
    },
    propagation: {
      de: "Triebstücke einfach flach auf feuchte Kakteenerde legen – sie wurzeln an den Knoten an.",
      en: "Lay vine cuttings on moist soil; nodes root within weeks."
    },
    origin: "Südwestafrika (Namibia)"
  },
  {
    id: "houseplant_ceropegia_woodii",
    name: { de: "Leuchterblume (String of Hearts)", en: "String of Hearts (Rosary Vine)" },
    scientificName: "Ceropegia woodii",
    synonyms: ["Leuchterblume", "String of Hearts", "Herzenkette", "Herzblattranke", "Ceropegia"],
    category: "succulent",
    watering_interval_days: 12,
    fertilizer_interval_days: 30,
    sunlight: "bright_indirect",
    sunlight_text: {
      de: "Sehr hell, verträgt sanfte Morgen-/Abendsonne. Bei viel Licht färben sich die Blattunterseiten rosa-lila.",
      en: "Bright indirect light with some direct morning sun. Light intensifies pink undersides."
    },
    watering_text: {
      de: "Erde zwischen den Wassergaben vollständig austrocknen lassen. Bildet kleine Knöllchen an den Trieben.",
      en: "Allow soil to dry completely between waterings."
    },
    min_temp: 14,
    max_temp: 28,
    min_env_humid: 40,
    min_soil_moist: 10,
    max_soil_moist: 35,
    min_light_lux: 2000,
    max_light_lux: 10000,
    pet_toxic: false,
    toxicity_notes: {
      de: "🐾 100% UNGIFTIG für Katzen und Hunde! Tolle tierfreundliche Hängepflanze.",
      en: "🐾 PET SAFE: Non-toxic to dogs and cats."
    },
    difficulty: "easy",
    pruning: {
      de: "Ranken können beliebig auf Wunschlänge gekürzt werden.",
      en: "Trim tendrils to desired hanging length."
    },
    propagation: {
      de: "Triebstücke oder Knöllchen (Tuberkel) auf feuchtes Moos oder Erde legen.",
      en: "Root vine cuttings or tubers pinned into soil."
    },
    origin: "Südafrika, Simbabwe"
  },

  // ==========================================================================
  // 3. FEIGEN- & FICUS-ARTEN (Ficus elastica, benjamina, lyrata)
  // ==========================================================================
  {
    id: "houseplant_ficus_elastica",
    name: { de: "Gummibaum", en: "Rubber Tree (Ficus elastica)" },
    scientificName: "Ficus elastica",
    synonyms: ["Gummibaum", "Ficus elastica", "Kautschukbaum", "Rubber Tree", "Rubber Plant"],
    category: "ficus",
    watering_interval_days: 8,
    fertilizer_interval_days: 14,
    sunlight: "bright_indirect",
    sunlight_text: {
      de: "Viel helles, indirektes Licht. Etwas Vormittagssonne wird sehr gut vertragen.",
      en: "Bright indirect light with some gentle morning sun."
    },
    watering_text: {
      de: "Erst gießen, wenn die obere Hälfte des Substrats trocken ist. Staunässe führt zu Blattfall.",
      en: "Allow top half of soil to dry out. Dislikes soggy roots."
    },
    min_temp: 15,
    max_temp: 28,
    min_env_humid: 45,
    min_soil_moist: 20,
    max_soil_moist: 50,
    min_light_lux: 1800,
    max_light_lux: 10000,
    pet_toxic: true,
    toxicity_notes: {
      de: "Giftig für Haustiere (Milchsaft enthält Ficin und Kautschuk; reizt Haut und Magen).",
      en: "Toxic to cats and dogs (milky sap causes skin and oral irritation)."
    },
    difficulty: "easy",
    pruning: {
      de: "Kappen des Haupttriebs im Frühjahr regt Verzweigung an. Wunde mit feuchtem Tuch tupfen (Milchsaft).",
      en: "Prune top stem in spring to encourage bushy branching. Dab milky sap with damp cloth."
    },
    propagation: {
      de: "Kopfstecklinge oder Moosabmoosen im Sommer.",
      en: "Tip cuttings or air layering in spring/summer."
    },
    origin: "Südostasien (Indien, Malaysia)"
  },
  {
    id: "houseplant_ficus_benjamina",
    name: { de: "Birkenfeige (Benjamini)", en: "Weeping Fig (Ficus benjamina)" },
    scientificName: "Ficus benjamina",
    synonyms: ["Birkenfeige", "Benjamini", "Ficus benjamina", "Benjaminsfeige", "Weeping Fig"],
    category: "ficus",
    watering_interval_days: 7,
    fertilizer_interval_days: 14,
    sunlight: "bright_indirect",
    sunlight_text: {
      de: "Sehr hell, keine pralle Mittagssonne. Reagiert empfindlich auf Standortwechsel und Zugluft mit Blattabwurf.",
      en: "Bright indirect light. Drops leaves if moved frequently or exposed to drafts."
    },
    watering_text: {
      de: "Gleichmäßig feucht halten, oberste 2 cm antrocknen lassen. Ballentrockenheit und Staunässe vermeiden.",
      en: "Keep moderately moist; avoid both drought and waterlogging."
    },
    min_temp: 15,
    max_temp: 28,
    min_env_humid: 50,
    min_soil_moist: 25,
    max_soil_moist: 55,
    min_light_lux: 1800,
    max_light_lux: 9000,
    pet_toxic: true,
    toxicity_notes: {
      de: "Giftig für Hunde und Katzen (Milchsaft).",
      en: "Toxic to pets."
    },
    difficulty: "medium",
    pruning: {
      de: "Sehr schnittverträglich! Im Frühjahr beliebig in Form schneiden.",
      en: "Tolerates heavy pruning in spring to maintain desired shape."
    },
    propagation: {
      de: "Halbverholzte Stecklinge in Wasser oder Anzuchterde.",
      en: "Semi-hardwood cuttings in water."
    },
    origin: "Süd- und Südostasien, Australien"
  },
  {
    id: "houseplant_ficus_lyrata",
    name: { de: "Geigenfeige", en: "Fiddle Leaf Fig (Ficus lyrata)" },
    scientificName: "Ficus lyrata",
    synonyms: ["Geigenfeige", "Ficus lyrata", "Geigenblatt-Feige", "Fiddle Leaf Fig"],
    category: "ficus",
    watering_interval_days: 8,
    fertilizer_interval_days: 14,
    sunlight: "bright_indirect",
    sunlight_text: {
      de: "Sehr hell mit einigen Stunden milder Sonne. Benötigt viel Licht für die riesigen Blätter.",
      en: "High bright indirect light with several hours of gentle sun."
    },
    watering_text: {
      de: "Gründlich gießen, dann obere Erdhälfte abtrocknen lassen. Auf braune Flecken (oft Überwässerung) achten.",
      en: "Thorough soak, then allow top half of soil to dry. Brown spots usually mean overwatering."
    },
    min_temp: 16,
    max_temp: 28,
    min_env_humid: 55,
    min_soil_moist: 20,
    max_soil_moist: 55,
    min_light_lux: 2500,
    max_light_lux: 12000,
    pet_toxic: true,
    toxicity_notes: {
      de: "Giftig für Haustiere (Milchsaft).",
      en: "Toxic to cats and dogs."
    },
    difficulty: "medium",
    pruning: {
      de: "Spitze im Frühjahr einkürzen, um Kronenbildung anzuregen.",
      en: "Pinch top bud to stimulate branch growth."
    },
    propagation: {
      de: "Kopfstecklinge im Wasserglas oder Abmoosen.",
      en: "Stem tip cuttings or air layering."
    },
    origin: "Westafrika (Kamerun bis Sierra Leone)"
  },

  // ==========================================================================
  // 4. PALMEN (Howea, Dypsis, Chamaedorea, etc.)
  // ==========================================================================
  {
    id: "houseplant_howea_forsteriana",
    name: { de: "Kentiapalme (Forsterpalme)", en: "Kentia Palm (Howea forsteriana)" },
    scientificName: "Howea forsteriana",
    synonyms: ["Kentiapalme", "Kentia Palm", "Forsterpalme", "Howea", "Paradiespalme"],
    category: "palm",
    watering_interval_days: 8,
    fertilizer_interval_days: 28,
    sunlight: "bright_indirect",
    sunlight_text: {
      de: "Hell bis halbschattig. Eine der elegantesten und schattentolerantesten Palmen.",
      en: "Medium to bright indirect light; tolerates lower light levels well."
    },
    watering_text: {
      de: "Gleichmäßig mäßig feucht halten. Ballentrockenheit und stehende Nässe gleichermaßen meiden.",
      en: "Keep soil lightly moist. Never allow root ball to completely dry out."
    },
    min_temp: 14,
    max_temp: 26,
    min_env_humid: 50,
    min_soil_moist: 25,
    max_soil_moist: 55,
    min_light_lux: 1200,
    max_light_lux: 7000,
    pet_toxic: false,
    toxicity_notes: {
      de: "🐾 100% UNGIFTIG für Katzen und Hunde! Die perfekte große Zimmerpalme für Haustierhalter.",
      en: "🐾 PET SAFE: Completely non-toxic to dogs and cats according to ASPCA."
    },
    difficulty: "easy",
    pruning: {
      de: "Nur vollständig braune, vertrocknete Palmwedel an der Stammbasis abschneiden. Niemals den Haupttrieb kappen!",
      en: "Only remove completely browned fronds near the base. Never cut the apical bud."
    },
    propagation: {
      de: "Nur über Samen (in der Wohnung kaum durchführbar; Jungpflanzen kaufen).",
      en: "Propagated commercially via seed."
    },
    origin: "Lord-Howe-Insel (Australien)"
  },
  {
    id: "houseplant_dypsis_lutescens",
    name: { de: "Goldfruchtpalme (Areca-Palme)", en: "Areca Palm (Golden Cane Palm)" },
    scientificName: "Dypsis lutescens",
    synonyms: ["Goldfruchtpalme", "Arecapalme", "Areca-Palme", "Chrysalidocarpus lutescens", "Schmetterlingspalme"],
    category: "palm",
    watering_interval_days: 6,
    fertilizer_interval_days: 21,
    sunlight: "bright_indirect",
    sunlight_text: {
      de: "Sehr hell, verträgt sanfte Morgen-/Abendsonne. Braucht reichlich Licht, um Wedel nicht abzuwerfen.",
      en: "Bright indirect light. Needs good light to maintain dense fronds."
    },
    watering_text: {
      de: "Regelmäßig gießen: Feucht halten, aber kalkarmes Wasser verwenden (empfindlich gegen Kalk).",
      en: "Keep soil consistently moist using soft water."
    },
    min_temp: 16,
    max_temp: 28,
    min_env_humid: 60,
    min_soil_moist: 30,
    max_soil_moist: 60,
    min_light_lux: 2000,
    max_light_lux: 9000,
    pet_toxic: false,
    toxicity_notes: {
      de: "🐾 100% UNGIFTIG für Katzen und Hunde! Sicher für Tierhaushalte.",
      en: "🐾 PET SAFE: Non-toxic to cats and dogs."
    },
    difficulty: "medium",
    pruning: {
      de: "Braune Wedel unten entfernen. Gelbe Spitzen deuten auf zu trockene Luft hin (regelmäßig besprühen).",
      en: "Trim expired brown fronds; mist regularly to prevent brown leaf tips."
    },
    propagation: {
      de: "Teilung von Horsten beim Umtopfen.",
      en: "Clump division during repotting."
    },
    origin: "Madagaskar"
  },
  {
    id: "houseplant_chamaedorea_elegans",
    name: { de: "Bergpalme", en: "Parlour Palm (Chamaedorea)" },
    scientificName: "Chamaedorea elegans",
    synonyms: ["Bergpalme", "Parlour Palm", "Chamaedorea", "Mexikanische Bergpalme"],
    category: "palm",
    watering_interval_days: 7,
    fertilizer_interval_days: 28,
    sunlight: "partial_shade",
    sunlight_text: {
      de: "Halbschatten bis mäßig hell. Verträgt dunklere Standorte erstaunlich gut.",
      en: "Low to moderate indirect light. Very forgiving in dimmer rooms."
    },
    watering_text: {
      de: "Mäßig gießen: Obere Erdschicht antrocknen lassen.",
      en: "Water moderately; allow topsoil to dry between waterings."
    },
    min_temp: 14,
    max_temp: 26,
    min_env_humid: 50,
    min_soil_moist: 25,
    max_soil_moist: 50,
    min_light_lux: 800,
    max_light_lux: 5000,
    pet_toxic: false,
    toxicity_notes: {
      de: "🐾 100% UNGIFTIG für Haustiere (Hunde & Katzen). Klassische sichere Anfängerpalme.",
      en: "🐾 PET SAFE: Non-toxic to dogs and cats."
    },
    difficulty: "easy",
    pruning: {
      de: "Alte Wedel an der Basis abschneiden.",
      en: "Remove browned lower fronds at base."
    },
    propagation: {
      de: "Teilung beim Umtopfen.",
      en: "Division of multi-stem clumps."
    },
    origin: "Mexiko, Guatemala"
  },

  // ==========================================================================
  // 5. BLATTSCHMUCK & MARANTEN (Calathea, Maranta, Pilea, Chlorophytum)
  // ==========================================================================
  {
    id: "houseplant_pilea_peperomioides",
    name: { de: "Ufopflanze (Chinesischer Geldbaum)", en: "Chinese Money Plant (Pilea)" },
    scientificName: "Pilea peperomioides",
    synonyms: ["Ufopflanze", "Glückstaler", "Pilea", "Bauchnabelpflanze", "Missionarspflanze", "Pancake Plant", "Pilea peperomioides", "Chinesischer Geldbaum"],
    category: "foliage",
    watering_interval_days: 6,
    fertilizer_interval_days: 21,
    sunlight: "bright_indirect",
    sunlight_text: {
      de: "Viel helles, indirektes Licht. Einmal wöchentlich drehen, damit die Pflanze rundherum gleichmäßig wächst.",
      en: "Bright indirect light. Rotate weekly for balanced umbrella-like shape."
    },
    watering_text: {
      de: "Erde antrocknen lassen, dann durchdringend gießen. Staunässe lässt die Blätter abfallen.",
      en: "Allow soil to dry out between waterings. Sensitive to overwatering."
    },
    min_temp: 14,
    max_temp: 28,
    min_env_humid: 45,
    min_soil_moist: 20,
    max_soil_moist: 50,
    min_light_lux: 1500,
    max_light_lux: 7500,
    pet_toxic: false,
    toxicity_notes: {
      de: "🐾 100% UNGIFTIG für Katzen und Hunde! Perfekt geeignet für jeden Tierhaushalt.",
      en: "🐾 PET SAFE: Completely non-toxic to dogs and cats."
    },
    difficulty: "easy",
    pruning: {
      de: "Vergilbte untere Blätter entfernen. Wenn der Stamm zu lang wird, kann der Kopf gekappt und neu bewurzelt werden.",
      en: "Trim yellowed lower leaves; decapitate leggy plants to restart compact crown."
    },
    propagation: {
      de: "Bildet fleißig eigene 'Babys' (Kindel) aus der Erde, die mit kleinen Wurzeln abgetrennt und eingepflanzt werden können.",
      en: "Prolific producer of root pups that can be severed and repotted directly."
    },
    origin: "Südwest-China (Yunnan)"
  },
  {
    id: "houseplant_chlorophytum_comosum",
    name: { de: "Grünlilie (Brautschleppe)", en: "Spider Plant (Chlorophytum)" },
    scientificName: "Chlorophytum comosum",
    synonyms: ["Grünlilie", "Gruenlilie", "Brautschleppe", "Spider Plant", "Fliegender Holländer", "Sachsenblume"],
    category: "foliage",
    watering_interval_days: 6,
    fertilizer_interval_days: 21,
    sunlight: "bright_indirect",
    sunlight_text: {
      de: "Hell bis halbschattig. Extrem anspruchslos und luftreinigend.",
      en: "Bright indirect to low light. Outstanding air-purifying qualities."
    },
    watering_text: {
      de: "Mäßig gießen: Die fleischigen Speicherwurzeln verzeihen Trockenheit, faulen aber bei dauerhafter Nässe.",
      en: "Tuberous roots store water well. Allow soil to dry moderately."
    },
    min_temp: 10,
    max_temp: 28,
    min_env_humid: 40,
    min_soil_moist: 20,
    max_soil_moist: 55,
    min_light_lux: 1000,
    max_light_lux: 7000,
    pet_toxic: false,
    toxicity_notes: {
      de: "🐾 100% UNGIFTIG für Katzen und Hunde! Katzen kauen wegen der grasartigen Blätter gerne darauf herum.",
      en: "🐾 PET SAFE: Safe for pets. Cats love chewing on the grassy blades."
    },
    difficulty: "easy",
    pruning: {
      de: "Vertrocknete Spitzen stutzen. Blütenstängel nach Verblühen kürzen.",
      en: "Trim brown tips; remove old bloom stems."
    },
    propagation: {
      de: "Bildet an langen Ausläufern unzählige fertige Jungpflanzen ('Kindel'), die einfach bewurzelt werden.",
      en: "Produces abundant spiderettes on long runners that root instantly."
    },
    origin: "Südafrika"
  },
  {
    id: "houseplant_calathea_orbifolia",
    name: { de: "Korbmarante (Calathea Orbifolia)", en: "Calathea Orbifolia" },
    scientificName: "Goeppertia orbifolia",
    synonyms: ["Calathea Orbifolia", "Korbmarante", "Calathea", "Rundblättrige Korbmarante", "Goeppertia"],
    category: "foliage",
    watering_interval_days: 5,
    fertilizer_interval_days: 21,
    sunlight: "partial_shade",
    sunlight_text: {
      de: "Halbschatten, absolut keine direkte Sonne. Liebt gefiltertes, weiches Licht.",
      en: "Medium indirect light to light shade. Direct sun burns delicate leaves."
    },
    watering_text: {
      de: "Substrat stets leicht feucht halten, niemals nass. Nur kalkarmes Wasser (Regenwasser / gefiltert) verwenden – reagiert empfindlich auf Leitungswasser!",
      en: "Keep soil consistently lightly moist. Sensitive to tap water minerals; use distilled or rain water."
    },
    min_temp: 18,
    max_temp: 26,
    min_env_humid: 65,
    min_soil_moist: 35,
    max_soil_moist: 65,
    min_light_lux: 1000,
    max_light_lux: 4500,
    pet_toxic: false,
    toxicity_notes: {
      de: "🐾 100% UNGIFTIG für Hunde und Katzen! Ideal für tierliebe Pflanzenfans.",
      en: "🐾 PET SAFE: Non-toxic to cats and dogs."
    },
    difficulty: "hard",
    pruning: {
      de: "Verwelkte Blätter am Stielansatz bodennah abschneiden.",
      en: "Cut browned leaves down at the base."
    },
    propagation: {
      de: "Vorsichtige Wurzelteilung beim Umtopfen im Frühsommer.",
      en: "Careful rhizome clump division during repotting."
    },
    origin: "Bolivien"
  },
  {
    id: "houseplant_maranta_leuconeura",
    name: { de: "Gebetspflanze (Pfeilwurz)", en: "Prayer Plant (Maranta)" },
    scientificName: "Maranta leuconeura",
    synonyms: ["Gebetspflanze", "Maranta", "Pfeilwurz", "Prayer Plant", "Marante"],
    category: "foliage",
    watering_interval_days: 5,
    fertilizer_interval_days: 21,
    sunlight: "partial_shade",
    sunlight_text: {
      de: "Halbschattig bis hell indirekt. Klappt ihre Blätter abends wie betende Hände nach oben zusammen.",
      en: "Medium indirect light. Folds leaves upward at night like hands in prayer."
    },
    watering_text: {
      de: "Gleichmäßig feucht halten mit kalkarmem Wasser. Liebt hohe Luftfeuchtigkeit.",
      en: "Keep evenly moist with soft water. Appreciates high humidity."
    },
    min_temp: 17,
    max_temp: 26,
    min_env_humid: 60,
    min_soil_moist: 30,
    max_soil_moist: 60,
    min_light_lux: 1000,
    max_light_lux: 4500,
    pet_toxic: false,
    toxicity_notes: {
      de: "🐾 100% UNGIFTIG für Katzen und Hunde!",
      en: "🐾 PET SAFE: Safe for dogs and cats."
    },
    difficulty: "medium",
    pruning: {
      de: "Im Herbst zurückschneiden für buschigeren Wuchs im nächsten Frühjahr.",
      en: "Trim back stems in autumn to stimulate compact bushy growth."
    },
    propagation: {
      de: "Stammstecklinge mit Knoten oder Wurzelteilung.",
      en: "Stem cuttings taken below nodes root quickly in water."
    },
    origin: "Brasilien (Tropischer Regenwald)"
  },
  {
    id: "houseplant_tradescantia_zebrina",
    name: { de: "Zebrakraut (Dreimasterblume)", en: "Wandering Dude (Tradescantia zebrina)" },
    scientificName: "Tradescantia zebrina",
    synonyms: ["Zebrakraut", "Dreimasterblume", "Tradescantia", "Zebra-Ampelkraut", "Wandering Dude", "Inch Plant"],
    category: "foliage",
    watering_interval_days: 6,
    fertilizer_interval_days: 14,
    sunlight: "bright_indirect",
    sunlight_text: {
      de: "Hell, etwas sanfte Sonne intensiviert die lila-silberne Blattzeichnung.",
      en: "Bright indirect light with some gentle sun to maintain vivid purple hues."
    },
    watering_text: {
      de: "Mäßig gießen: Obere Erdschicht antrocknen lassen. Wächst extrem schnell.",
      en: "Allow topsoil to dry slightly; fast-growing trailing plant."
    },
    min_temp: 14,
    max_temp: 28,
    min_env_humid: 45,
    min_soil_moist: 25,
    max_soil_moist: 55,
    min_light_lux: 1500,
    max_light_lux: 7000,
    pet_toxic: true,
    toxicity_notes: {
      de: "Leicht giftig: Pflanzensaft kann bei Haustieren Hautreizungen und Magenverstimmungen auslösen.",
      en: "Mildly toxic to pets (sap can cause skin and stomach irritation)."
    },
    difficulty: "easy",
    pruning: {
      de: "Regelmäßiges Einkürzen verhindert das Verkahlen an der Basis.",
      en: "Pinch regularly to prevent bald patches near the pot rim."
    },
    propagation: {
      de: "Triebspitzen wurzeln innerhalb von 3 Tagen im Wasserglas – unzerstörbar.",
      en: "Cuttings root in water within 3-5 days."
    },
    origin: "Mexiko, Guatemala"
  },
  {
    id: "houseplant_peperomia_obtusifolia",
    name: { de: "Fleischiges Zwergpfeffer", en: "Baby Rubber Plant (Peperomia)" },
    scientificName: "Peperomia obtusifolia",
    synonyms: ["Zwergpfeffer", "Peperomie", "Peperomia obtusifolia", "Zierpfeffer", "Baby Rubber Plant"],
    category: "foliage",
    watering_interval_days: 9,
    fertilizer_interval_days: 28,
    sunlight: "bright_indirect",
    sunlight_text: {
      de: "Hell bis halbschattig ohne direkte Mittagssonne.",
      en: "Medium to bright indirect light."
    },
    watering_text: {
      de: "Mäßig gießen: Halbsukkulente dicke Blätter speichern Wasser. Substrat vor dem Gießen gut abtrocknen lassen.",
      en: "Semi-succulent: Allow soil to dry out 50% between waterings."
    },
    min_temp: 15,
    max_temp: 26,
    min_env_humid: 45,
    min_soil_moist: 15,
    max_soil_moist: 45,
    min_light_lux: 1200,
    max_light_lux: 5500,
    pet_toxic: false,
    toxicity_notes: {
      de: "🐾 100% UNGIFTIG für Katzen und Hunde! Tolle sichere Kompaktpflanze.",
      en: "🐾 PET SAFE: Safe and non-toxic to dogs and cats."
    },
    difficulty: "easy",
    pruning: {
      de: "Spitzen im Frühjahr stutzen für kompakten, buschigen Wuchs.",
      en: "Pinch in spring to encourage dense foliage."
    },
    propagation: {
      de: "Blatt- oder Triebstecklinge in Wasser oder Erde.",
      en: "Leaf or stem cuttings."
    },
    origin: "Florida, Mexiko, Karibik"
  },
  {
    id: "houseplant_dracaena_marginata",
    name: { de: "Gerandeter Drachenbaum", en: "Dragon Tree (Dracaena marginata)" },
    scientificName: "Dracaena marginata",
    synonyms: ["Drachenbaum", "Dracaena", "Gerandeter Drachenbaum", "Dracaena reflexa var. angustifolia", "Dragon Tree"],
    category: "dracaena",
    watering_interval_days: 10,
    fertilizer_interval_days: 28,
    sunlight: "bright_indirect",
    sunlight_text: {
      de: "Hell bis halbschattig. Kommt auch mit geringerer Helligkeit zurecht.",
      en: "Medium to bright indirect light, tolerates low light."
    },
    watering_text: {
      de: "Mäßig gießen: Erst wässern, wenn die obere Erdhälfte trocken ist. Staunässe führt zu Stammfäule.",
      en: "Allow top half of soil to dry before watering again."
    },
    min_temp: 15,
    max_temp: 28,
    min_env_humid: 40,
    min_soil_moist: 15,
    max_soil_moist: 45,
    min_light_lux: 1000,
    max_light_lux: 6500,
    pet_toxic: true,
    toxicity_notes: {
      de: "Giftig für Katzen und Hunde durch Saponine (Erbrechen, geweitete Pupillen bei Katzen).",
      en: "Toxic to cats and dogs (saponins cause vomiting and dilated pupils)."
    },
    difficulty: "easy",
    pruning: {
      de: "Kann bei zu langem Stamm einfach abgesägt werden; treibt unterhalb der Schnittstelle mehrfach neu aus.",
      en: "Stems can be topped; new clusters of shoots will emerge below cut."
    },
    propagation: {
      de: "Abgeschnittene Schöpfe als Kopfstecklinge im Wasserglas bewurzeln.",
      en: "Root severed crowns in water."
    },
    origin: "Madagaskar"
  },
  {
    id: "houseplant_phalaenopsis",
    name: { de: "Schmetterlingsorchidee (Phalaenopsis)", en: "Moth Orchid (Phalaenopsis)" },
    scientificName: "Phalaenopsis",
    synonyms: ["Orchidee", "Schmetterlingsorchidee", "Phalaenopsis", "Moth Orchid", "Nachtfalter-Orchidee"],
    category: "flowering",
    watering_interval_days: 8,
    fertilizer_interval_days: 21,
    sunlight: "bright_indirect",
    sunlight_text: {
      de: "Sehr hell, aber keine direkte brennende Mittagssonne. Ost- oder Westfenster sind optimal.",
      en: "Bright indirect light. East or west-facing windows are ideal."
    },
    watering_text: {
      de: "Tauchbad-Methode: Alle 7-10 Tage Topf für 15 Min. in zimmertemperiertes Wasser tauchen, danach gründlich abtropfen lassen. Luftwurzeln grün = satt, silbrig-grau = durstig.",
      en: "Soak method: Immerse inner pot for 15 mins weekly, then drain fully. Silver roots mean thirsty, green means hydrated."
    },
    min_temp: 18,
    max_temp: 28,
    min_env_humid: 55,
    min_soil_moist: 20,
    max_soil_moist: 50,
    min_light_lux: 1500,
    max_light_lux: 8000,
    pet_toxic: false,
    toxicity_notes: {
      de: "🐾 100% UNGIFTIG für Katzen und Hunde! Vollkommen unbedenkliche Blütenpflanze.",
      en: "🐾 PET SAFE: Non-toxic to dogs and cats."
    },
    difficulty: "medium",
    pruning: {
      de: "Verblühte Stängel über dem 2. oder 3. Auge einkürzen, um neuen Blütenaustrieb zu fördern.",
      en: "Cut spent flower spikes back above the 2nd or 3rd node to stimulate re-blooming."
    },
    propagation: {
      de: "Kindel (Keikis) an den Blütenstängeln abtrennen, sobald sie eigene Wurzeln haben.",
      en: "Separate keikis from flower stems once they have 3-4 roots."
    },
    origin: "Tropisches Asien & Australien"
  },
  {
    id: "houseplant_nephrolepis_exaltata",
    name: { de: "Schwertfarn (Bostonfarn)", en: "Boston Fern (Sword Fern)" },
    scientificName: "Nephrolepis exaltata",
    synonyms: ["Schwertfarn", "Bostonfarn", "Nephrolepis", "Boston Fern", "Zimmerfarn"],
    category: "fern",
    watering_interval_days: 5,
    fertilizer_interval_days: 21,
    sunlight: "partial_shade",
    sunlight_text: {
      de: "Halbschatten bis hell ohne direkte Sonne. Ideal für Badezimmer mit Fenster wegen hoher Luftfeuchte.",
      en: "Medium indirect light. Thrives in humid bathrooms."
    },
    watering_text: {
      de: "Gleichmäßig feucht halten, niemals austrocknen lassen. Kalkarmes Wasser verwenden.",
      en: "Keep soil consistently moist, never dry out completely."
    },
    min_temp: 16,
    max_temp: 25,
    min_env_humid: 65,
    min_soil_moist: 35,
    max_soil_moist: 65,
    min_light_lux: 1000,
    max_light_lux: 4500,
    pet_toxic: false,
    toxicity_notes: {
      de: "🐾 100% UNGIFTIG für Katzen und Hunde! Sicherer Klassiker.",
      en: "🐾 PET SAFE: Non-toxic to pets."
    },
    difficulty: "medium",
    pruning: {
      de: "Vertrocknete oder braune Wedel an der Basis abschneiden.",
      en: "Trim dry brown fronds at ground level."
    },
    propagation: {
      de: "Teilung des Wurzelballens im Frühjahr.",
      en: "Clump division during spring repotting."
    },
    origin: "Tropen weltweit"
  },
  {
    id: "houseplant_pachira_aquatica",
    name: { de: "Glückskastanie", en: "Money Tree (Pachira aquatica)" },
    scientificName: "Pachira aquatica",
    synonyms: ["Glückskastanie", "Glueckskastanie", "Pachira", "Money Tree", "Wasserkastanie", "Geflochtene Kastanie"],
    category: "foliage",
    watering_interval_days: 8,
    fertilizer_interval_days: 21,
    sunlight: "bright_indirect",
    sunlight_text: {
      de: "Hell mit mäßiger indirekter Sonne. Verträgt keine Zugluft und keine kalten Standorte.",
      en: "Bright indirect light. Protect from cold drafts."
    },
    watering_text: {
      de: "Mäßig gießen: Erst wässern, wenn die obersten 3-4 cm trocken sind. Stamm speichert Wasser.",
      en: "Allow top 3-4 cm to dry out. Swollen trunk base stores moisture."
    },
    min_temp: 16,
    max_temp: 28,
    min_env_humid: 50,
    min_soil_moist: 20,
    max_soil_moist: 50,
    min_light_lux: 1500,
    max_light_lux: 7500,
    pet_toxic: false,
    toxicity_notes: {
      de: "🐾 100% UNGIFTIG für Katzen und Hunde! Schöne tierfreundliche Baumform.",
      en: "🐾 PET SAFE: Non-toxic to cats and dogs according to ASPCA."
    },
    difficulty: "easy",
    pruning: {
      de: "Lange Triebe im Frühjahr stutzen, um die runde Baumkrone kompakt zu halten.",
      en: "Prune overgrown branches in spring to maintain round canopy."
    },
    propagation: {
      de: "Kopfstecklinge im Sommer.",
      en: "Stem cuttings rooted in water or moist soil."
    },
    origin: "Mittel- und Südamerika"
  },
  {
    id: "houseplant_strelitzia_nicolai",
    name: { de: "Baum-Strelitzie (Weiße Paradiesvogelblume)", en: "White Bird of Paradise (Strelitzia nicolai)" },
    scientificName: "Strelitzia nicolai",
    synonyms: ["Strelitzie", "Baum-Strelitzie", "Paradiesvogelblume", "Strelitzia nicolai", "Bird of Paradise", "Weiße Strelitzie"],
    category: "foliage",
    watering_interval_days: 7,
    fertilizer_interval_days: 14,
    sunlight: "full_sun",
    sunlight_text: {
      de: "Sehr sonnig bis vollsonnig. Benötigt das hellste Fenster der Wohnung.",
      en: "Full sun to very bright direct light. Needs abundant light."
    },
    watering_text: {
      de: "Im Sommer reichlich gießen, aber keine Staunässe. Im Winter sparsamer.",
      en: "Water thoroughly in warm months; allow top 3 cm to dry out."
    },
    min_temp: 14,
    max_temp: 30,
    min_env_humid: 55,
    min_soil_moist: 25,
    max_soil_moist: 60,
    min_light_lux: 3000,
    max_light_lux: 25000,
    pet_toxic: true,
    toxicity_notes: {
      de: "Leicht giftig für Haustiere (kann Übelkeit und Erbrechen hervorrufen).",
      en: "Mildly toxic to dogs and cats."
    },
    difficulty: "medium",
    pruning: {
      de: "Dass die Blätter mit der Zeit natürliche Risse bekommen, ist normal (Schutz vor Wind). Alte Blätter an der Basis entfernen.",
      en: "Leaves naturally split to let wind pass; remove old brown lower leaves."
    },
    propagation: {
      de: "Abtrennen von Wurzelausläufern beim Umtopfen.",
      en: "Root shoot division during repotting."
    },
    origin: "Südafrika"
  }
];

// ============================================================================
// SYNONYM & RESOLVER MAPPING
// Mappt häufige deutsche Alltagsbegriffe, Schreibweisen & Synonyme auf IDs/Botanische Namen
// ============================================================================
export const houseplantSynonyms: Record<string, string> = {
  // Spathiphyllum
  "friedenslilie": "houseplant_spathiphyllum_wallisii",
  "einblatt": "houseplant_spathiphyllum_wallisii",
  "peace lily": "houseplant_spathiphyllum_wallisii",
  "scheidenblatt": "houseplant_spathiphyllum_wallisii",
  "spathiphyllum": "houseplant_spathiphyllum_wallisii",

  // Monstera
  "monstera": "houseplant_monstera_deliciosa",
  "fensterblatt": "houseplant_monstera_deliciosa",
  "monkey leaf": "houseplant_monstera_adansonii",
  "monkey mask": "houseplant_monstera_adansonii",
  "lochpflanze": "houseplant_monstera_adansonii",
  "adansonii": "houseplant_monstera_adansonii",

  // Zamioculcas
  "glücksfeder": "houseplant_zamioculcas_zamiifolia",
  "gluecksfeder": "houseplant_zamioculcas_zamiifolia",
  "zamioculcas": "houseplant_zamioculcas_zamiifolia",
  "zamie": "houseplant_zamioculcas_zamiifolia",
  "zz plant": "houseplant_zamioculcas_zamiifolia",

  // Sansevieria
  "bogenhanf": "houseplant_sansevieria_trifasciata",
  "schwiegermutterzunge": "houseplant_sansevieria_trifasciata",
  "snake plant": "houseplant_sansevieria_trifasciata",
  "sansevieria": "houseplant_sansevieria_trifasciata",
  "sansevierie": "houseplant_sansevieria_trifasciata",

  // Epipremnum / Pothos
  "efeutute": "houseplant_epipremnum_aureum",
  "efeutüte": "houseplant_epipremnum_aureum",
  "pothos": "houseplant_epipremnum_aureum",
  "silbertute": "houseplant_scindapsus_pictus",
  "silber-efeutute": "houseplant_scindapsus_pictus",

  // Pilea
  "ufopflanze": "houseplant_pilea_peperomioides",
  "ufo pflanze": "houseplant_pilea_peperomioides",
  "glückstaler": "houseplant_pilea_peperomioides",
  "glueckstaler": "houseplant_pilea_peperomioides",
  "bauchnabelpflanze": "houseplant_pilea_peperomioides",
  "missionarspflanze": "houseplant_pilea_peperomioides",
  "pilea": "houseplant_pilea_peperomioides",
  "chinesischer geldbaum": "houseplant_pilea_peperomioides",

  // Crassula
  "geldbaum": "houseplant_crassula_ovata",
  "pfennigbaum": "houseplant_crassula_ovata",
  "dickblatt": "houseplant_crassula_ovata",
  "jade plant": "houseplant_crassula_ovata",
  "crassula": "houseplant_crassula_ovata",

  // Beaucarnea
  "elefantenfuß": "houseplant_beaucarnea_recurvata",
  "elefantenfuss": "houseplant_beaucarnea_recurvata",
  "flaschenbaum": "houseplant_beaucarnea_recurvata",
  "ponytail palm": "houseplant_beaucarnea_recurvata",

  // Ficus
  "gummibaum": "houseplant_ficus_elastica",
  "birkenfeige": "houseplant_ficus_benjamina",
  "benjamini": "houseplant_ficus_benjamina",
  "geigenfeige": "houseplant_ficus_lyrata",
  "fiddle leaf": "houseplant_ficus_lyrata",

  // Palmen
  "kentiapalme": "houseplant_howea_forsteriana",
  "kentia": "houseplant_howea_forsteriana",
  "goldfruchtpalme": "houseplant_dypsis_lutescens",
  "arecapalme": "houseplant_dypsis_lutescens",
  "areca": "houseplant_dypsis_lutescens",
  "bergpalme": "houseplant_chamaedorea_elegans",
  "glückskastanie": "houseplant_pachira_aquatica",
  "glueckskastanie": "houseplant_pachira_aquatica",

  // Alocasia / Philodendron
  "alokasie": "houseplant_alocasia_amazonica",
  "alocasia": "houseplant_alocasia_amazonica",
  "pfeilblatt": "houseplant_alocasia_amazonica",
  "zebra alokasie": "houseplant_alocasia_zebrina",
  "philodendron": "houseplant_philodendron_hederaceum",
  "birkin": "houseplant_philodendron_birkin",
  "syngonium": "houseplant_syngonium_podophyllum",
  "purpurtute": "houseplant_syngonium_podophyllum",

  // Weitere
  "grünlilie": "houseplant_chlorophytum_comosum",
  "gruenlilie": "houseplant_chlorophytum_comosum",
  "spider plant": "houseplant_chlorophytum_comosum",
  "calathea": "houseplant_calathea_orbifolia",
  "korbmarante": "houseplant_calathea_orbifolia",
  "gebetspflanze": "houseplant_maranta_leuconeura",
  "maranta": "houseplant_maranta_leuconeura",
  "zebrakraut": "houseplant_tradescantia_zebrina",
  "dreimasterblume": "houseplant_tradescantia_zebrina",
  "drachenbaum": "houseplant_dracaena_marginata",
  "orchidee": "houseplant_phalaenopsis",
  "schmetterlingsorchidee": "houseplant_phalaenopsis",
  "schwertfarn": "houseplant_nephrolepis_exaltata",
  "bostonfarn": "houseplant_nephrolepis_exaltata",
  "farn": "houseplant_nephrolepis_exaltata",
  "strelitzie": "houseplant_strelitzia_nicolai",
  "paradiesvogelblume": "houseplant_strelitzia_nicolai",
  "dieffenbachie": "houseplant_dieffenbachia_seguine",
  "kolbenfaden": "houseplant_aglaonema_commutatum"
};

// ============================================================================
// HELPER FUNCTIONS: Query Normalization & Local Search
// ============================================================================

/**
 * Normalisiert Suchbegriffe für robuste Vergleiche:
 * - Entfernt Leerzeichen & Satzzeichen
 * - Ersetzt Umlaute (ä->ae, ö->oe, ü->ue, ß->ss) für bidirektionale Toleranz
 */
export function normalizeQuery(query: string): string {
  return query
    .trim()
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss");
}

/**
 * Durchsucht den lokalen Zimmerpflanzen-Katalog anhand von Name, wissenschaftlichem Namen oder Synonymen
 */
export function searchHouseplants(query: string): Houseplant[] {
  if (!query || query.trim().length < 2) return [];

  const raw = query.trim().toLowerCase();
  const norm = normalizeQuery(query);

  // 1. Direkter Synonym-Treffer (z. B. "friedenslilie" -> "houseplant_spathiphyllum_wallisii")
  if (houseplantSynonyms[raw]) {
    const target = houseplantsData.find(h => h.id === houseplantSynonyms[raw]);
    if (target) return [target];
  }

  // 2. Normalisierter Synonym-Treffer (z. B. "gluecksfeder" -> "glücksfeder")
  for (const [syn, id] of Object.entries(houseplantSynonyms)) {
    if (normalizeQuery(syn) === norm || syn.includes(raw) || norm.includes(normalizeQuery(syn))) {
      const match = houseplantsData.find(h => h.id === id);
      if (match) return [match];
    }
  }

  // 3. Durchsuche Datenbestand (Name, ScientificName, Synonyms)
  return houseplantsData.filter(h => {
    const deNorm = normalizeQuery(h.name.de);
    const enNorm = normalizeQuery(h.name.en);
    const sciNorm = normalizeQuery(h.scientificName);
    const synsNorm = h.synonyms.map(s => normalizeQuery(s));

    return (
      deNorm.includes(norm) ||
      enNorm.includes(norm) ||
      sciNorm.includes(norm) ||
      synsNorm.some(s => s.includes(norm))
    );
  });
}

/**
 * Holt eine Zimmerpflanze anhand der ID
 */
export function getHouseplantById(id: string): Houseplant | undefined {
  return houseplantsData.find(h => h.id === id);
}
