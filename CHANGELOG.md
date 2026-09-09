# Changelog

## [3.5.4] - 2026-09-09
### Fixed
- **Container Entrypoint Reset & Boot Diagnostics**: Explicitly reset base image entrypoint (`ENTRYPOINT []`) to eliminate inherited `docker-entrypoint.sh` wrapper, added recursive `chmod -R 777 /app/data` at boot, and integrated startup write verification with clear diagnostic logging to resolve and inspect volume permissions across all container management platforms.

## [3.5.3] - 2026-09-09
### Fixed
- **Seamless Docker Volume & SQLite Compatibility**: Restored container root execution (`USER root`) across production runner stages, exactly matching the proven behavior from v2.7.2. Completely resolves SQLite permission issues (`attempt to write a readonly database`) and prevents EACCES upload/restore failures for all existing and new deployments without requiring manual host interventions.

## [3.5.2] - 2026-09-09
### Fixed
- **Docker Volume Self-Healing & Diagnostics**: Enhanced `docker-entrypoint.sh` with recursive write-permission granting (`chmod -R a+rwX /app/data`), safe error suppression for non-POSIX volume drivers, and startup diagnostic logging (`[plantstack-entrypoint]`) to verify privilege dropping and identify cached container layers.

## [3.5.1] - 2026-09-09
### Fixed
- **Docker SQLite Data Volume Permissions (`attempt to write a readonly database`)**: Resolved permission conflicts on mounted persistent volumes (`/app/data`). Introduced a dedicated `docker-entrypoint.sh` with `su-exec` that automatically reconciles ownership (`chown -R node:node /app/data`) on container startup before dropping privileges to the unprivileged `node` user for Prisma migrations and server runtime.

## [3.5.0] - 2026-09-09
### Added
- **Optional Access Protection & Authentication Gate**: Added configurable password/API secret protection (`PLANTSTACK_API_SECRET`). Supports a clean Botanical lock screen for web browsers with a persistent session, while keeping open LAN mode as zero-friction default for local setups.
- **Seamless Local HTTP & HTTPS Support**: Session handling and routing automatically detect protocol context, operating reliably across local unencrypted LAN environments (`http://192.168.x.x:9666`) and HTTPS reverse-proxy deployments.
- **Smart Home & Automation Token Integration**: Machine-to-machine integrations (Home Assistant, ESP32, MagicMirror) can authenticate to `/api/plants/status` via `?token=` parameter, Bearer tokens, or API keys.
- **Settings Session Management**: Active sessions can now be viewed and ended directly from the Settings page.

### Changed
- **Media Upload Pipeline Hardening**: Added strict binary signature (magic bytes) verification, MIME validation, and file size boundaries across all image upload handlers.
- **Backup Archive Safety & Integrity**: Enhanced backup import with strict pre-validation, extraction boundaries, and path traversal defenses prior to database operations.
- **Container Privilege & Runtime Hardening**: Multi-stage Docker production image now runs under an unprivileged `node` user with explicit SQLite data volume ownership.
- **HTTP Security & Rate Limiting**: Enforced standard HTTP security headers, proxy-compatible request validation, and in-memory rate limiting for third-party catalog lookups.

## [3.4.0] - 2026-09-09
### Added
- **Dark Mode SVG Color Adaptability**: Recharts SVG graph elements in `StatisticsClient` now bind directly to CSS color tokens (`var(--care-water)`, `var(--brand)`, and `var(--border-hairline)`). Chart bars and scatter points dynamically transition from deep moss green to vibrant emerald and sky blue in dark mode.
- **Optimistic Touch Feedback for All Routines**: Instant visual feedback (`Behandelt ✓`, `Gegossen ✓`, `Gedüngt ✓`) is now rendered directly inside mobile action buttons upon touch for all four care disciplines.
- **Secondary Pages Design Alignment**: Modernized `Archive` ("The lost ones" with subtle hover-lift), `Settings` (5 clean `card-elevation` sections with hairline dividers), and `About` (dynamic Markdown release parsing).

