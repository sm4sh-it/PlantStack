# PlantStack

A modern, minimalist, resource-efficient Next.js web application to manage your houseplants.

## Features
- **Responsive Dashboard**: Beautiful grid, sorted automatically by "needs care first".
- **Care Tracking**: Track watering, fertilizing, anti-bug, and anti-fungus intervals.
- **Dockerized Base**: Multi-stage Docker build resulting in a single container.
- **SQLite Database**: Entire database contained in a single file inside a Docker volume.
- **Dark Mode**: Smooth Dark/Light mode toggle.
- **External Display API**: Send local JSON requests to `/api/plants/status` for home automation tools like MagicMirror or HomeAssistant.

## Setup Instructions

### Environment Configuration
The standard setup automatically maps volumes within Docker. 
Optionally, provide your Open Plantbook API credentials via `.env` to enable automatic care instructions lookup.

#### How to get Open Plantbook API Keys:
1. Register for a free account at [open.plantbook.io](https://open.plantbook.io).
2. Once logged in, navigate to the **API keys** section in the Web UI.
3. Generate a new set of credentials (you will get a Client ID and Client Secret).
4. Copy `.env.example` to `.env` and paste your `OPENPLANTBOOK_CLIENT_ID` and `OPENPLANTBOOK_CLIENT_SECRET`.

### 🚀 Quick Start (Using Pre-built Docker Image)

This is the recommended way for users on NAS systems (Synology, Unraid, etc.) or home servers.

1. Create a `docker-compose.yml` file on your server:
   ```yaml
   version: '3.8'

   services:
     plantstack:
       image: ghcr.io/sm4sh-it/plantstack:latest
       container_name: plantstack
       restart: unless-stopped
       ports:
         - "9666:3000"
       volumes:
         - plantstack_data:/app/data
       environment:
         - NODE_ENV=production
         # Optional: Protect access with an API secret/password (see Security section below)
         # - PLANTSTACK_API_SECRET=your_secret_password_here
         # Optional: Open Plantbook credentials
         # - OPENPLANTBOOK_CLIENT_ID=your_client_id_here
         # - OPENPLANTBOOK_CLIENT_SECRET=your_client_secret_here

   volumes:
     plantstack_data:
   ```

2. Run the stack:
   ```bash
   docker-compose up -d
   ```
3. The app will be accessible at `http://localhost:9666` (or your server's LAN IP). Your database and images will persist locally within the `plantstack_data` volume.

### 🔒 Security & Access Protection

PlantStack is designed for local self-hosting and works out-of-the-box on your private home network without configuration.

- **Default LAN Mode (Open)**: If `PLANTSTACK_API_SECRET` is unset or empty, PlantStack requires no login and is freely accessible within your local network.
- **Protected Mode (Enabled)**: Set `PLANTSTACK_API_SECRET="your_strong_password"` in your `.env` or `docker-compose.yml`.
  - **Web UI**: Visiting the dashboard presents a clean lock screen. Entering your secret unlocks the jungle and issues a 30-day session cookie. You can log out anytime from the Settings page.
  - **HTTP & HTTPS Compatibility**: The session cookie works seamlessly over local plain HTTP (`http://192.168.x.x:9666`) as well as over HTTPS behind reverse proxies (Nginx, Traefik, Caddy, Cloudflare Tunnels).
  - **External Automation & Displays**: When protected mode is active, append your token to the status endpoint or provide headers:
    - Query Parameter: `GET /api/plants/status?token=your_secret_password_here`
    - Bearer Header: `Authorization: Bearer your_secret_password_here`
    - API Key Header: `X-API-Key: your_secret_password_here`

### 🛠️ Building from Source

If you want to build the Docker image yourself:
1. Clone this repository.
2. In the project root, run:
   ```bash
   docker-compose up -d --build
   ```

### Local Development Setup (Without Docker)

You will need Node.js (>= 18) installed.
1. Run `npm install`
2. Apply Prisma schema: `npx prisma db push`
3. Generate client: `npx prisma generate`
4. Run dev mode: `npm run dev`

### 📡 API Endpoint for External Displays (Smart Home)

Send a GET request to `/api/plants/status` anywhere on your LAN to get a JSON output containing all overdue plants in your collection. Perfect for MagicMirror widgets, ESPHome e-ink displays, or Home Assistant REST sensors.

