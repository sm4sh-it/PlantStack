# Changelog

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