### Changed
- **Accessible FAB Focus & Dark-Mode Scrims**: Mobile Floating Action Button (`+`) now uses `focus:ring-offset-surface` to eliminate harsh white focus rings in dark mode.
- **Seamless Modal Transitions**: `ConfirmModal` and `OnboardingModal` now feature high-contrast, backdrop-blurred (`backdrop-blur-md`) layers with zero harsh border strokes.
- **Zero-Refresh Internal Navigation**: Converted footer links and modal buttons to native Next.js `<Link>` instances for instant client-side routing.

## [3.3.0] - 2026-09-08
### Added
- **Zero-CLS Floating Autocomplete**: OpenPlantbook search suggestions in `PlantForm` now float in an absolute z-index dropdown (`absolute top-full z-30 mt-1 shadow-2xl`), entirely eliminating Cumulative Layout Shifts during plant creation.
- **Interactive Drag & Drop Dropzone**: Replaced standard file pickers with an accessible drag-and-drop dropzone featuring dashed hairline boundaries, drag-over highlights, and an integrated thumbnail preview with replace and delete actions.
- **Gamification & Insights Revamp**: Added 4 prominent KPI metric cards on `card-elevation` surfaces (Active Plants, Estimated Water, Survival Rate, Oldest Plant), 6 mystery/teaser badge slots, rounded horizontal Recharts bars (`radius: [0, 6, 6, 0]`), and floating borderless tooltips.
- **Comprehensive Routine Tracking in Stats**: Monthly and annual activity counters now fully aggregate pest treatments (`BUG`) and fungus applications (`FUNGUS`) alongside water and fertilizer.

### Changed
- **44px Form Field Standards**: All inputs, selects, and action buttons in `PlantForm` now strictly adhere to 44px touch targets (`h-11`) and 8px border radii (`rounded-lg`).
- **Semantic Care Inputs**: Routine interval inputs now illuminate in their specific care color rings on focus (Blue for Water, Amber for Fertilizer, Purple for Pest, Teal for Fungus).

## [3.2.0] - 2026-09-08
### Added
- **Mobile 5-Slot Thumb-Zone Navigation**: Introduced an ergonomic bottom navigation bar on mobile viewports (<768px) with 5 dedicated slots: *Dschungel* (`/`), *Statistiken* (`/statistics`), a prominent central Floating Action Button `+` for instant plant creation, *Archiv* (`/archive`), and *Settings* (`/settings`).
- **Zero-Layout-Shift Desktop Topbar**: Applied `scrollbar-gutter: stable` to the desktop header, preventing subtle horizontal shifts when switching between scrollable and static pages.
- **Dual-Ergonomics Plant Cards (`PlantCard.tsx`)**:
  - *Desktop*: 60% hero photo, dark-scrim photo badges (`bg-neutral-900/80 text-white`), and a flat single-row 4-pill quick-action strip.
  - *Mobile*: 44px prominent primary urgency touch-button directly in the thumb zone, with secondary care intervals neatly displayed beneath.
- **Botanical Studio Modal (`PlantDetailsModal.tsx`)**:
  - *Desktop (md+)*: 2-column studio layout featuring 42% visual hero and photo timeline on the left, and 58% care profiles, environmental parameters, and history on the right.
  - *Mobile (<md)*: 2-tab bottom sheet separating "Pflege & Details" from "Tagebuch & Historie" with 100% WCAG AAA readability (plant titles and botanical names sit cleanly on surface background below photo).

### Changed
- **Streamlined Modal Footers**: Eliminated the redundant, ambiguous "Pflegen" bulk button from the modal footer in favor of precise 1-click routine triggers.
- **Actionable Pest Terminology**: Standardized pest routine naming to "Bekämpfen" (Treat / Combat) to reflect active treatments (e.g., neem oil, soap spray) rather than passive inspection.

