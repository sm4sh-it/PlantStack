# PlantStack - Project Guidelines & Context for Antigravity

PlantStack is a modern, minimalist, resource-efficient Next.js web application designed to manage houseplants and track care routines (watering, fertilizing, pest, and fungus management).

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, React 19)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/)
- **Icons & Charts**: [Lucide React](https://lucide.dev/), [Recharts](https://recharts.org/)
- **Database & ORM**: [SQLite](https://www.sqlite.org/) via [Prisma 5](https://www.prisma.io/)
  - Database file location: `data/database.db`
  - Schema definition: `prisma/schema.prisma`
- **External APIs**: [Open Plantbook API](https://open.plantbook.io/) (configured in `.env`)
- **Deployment**: Docker multi-stage build, `docker-compose.yml`

---

## 📂 Key Directory Structure

```text
├── app/                  # Next.js App Router pages & API endpoints
│   ├── api/              # Backend endpoints (plants, locations, settings, openplantbook)
│   ├── about/            # About page
│   ├── archive/          # Archived plants view
│   ├── settings/         # App settings & preferences
│   ├── statistics/       # Statistics & charts
│   └── page.tsx          # Main dashboard view
├── components/           # Reusable UI React components
├── data/                 # Local SQLite database (database.db)
├── lib/                  # Shared utilities (prisma client, API helpers)
├── prisma/               # Prisma schema and migrations
├── public/               # Static assets & user uploaded images
└── docker-compose.yml    # Container orchestration
```

---

## 🚀 Common Commands

```bash
# Start local dev server
npm run dev

# Generate Prisma client (after schema changes)
npx prisma generate

# Push Prisma schema updates to SQLite
npx prisma db push

# Build for production
npm run build

# Start production server
npm run start

# Docker build & run
docker-compose up -d --build
```

---

## 🔒 Environment Variables (`.env`)

- `DATABASE_URL`: Path to the SQLite DB file (`"file:../data/database.db"`).
- `OPENPLANTBOOK_CLIENT_ID`: Client ID for Open Plantbook API lookup.
- `OPENPLANTBOOK_CLIENT_SECRET`: Client Secret for Open Plantbook API lookup.

---

## 🐳 Docker Permissions, SQLite & Self-Healing Architecture

> [!CAUTION]
> **CRITICAL ARCHITECTURE RULE - DO NOT RE-INTRODUCE UNPRIVILEGED `USER node` WITHOUT SELF-HEALING**
> PlantStack uses an embedded SQLite database inside a mounted volume (`/app/data`).
> SQLite requires write access to **both** the `.db` file and the parent directory (`/app/data`) for journals (`-wal`, `-journal`, `-shm`).

### The Problem with Non-Root & SQLite in Self-Hosted Setups:
1. **Existing Volumes**: Early versions (v2.x) created volume files as `root` (`0644` / `0755`). If a newer image starts as `USER node` (UID 1000), Linux permissions block writes (`EACCES`), causing Prisma to abort with `attempt to write a readonly database`.
2. **Container Managers & Config Persistence**: GUI managers like Dockhand, Portainer, or Synology Container Manager persist container creation parameters (such as `--user 1000`) across updates. Even if the image specifies `USER root`, the manager may force UID 1000 on recreated containers.
3. **Permission Trap**: If a container starts as UID 1000 and the volume is owned by root, UID 1000 cannot `chmod` or `chown` root files (*Operation not permitted*).

### The Solution (Release v3.5.8+):
1. **`Dockerfile`**: Declares `USER root` and installs `sudo` with `node ALL=(ALL) NOPASSWD: ALL`.
2. **`docker-entrypoint.sh`**:
   - `umask 000`: Ensures all newly created files/journals are writable by everyone.
   - `run_root()` helper: Executes directly as root if UID 0, or elevates via `sudo -n` if started as UID 1000.
   - Self-healing `chmod -R 777 /app/data`: Automatically reconciles volume permissions at boot.
   - Write-verification & crash-loop throttle: Prevents 1-second crash loops if volume is mounted strictly `:ro`.
   - Runs `npx prisma db push --accept-data-loss` before handing over to `node server.js`.

---

## 🌿 Git & Repository

- **Repository**: `https://github.com/sm4sh-it/PlantStack.git`
- **Default Branch**: `main`
- Ignored in Git: `/data/`, `.env`, `/public/images/*`, `/node_modules`, `/.next`
