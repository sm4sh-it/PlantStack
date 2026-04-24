export type Locale = "en" | "de";

export const translations = {
  en: {
    // Navigation
    settings: "Settings",
    // Dashboard
    myJungle: "My Jungle", // Fallback if no custom title
    rooms: "Rooms",
    careNeeded: "Care Needed",
    az: "A-Z",
    addPlant: "Add Plant",
    noPlantsYet: "No plants yet",
    startBuildingJungle: "Start building your indoor jungle by adding your first houseplant.",
    addFirstPlant: "Add Your First Plant",
    needsCare: "Needs Care!",
    // Plant Card
    water: "Water",
    fertilize: "Fertilize",
    bugTreatment: "Bug Treatment",
    fungusTreatment: "Fungus Treatment",
    edit: "Edit",
    delete: "Delete",
    daysOverdue: "days overdue",
    daysLeft: "d", // short for days
    // Settings
    configureApp: "Configure your app and manage locations.",

    save: "Save",
    locationsRooms: "Locations (Rooms)",
    manageAreas: "Manage the areas where you keep your plants.",
    add: "Add",
    noLocations: "No locations created yet.",
    // New settings
    language: "Language",
    gridColumns: "Dashboard Grid Columns (Desktop)",
    customTitle: "Custom Dashboard Title",
    // Modal
    scientificName: "Scientific Name",
    sunlight: "Sunlight",
    notes: "Notes",
    close: "Close",
    searchAlias: "Search Name (Alias)",
    temperature: "Temperature",
    humidity: "Humidity",
    soilMoisture: "Soil Moisture"
  },
  de: {
    // Navigation
    settings: "Einstellungen",
    // Dashboard
    myJungle: "Mein Dschungel",
    rooms: "Räume",
    careNeeded: "Pflege fällig",
    az: "A-Z",
    addPlant: "Pflanze +",
    noPlantsYet: "Noch keine Pflanzen",
    startBuildingJungle: "Füge deine erste Pflanze hinzu, um deinen Urban Jungle zu starten.",
    addFirstPlant: "Erste Pflanze anlegen",
    needsCare: "Braucht Pflege!",
    // Plant Card
    water: "Gießen",
    fertilize: "Düngen",
    bugTreatment: "Insektizid",
    fungusTreatment: "Fungizid",
    edit: "Bearbeiten",
    delete: "Löschen",
    daysOverdue: "Tage überfällig",
    daysLeft: "T", // short for Tage
    // Settings
    configureApp: "Passe die App an und verwalte deine Räume.",

    save: "Speichern",
    locationsRooms: "Räume (Locations)",
    manageAreas: "Verwalte die Bereiche, in denen deine Pflanzen stehen.",
    add: "Hinzufügen",
    noLocations: "Noch keine Räume angelegt.",
    // New settings
    language: "Sprache (Language)",
    gridColumns: "Dashboard Raster (Desktop)",
    customTitle: "Eigener Dashboard-Titel",
    // Modal
    scientificName: "Botanischer Name",
    sunlight: "Sonnenlicht",
    notes: "Notizen",
    close: "Schließen",
    searchAlias: "Rufname (Suchen)",
    temperature: "Temperatur",
    humidity: "Luftfeuchtigkeit",
    soilMoisture: "Bodenfeuchtigkeit"
  }
};

export function t(key: keyof typeof translations.en, lang: string = "en") {
  const dictionary = translations[lang as Locale] || translations.en;
  return dictionary[key] || translations.en[key] || key;
}