## [3.1.0] - 2026-09-07
### Added
- **Botanical Modernism Design System 2.0**: Completely transitioned the design architecture to semantic CSS tokens (`--bg-canvas`, `--bg-surface`, `--bg-surface-subtle`, `--text-primary`, `--border-hairline`) documented in `DESIGN_GUIDE.md` and interactive showcase `public/design-guide.html`.
- **Strict Care Color Continuity**: Established permanent, immutable color families across all components:
  - *Water*: Deep Blue (`--care-water` / `#0D638F` in light, `#38BDF8` in dark)
  - *Fertilizer*: Amber (`--care-fertilizer` / `#995B00` in light, `#FBBF24` in dark)
  - *Pest Protection*: Purple (`--care-bug` / `#7E22CE` in light, `#C084FC` in dark)
  - *Fungus Protection*: Teal (`--care-fungus` / `#0F766E` in light, `#2DD4BF` in dark)
- **Harmonized Radius Hierarchy**: Replaced arbitrary pill shapes with strict semantic radii: 6px (`rounded-md`) for badges/tags, 8px (`rounded-lg`) for buttons/inputs, 12px (`rounded-xl`) for cards, and 16px/24px (`rounded-2xl`/`3xl`) for modals.

### Changed
- **Zero-Wireframe / Anti-Outline Standard**: Completely removed all harsh white and neon border strokes (`border-white`, `border-white/20`) and nested card-in-card boxes, establishing visual hierarchy through whitespace, subtle hairline dividers, and soft tint fills.

## [3.0.0] - 2026-09-06
### Added
- **Full Backup & Restore (ZIP / JSON)**: Self-hosters can now create complete 1-click backups containing all database records (`data.json`) and uploaded plant photos directly from the Settings page. Backups can be restored transactionally with automatic volume file synchronization.
- **Growth Photo Diary (Photo History)**: Added a multi-photo growth timeline for each plant. Users can document repotting, new leaves, or seasonal progress with timestamped photos, notes, and an integrated high-resolution lightbox.
- **Care History Timeline (Pflege-Protokoll)**: Plant details now showcase a chronological, visual timeline of all recent care activities (watering, fertilizing, pest, fungus, and planting events) with relative and exact timestamps.
- **Intelligent Winter Dormancy (Dormancy Mode)**: Added seasonal dormancy logic for winter months (November to February). When enabled, watering intervals are automatically lengthened by 50% and fertilizing is safely paused to prevent root rot and overwatering.

## [2.10.0] - 2026-09-03
### Added
- **PWA (Progressive Web App) Support**: Added complete `public/manifest.json`, Web App icons, theme color definitions for dark and light modes, and iOS standalone full-screen web app capabilities.
- **Botanical Modernism Confirm Dialog (`ConfirmModal`)**: Replaced all native, blocking `window.confirm()` dialogs across the app (archive, deletion, batch actions, settings resets) with an accessible, high-contrast, backdrop-blurred modal component.
- **Subtle Feedback Banners & Toasts**: Replaced all native `window.alert()` calls across `PlantForm`, `Settings`, and `Archive` with fluid inline error banners and floating feedback toasts.

### Changed
- **Accessible 44×44px Touch Targets**: Enlarged all action buttons on `PlantCard` (`Droplet`, `Sparkles`, `Bug`, `ShieldAlert`) to guarantee comfortable one-handed operation directly at the flowerpot.
- **4-Tier Gentle Urgency**: Replaced binary overdue styling with a 4-tier visual hierarchy (*Overdue* terracotta badge, *Due Today* amber badge, *Due Soon* soft amber, and *In Schedule* subtle neutral).
- **Dynamic Care Layout in `PlantCard`**: Replaced rigid empty slots (`<div />`) with a fluid flex layout rendering only active care intervals.
- **Harmonized Localization**: Eliminated mixed-language string outputs (`2 d late` is now cleanly localized as `2 Tage überfällig` in German and `2 days overdue` in English).

