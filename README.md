# Codewise — AI Code Review

A small React code editor paired with an Express API that sends code to Gemini for a structured review.

## Requirements

- Node.js 20 or newer
- A Google Gemini API key

## Configure

Copy `BackEnd/.env.example` to `BackEnd/.env` and set `GOOGLE_GEMINI_KEY` to your key. The `.env` file is ignored by Git.

## Run locally

In one terminal:

```sh
cd BackEnd
npm install
npm start
```

In another terminal:

```sh
cd Frontend
npm install
npm run dev
```

Open the local URL printed by Vite. The frontend proxies review requests to the API on port 3000.

The API health check is available at `http://localhost:3000/health`.

## Deploy to Render

Deploy the frontend and backend together as one Render **Web Service**:

- **Root Directory:** leave blank (repository root)
- **Build Command:** `cd Frontend && npm ci && npm run build && cd ../BackEnd && npm ci`
- **Start Command:** `cd BackEnd && npm start`
- **Environment Variables:** set `GOOGLE_GEMINI_KEY` to your Gemini API key and `GEMINI_MODEL` to `gemini-3.5-flash`

The Express server serves the built frontend and the `/ai` API from the same Render URL. Add the API key in Render's Environment settings; never commit `BackEnd/.env`.
