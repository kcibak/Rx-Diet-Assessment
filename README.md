# RX Diet Technical Assessment

**Candidate:** Kira C

## Project Overview

This repository contains a simple web application prepared for the RX Diet Security Engineer technical interview. The app includes registration, login, bearer-token authenticated API requests, user listing, messaging, and block/unblock demo flows.

The assessment requirements PDF remains in this repository as reference material: `Security Engineer Technical Interview.pdf`.

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** Neon PostgreSQL
- **Deployment:** Google Cloud Run
- **Source control:** GitHub

The production deployment is a single Cloud Run container. Express serves the API and the built Vite frontend from the same service.

## Required Environment Variables

Create `rxdiet-project/.env` locally from `rxdiet-project/.env.example`. Do not commit real secrets.

```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST.neon.tech/DB_NAME?sslmode=require
PORT=3000
SESSION_DURATION_DAYS=7
```

For local Vite development only, also set:

```bash
VITE_API_BASE_URL=http://localhost:3000
```

## Neon Database Setup

1. Create a Neon project and database.
2. Copy the Neon pooled or direct connection string.
3. Apply the schema:

```bash
cd rxdiet-project
psql "$DATABASE_URL" -f db/schema.sql
```

The schema creates `users`, `sessions`, `messages`, and `user_blocks`. Passwords are stored only as `scrypt` hashes, and session tokens are stored only as SHA-256 hashes.

## Local Setup

From the application directory:

```bash
cd rxdiet-project
npm install
cp .env.example .env
```

Edit `.env` with the Neon `DATABASE_URL`, then initialize the database:

```bash
psql "$DATABASE_URL" -f db/schema.sql
```

Start the backend:

```bash
npm run dev:backend
```

Start the frontend in another terminal:

```bash
VITE_API_BASE_URL=http://localhost:3000 npm run dev
```

The frontend runs on `http://localhost:5173` and the backend runs on `http://localhost:3000`.

To run the production-style app locally:

```bash
npm run build
npm start
```

## Docker

The project uses `rxdiet-project/Dockerfile`. It builds the Vite frontend during image build and starts the Express backend, which serves both API routes and the built frontend.

Build the image:

```bash
cd rxdiet-project
docker build -t rxdiet-app .
```

Run it locally:

```bash
docker run --env-file .env -p 3000:3000 rxdiet-app
```

Docker Compose is optional for local container testing only:

```bash
docker compose up --build
```

Compose does not start a database. Production deployment does not require Docker Compose.

## Google Cloud Run Deployment

Set these Cloud Run environment variables:

```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST.neon.tech/DB_NAME?sslmode=require
SESSION_DURATION_DAYS=7
NODE_ENV=production
```

Cloud Run injects `PORT`; the backend reads `process.env.PORT`.

Example deploy from source:

```bash
cd rxdiet-project
gcloud run deploy rxdiet-app \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/DB_NAME?sslmode=require",SESSION_DURATION_DAYS="7",NODE_ENV="production"
```

Build and push with Docker:

```bash
cd rxdiet-project
docker build -t gcr.io/PROJECT_ID/rxdiet-app .
docker push gcr.io/PROJECT_ID/rxdiet-app
gcloud run deploy rxdiet-app \
  --image gcr.io/PROJECT_ID/rxdiet-app \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/DB_NAME?sslmode=require",SESSION_DURATION_DAYS="7",NODE_ENV="production"
```

## Checks

```bash
cd rxdiet-project
npm run build
npm run security:audit
```

## API Summary

Public endpoints:

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api` | API status |
| `GET` | `/health` | Health check |
| `POST` | `/register` | Register a user |
| `POST` | `/login` | Authenticate a user |

Protected endpoints use:

```text
Authorization: Bearer <session_token>
```

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/list_all_users` | List users excluding the requester |
| `POST` | `/send_message` | Send a message |
| `GET` | `/view_messages` | View conversation history |
| `POST` | `/block_user` | Block a user |
| `POST` | `/unblock_user` | Unblock a user |

## Login Flow

Registration validates the email and password, hashes the password with Node `crypto.scrypt`, and stores the user in Neon Postgres. Login fetches the user by email, verifies the password against the stored hash, creates a random bearer token, stores only the token's SHA-256 hash in the `sessions` table, and returns the raw token to the frontend for authenticated requests.

## Git Workflow

The interview workflow should be demonstrable from the terminal or preferred Git tooling:

1. Keep `main` as the production branch.
2. Maintain a `development` branch for ongoing work.
3. Create a feature or fix branch for the live change.
4. Merge the completed branch back into `main`.
5. Push `main`.
6. Confirm the deployed Cloud Run production app reflects the change.

## Live Interview Demo Checklist

- Open the deployed Cloud Run application URL.
- Register or log in with a test user.
- Show the authenticated UI/API flow.
- Create a feature or fix branch.
- Make a small code change.
- Merge the branch back to `main`.
- Push the update.
- Confirm the production deployment reflects the change.
