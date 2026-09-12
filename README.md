<p align="center">
  <img src="public/logo-green.svg" alt="PlantStack Logo" width="80" height="80" />
</p>

<h1 align="center">PlantStack</h1>

<p align="center">
  <strong>A modern, minimalist, resource-efficient plant care management system for self-hosters.</strong><br>
  Built with Next.js 15, React 19, Tailwind CSS, Prisma & SQLite.
</p>

<p align="center">
  <a href="https://github.com/sm4sh-it/PlantStack/releases"><img src="https://img.shields.io/github/v/release/sm4sh-it/PlantStack?color=10B981&label=Release" alt="Release"></a>
  <a href="https://ghcr.io/sm4sh-it/plantstack"><img src="https://img.shields.io/badge/Docker-ghcr.io-blue?logo=docker" alt="Docker"></a>
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" alt="Next.js 15">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React 19">
  <img src="https://img.shields.io/badge/Database-SQLite%20%2F%20Prisma-4ade80?logo=sqlite" alt="SQLite">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-PolyForm_Noncommercial-blue" alt="License: PolyForm Noncommercial 1.0.0"></a>
</p>

---

## 🌿 Overview

**PlantStack** is a self-hosted web companion designed to keep your indoor jungle and balcony garden thriving without unnecessary complexity or cloud lock-in. It sorts your collection automatically by urgency, keeps track of routine and long-term care events, records photo timelines, and seamlessly integrates with your home automation.

---

## 📸 Screenshots & Showcase

<p align="center">
  <img src="docs/screenshots/dashboard-preview.png" alt="PlantStack Dashboard Preview" width="850" onerror="this.style.display='none'" />
</p>

<details open>
  <summary><strong>🖼️ Click to expand preview gallery</strong></summary>
  <br>
  <table align="center">
    <tr>
      <td width="50%" align="center">
        <strong>🌿 Botanical Studio & Care Modal</strong><br><br>
        <img src="docs/screenshots/plant-details.png" alt="Plant Details Modal" onerror="this.src='https://placehold.co/600x400/18181b/10B981?text=Plant+Details+Modal'" />
      </td>
      <td width="50%" align="center">
        <strong>📱 Mobile PWA & Ergonomic Dock</strong><br><br>
        <img src="docs/screenshots/mobile-pwa.png" alt="Mobile PWA Dock" onerror="this.src='https://placehold.co/600x400/18181b/10B981?text=Mobile+5-Point+Dock'" />
      </td>
    </tr>
    <tr>
      <td width="50%" align="center">
        <strong>📈 Vitality Curves & Gamification</strong><br><br>
        <img src="docs/screenshots/statistics.png" alt="Statistics & Badges" onerror="this.src='https://placehold.co/600x400/18181b/10B981?text=Statistics+%26+Badges'" />
      </td>
      <td width="50%" align="center">
        <strong>📷 Growth Diary & Photo Timeline</strong><br><br>
        <img src="docs/screenshots/photo-diary.png" alt="Photo Diary" onerror="this.src='https://placehold.co/600x400/18181b/10B981?text=Growth+Photo+Diary'" />
      </td>
    </tr>
  </table>
</details>

---

## ✨ Key Features

### 🎨 Botanical Modernism & Ergonomics
- **OLED-Optimized Dark & Light Modes:** Borderless, soft-tint visual hierarchy (*Anti-Outline Standard*) eliminating distracting white contours.
- **Progressive Web App (PWA):** Installable on iOS & Android with standalone fullscreen display and custom app icons.
- **5-Point Mobile Dock:** Seamless thumb-zone navigation between Dashboard, Statistics, Quick-Add `+`, Archive, and Settings.
- **One-Handed Care:** Enlarged 44px touch targets designed for comfortable operation directly at the flowerpot.
- **Configurable Grid Layout:** Choose anywhere between 1 to 6 columns to adapt to phones, tablets, or ultrawide monitors.

### 🪴 Complete Care Tracking & Long-Term Retention
- **4-in-1 Routine Tracking:** Water 💧, Fertilizer ✨, Pest Combat 🐛, and Fungus Protection 🛡️.
- **1-Click Pruning & Repotting:** Dedicated actions for pruning (✂️) and repotting (🪴) with dual-storage architecture, ensuring long-term milestones are never displaced by frequent watering logs.
- **4-Tier Gentle Urgency:** Instant visual clarity (*Overdue*, *Due Today*, *Due Soon*, *In Schedule*).
- **Batch Watering:** Water all currently due plants with a single tap.
- **Snooze (+2 Days):** Postpone care when soil is still moist without falsifying historical care intervals.
- **Instant Undo:** Non-intrusive toast notifications to revert accidental taps immediately.

### 📷 Growth Photo Diary & Historical Logs
- **Multi-Photo Timeline:** Document leaf unfurlings, repottings, and seasonal growth with high-res photos, timestamps, and notes.
- **Collapsible Care History:** Transparent chronological event log tracking every historical action.