## [2.9.0] - 2026-08-31
### Added
- **Inline Location Creation**: Rooms can now be created on-the-fly directly inside the `PlantForm` modal via a dedicated `+` button without interrupting the creation flow.
- **Automatic Default Room Initialization**: Clean installations now automatically seed a default location ("Wohnzimmer" / "Living Room") on initial setup, preventing onboarding errors.
- **Dashboard Search & Filter Controls**: Added a real-time search field (filtering by name, botanical name, alias, and room) alongside fast filter chips (`Alle`, `Fällig`, `Drinnen`, `Draußen/Balkon`).
- **Batch Watering Action**: Header action button to water all currently due plants simultaneously with one click.
- **Care Action Undo Toast**: Non-intrusive floating toast notifications with an instant "Undo" button to safely revert accidental taps.
- **Snooze Functionality**: Added a "Postpone 2 days" option in the plant card menu to delay watering without distorting history when soil is still moist.

## [2.8.0] - 2026-08-28
### Fixed
- **Weather Interval Stability (4h-Jitter Fix)**: Weather tiers (`weatherRainTier`, `weatherHeatTier`, `weatherFrostWarning`) are now permanently cached in `AppConfig`. Outdoor and balcony plant intervals remain stable across all requests instead of resetting on non-sync requests.
- **Plant Edit Data Loss**: Fixed a bug in `PUT /api/plants/[id]` where `placement` (Drinnen/Draußen/Balkon) and `plantType` (Zierpflanze/Nutzpflanze) were omitted during update, ensuring edits are properly persisted.
- **Botanical Detail Matching**: `PlantDetailsModal` now prioritizes the plant's stored `apiId` directly instead of executing ambiguous free-text searches on custom plant nicknames.

### Changed
- **Comprehensive Care Event Logging**: `PlantEvent` records now capture `BUG` and `FUNGUS` treatments in addition to watering and fertilizing for complete care history tracking.
- **Dependency & Type Harmonization**: Upgraded `lucide-react` to official React 19 peer support and aligned `@types/react` and `@types/react-dom` to `^19.0.0`.

## [2.7.2] - 2026-05-19
### Changed
- **i18n Translation Update**: Fully mapped all newly added features and UI elements into the central translation dictionary. This includes specific translations for the Plant Modal (Environment, Room, Classification) and accurate translations for the Statistics Radar Chart axes.
- **i18n Settings Sweep**: Replaced all remaining hardcoded UI texts in the Settings panel with translation variables, ensuring 100% localization support for alerts and confirmation dialogs.

## [2.7.1] - 2026-05-19
### Changed
- **Weather Logic Multipliers**: Drastically increased the heat reduction multipliers for "Draußen" and "Balkon" to 40% (Tier 1) and 70% (Tier 2).
- **Garden Vibe Chart Polish**: Stripped numbers, axes ticks, and tooltips from the Radar Chart to create a purely abstract, visual representation of the garden.
- **Plant Modal UI**: Refined the grid layout for the "Add Plant" modal, splitting "Umgebung" and "Raum" into side-by-side columns and adding custom tooltips.
- **Empty State UX**: The dashboard's "empty state" placeholder icon is now fully interactive and launches the "Add Plant" modal.
- **Footer**: Updated the global footer text and automatically linked it to the `package.json` version.

## [2.7.0] - 2026-05-18
### Added
- **Advanced Statistics Revamp**: Implemented a major layout overhaul on the Statistics page. The "survival coordinates" section is now a dynamic dual-chart responsive grid featuring two stunning data visualizations.
- **Garden Vibe Radar Chart**: Added an all-new 6-axis Radar Chart visualization summarizing the average profile of your entire garden based on Durst, Lichthunger, Pflegeleichtigkeit, Artenvielfalt, Nutzgarten-Anteil, and Freiluft-Faktor.
- **Database Expansion**: Added new `plantType` (Zierpflanze vs Nutzpflanze) and `placement` (Drinnen, Draußen, Balkon) fields to the core database model to better classify your jungle.
- **Smart Add Plant UI**: Added the new classification dropdowns to the Add Plant modal with smart default selections based on the data origin (OpenPlantbook vs Local Crops).

