# Changelog

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