### 🌦️ Local Weather & Intelligent Winter Dormancy
- **Open-Meteo Weather Sync:** Automatically tracks precipitation, heat tiers, and issues outdoor frost warnings.
- **Winter Dormancy Mode:** Automatically extends watering intervals by 50% and safely pauses fertilizer from November to February to prevent overwatering and root rot.

### 🔍 Botanical Intelligence (Open Plantbook)
- **Zero-CLS Autocomplete:** Fast lookup for scientific names, natural origin, sunlight requirements, soil humidity, and watering intervals via [open.plantbook.io](https://open.plantbook.io).

### 📊 Analytics & Gamification
- **Vitality Curves & KPI Cards:** Total water estimates, active plant count, survival rate, and oldest plant.
- **Unlockable Badges:** Gamified achievement milestones with live teaser progress bars.

### 💾 1-Click Backup & Data Portability
- **Full ZIP Export/Import:** Download or restore your entire SQLite database and uploaded photo volume in one file directly from the Settings UI.

---

## 🚀 Quick Start (Docker Compose)

The fastest and most reliable way to run PlantStack on your home server or NAS (Synology, Unraid, TrueNAS, Raspberry Pi).

```yaml
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
      # Optional: Protect access with an API secret/password (see Security below)
      # - PLANTSTACK_API_SECRET=your_secret_password_here
      # Optional: Open Plantbook credentials for automated care data lookup
      # - OPENPLANTBOOK_CLIENT_ID=your_client_id_here
      # - OPENPLANTBOOK_CLIENT_SECRET=your_client_secret_here

volumes:
  plantstack_data:
```

Launch the stack:
```bash
docker compose up -d
```
Access the web dashboard at `http://<your-server-ip>:9666`.

---

## 🔒 Security & Self-Healing Architecture

### Access Control
- **Open LAN Mode (Default):** If `PLANTSTACK_API_SECRET` is unset, PlantStack requires zero login credentials on your private home network.
- **Protected Mode:** Set `PLANTSTACK_API_SECRET="your_strong_password"`. Visiting the UI displays an elegant botanical lockscreen and issues a secure 30-day session cookie (compatible with both plain local HTTP and reverse-proxy HTTPS).

### 🐳 Self-Healing SQLite Volume Permissions
Early Docker setups often suffer from `attempt to write a readonly database` when container managers (e.g. Synology Container Manager, Portainer, Dockhand) enforce unprivileged user IDs (`--user 1000`) on existing root-owned volumes.
- **Release v3.5.8+** introduces an automated self-healing startup entrypoint (`docker-entrypoint.sh`).
- Operates with permissive `umask 000`, reconciles volume permissions (`chmod -R 777 /app/data`), and provides passwordless `sudo` elevation if started as UID 1000.
- Guarantees seamless, zero-touch upgrades without manual SSH file permission fixes.

### Hardened Application Pipeline
- **Strict Media Validation:** Uploads are checked against binary magic-byte signatures (JPEG, PNG, WebP) and size limits.
- **Safe Archives:** Backup decompression features path-traversal protection and zip-bomb thresholds.
- **Security Headers & CSRF:** Enforced modern HTTP headers and origin checks for mutating requests.

---

## 🤖 Vibe Coded with Gemini & Rigorously Audited

PlantStack is proudly **vibe-coded in pair-programming with Google Gemini (via the Antigravity CLI)** — embracing rapid iteration, modern React 19 / Next.js 15 paradigms, and high feature velocity.

However, rapid AI prototyping never comes at the expense of software quality or safety:
- 🛡️ **Comprehensive Security Audits:** Every major milestone undergoes structured security reviews (CWE audits covering OWASP Top 10 vulnerabilities).
- 🔒 **Defense-in-Depth:** Features strict binary magic-byte verification for image uploads, zip-bomb & path-traversal mitigation for backups, CSRF protection, and configurable single-secret access gates.
- 🐳 **Production-Grade Resilience:** Engineered with a self-healing container permission architecture specifically tested against real-world self-hosting environments (Synology NAS, Unraid, Portainer).

*Proof that modern AI pair-programming and solid engineering discipline make an unbeatable team.*

---

## 📡 Smart Home & Automation Integration

PlantStack provides an external status API designed for home automation widgets, MagicMirror modules, and ESPHome / e-ink bedside displays.

Send a `GET` request to:
```http
GET /api/plants/status
```

Returns a compact JSON list of all currently overdue plants, days overdue, and care recommendations. If Protected Mode is enabled, authenticate via:
- Query param: `?token=your_secret_password`
- Header: `Authorization: Bearer your_secret_password`
- Header: `X-API-Key: your_secret_password`

---

## 🛠️ Local Development

```bash
# Clone repository
git clone https://github.com/sm4sh-it/PlantStack.git
cd PlantStack

# Install dependencies
npm install

# Push schema to local SQLite database
npx prisma db push

# Generate Prisma client
npx prisma generate

# Start dev server
npm run dev
```

---

## 📄 License

This project is licensed under the **PolyForm Noncommercial License 1.0.0** ([LICENSE](LICENSE)).  
It permits free use, modification, and sharing for personal and non-commercial purposes, ensuring PlantStack remains open for enthusiasts and self-hosters while preventing unauthorized commercial exploitation.