### Changed
- **Balcony Weather Logic**: Completely overhauled the weather-based watering logic. "Balkon" plants now ignore rain entirely but aggressively reduce their watering interval in high heat (>25°C & >30°C) using a new tiered, percentage-based approach. "Draußen" plants also utilize the new percentage tiers for heat and rain thresholds.
- **Fadenkreuz Scatter Plot**: Redesigned the Matrix into a clean, borderless "Fadenkreuz" (crosshair) aesthetic with absolute edge labels.
- **Jitter Engine**: Implemented an automated random coordinate offset (jitter) to the Scatter Plot data. Plants with identical needs no longer hide behind each other, forming organic data clusters instead.
- **Focus Rings Removed**: Unwanted browser focus outlines on Recharts elements have been entirely suppressed.

## [2.6.3] - 2026-05-18
### Changed
- **About Page Layout**: Slightly widened the content area on desktop for better readability while perfectly maintaining the mobile experience.
- **Chart Contrast & Formatting**: Explicitly boosted text legibility for the chart axes in Dark Mode and removed unwanted focus/click outlines on interactive elements. Adjusted the "survival coordinates" layout to utilize more horizontal space on smaller screens.

## [2.6.2] - 2026-05-11
### Fixed
- **Dashboard Visibility**: Fixed a bug where archived plants would still erroneously show up on the main Dashboard instead of being exclusively listed in the "The lost ones" archive.

## [2.6.1] - 2026-05-11
### Added
- **OpenPlantbook Integration**: Improved support and mapping for the external API.
### Changed
- **UI & Formatting**: Renamed "Pet Sematary" to "The lost ones" and updated the "Green Thumb Matrix" to "survival coordinates". 
- **Matrix Improvements**: The Y-Axis now features proper vertical, multi-line labels ("Wasser Junkie" & "Kaktus Vibes") and the scatter points translate raw sunlight data (like `Full_Sun`) into readable localized terms.

