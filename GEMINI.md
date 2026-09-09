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

## 🌿 Git & Repository

- **Repository**: `https://github.com/sm4sh-it/PlantStack.git`
- **Default Branch**: `main`
- Ignored in Git: `/data/`, `.env`, `/public/images/*`, `/node_modules`, `/.next`
