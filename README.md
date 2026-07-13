# CoreBrain AI Frontend

## Purpose

CoreBrain AI Frontend is the web client for user authentication and dashboard experience.
It communicates with the backend API and does not directly handle Supabase secrets.

## Technology Stack

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS 4

## Run Locally

### 1) Prerequisites

- Node.js 20+
- npm 10+
- Running backend service (`server` project)

### 2) Clone and enter frontend folder

```bash
git clone <your-repository-url>
cd CoreBrainAI/web
```

### 3) Install dependencies

```bash
npm install
```

### 4) Configure environment variables

Copy template:

```bash
cp .env.example .env
```

Set `web/.env`:

```env
VITE_APP_URL=http://localhost:7000
VITE_API_URL=http://localhost:3001
```

### 5) Start development server

```bash
npm run dev
```

Frontend will run at:

- `http://localhost:7000`

### 6) Build and preview production mode locally (optional)

```bash
npm run build
npm run preview
```

## Execution Commands

- Dev: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`
- Lint: `npm run lint`