### Shoutout / Special Thanks
Huge shoutout to slaxor505 for adding the 'Origin' field to the OpenPlantbook API! (https://github.com/slaxor505/OpenPlantbook-client)

## [2.6.0] - 2026-05-10
### Added
- **Gamification "New Season"**: You can now reset your Gamification Badges via the Settings menu without deleting your plants. This starts a "New Season", meaning only plants and watering activities added *after* the reset will count towards unlocking new badges!
- **Statistics Wipe**: Added a dedicated button to clear your watering history and activity logs, leaving your plants and unlocked badges intact.
- **Privacy & Data Section**: Introduced a new settings category to safely manage and reset your data.

## [2.5.0] - 2026-05-09
### Added
- **Gamification Expansion**: Introduced new badges: Castle, Haunted Castle, Diversity Tiers (Bronze, Silver, Gold), and Mediterranean Mix!
- **Survival Rate**: Track your success with the new Survival Rate metric on the Statistics page.
- **Enhanced Localizations**: "Water" mapping has been changed to "Conditions" (Bedingungen). Sun exposure levels are now properly translated to the active language.
- **Green Thumb Matrix**: The scatter plot now properly lists axis labels (e.g. Schattenparker -> Sonnenanbeter) and is fully compatible with Light and Dark Mode.
- **Dynamic Pruning Rules**: Plant pruning rules dynamically update to match the active language setting instead of staying locked to the language used when creating the plant.
### Changed
- **Archive Icon**: The Archive nav icon has been changed to a Ghost.
- **Footer**: The application footer now prominently displays the current app version.
- **Statistics Layout**: Charts and action logs have been re-arranged for better UX. Action logs now show the Monthly Breakdown along with the Yearly Total.

## [2.4.0] - 2026-05-03
### Added
- **Gamification & Statistics**: Introduced a brand new Statistics page! You can now track how much water your jungle consumes, view your top thirsty plants, and earn fun Badges like "Rainmaker" and "Botany Nerd".
- **Plant Archive**: Instead of permanently deleting plants, they are now sent to the "Pet Sematary" archive. You can revive them later or compost them permanently.


## [2.3.2] - 2026-04-28
### Fixed
- **Localization**: All section labels in the plant detail pop-up (Pruning, Sowing, Good/Bad Neighbors) are now fully translated based on the active language setting.
- **Month Names**: Sowing months are now displayed as real month names ("Mai" / "May") instead of raw numbers ("5").
- **Neighbor Names**: Neighbor IDs (e.g. `crop_lemon_balm`) are now resolved to their localized plant names ("Zitronenmelisse" / "Lemon Balm"). Unknown IDs are filtered out.
- **Language Reactivity**: Changing the app language now correctly re-fetches and re-renders all localized detail data.

## [2.3.1] - 2026-04-27
### Changed
- **UI Adjustments**: Reduced the size of the Logo, Version text, and Heading on the About page.
- **Card Cleanup**: Removed the 'Pruning Season' tag from the dashboard plant cards for a cleaner look. Changed the outdoor sun icon to a tree icon.
- **Enhanced Plant Details**: The detailed pop-up view now dynamically fetches and displays extended local data (like Good/Bad Neighbors and Outdoor Sowing Months).
- **Translations**: Fixed the German 'Add Plant' button text.
## [2.3.0] - 2026-04-26
### Added
- **Local Crops DB**: Introduced a new offline-first local database (`lib/crops.ts`) containing exact care data for common vegetables, herbs, berries, and fruits.
- **Smart Search**: The search function now uses a two-stage strategy. It first checks the local database for German and English names before falling back to Open Plantbook. This provides perfectly tailored watering and sunlight instructions instantly.

### Changed
- **Location UI**: Redesigned the "Indoor / Outdoor" selector in the Add Plant form. It is now a modern segmented switch instead of a cramped dropdown.
## [2.2.0] - 2026-04-26
### Changed
- **Major Upgrade**: Upgraded core framework to Next.js 15 and React 19.
- **Security Patch**: Mitigated vulnerabilities in deep npm dependencies (`minimatch`, `glob`, `tar`, `cross-spawn`) via version overrides.
- **Docker Base**: Updated Docker Alpine image to Node 22 to fix OS-level vulnerabilities (e.g., `busybox`).
- **Codebase Refactor**: Refactored API routes to use Next.js 15 async route parameters.
## [2.1.0] - 2026-04-26
### Added
- **Outdoor Plants & Weather Logic**: Define outdoor plants and get dynamic watering adjustments based on Open-Meteo weather forecasts.
- **Pruning Season**: Automatically fetch and display pruning months for outdoor plants from Open Plantbook.
- **Smart Location**: Search for cities and save GPS coordinates directly in Settings.
- **About Page**: You are looking at it! Built-in changelog and version info.

### Fixed
- Resolved an issue where optional dates (like last fertilized) would calculate incorrectly (1970 bug) if they were never set. They now properly default to the creation date or display "Not set".

## [2.0.0] - 2026-04-24
### Added
- Migrated entirely from Perenual API to Open Plantbook API.
- Implemented robust server-side OAuth2 flow with token caching.
- Enhanced plant search with auto-mapping of sensor values (Temperature, Humidity, Soil Moisture).
- Automated CI/CD for Docker image publishing.

## [1.0.0] - Initial Release
- Basic plant tracking, watering schedules, and location management.
- Multi-language support (EN, DE).
