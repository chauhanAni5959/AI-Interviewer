# Roadmap Service

The roadmap service generates and saves personalized learning roadmaps using the user's goals, available study time, current skills, and recent interview feedback.

## Setup

Copy `.env.example` to `.env` and set `MONGODB_URI` and `GEMINI_API_KEY`.

Start the service from this directory:

```powershell
npm install
npm run dev
```

Set the gateway environment variable so authenticated requests are proxied to this service:

```text
ROADMAP_SERVICE_URL=http://localhost:6005
```

## Endpoints

- `GET /latest` loads the authenticated user's latest saved roadmap.
- `POST /generate` generates and persists a new roadmap.
