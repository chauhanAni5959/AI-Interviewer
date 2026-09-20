# Deployment

The project deploys to Render through [render.yaml](render.yaml): one static client, the gateway, five Node services, and Redis.

The client can also deploy to Netlify from the repository root. The included `netlify.toml` builds the `client` directory and enables browser-route fallback.

## Initial setup

1. In Render, create a Blueprint from the repository and select `render.yaml`.
2. Set the `sync: false` values in the Render dashboard. Required values include MongoDB URLs, Gemini credentials, Firebase server credentials, Razorpay credentials, the client origin, and the client API URL.
3. Set `VITE_API_BASE_URL` to the public gateway URL and `CLIENT_ORIGIN` to the public client URL.
4. Create one Render deploy hook for each service and store the newline-separated URLs in the GitHub repository secret `RENDER_DEPLOY_HOOKS`.

## Netlify setup

1. In Netlify, import the GitHub repository and keep the repository base directory at the root. Netlify reads `netlify.toml` automatically.
2. Set `VITE_API_BASE_URL` to the public Render gateway URL.
3. Set `VITE_FIREBASE_API_KEY` to the Firebase Web API key.
4. Set the Render gateway `CLIENT_ORIGIN` to the public Netlify URL. If you use both the Render client and Netlify, provide both origins as a comma-separated value.

Netlify hosts the frontend only. The API services and Redis remain on Render.

After the initial Blueprint deployment, pushes to `main` run CI first. The deploy workflow triggers only when CI succeeds; pull requests run CI without deploying.

## Local production configuration

The client defaults to `http://localhost:8000`. Set `VITE_API_BASE_URL` for a deployed build. The gateway accepts comma-separated values in `CLIENT_ORIGIN` for CORS.