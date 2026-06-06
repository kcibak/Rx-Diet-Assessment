# RX Diet Technical Assessment

**Candidate:** Kira C

## Project Overview

This repository contains a simple web application prepared for the RX Diet Security Engineer technical interview. The app includes a functional login mechanism and a lightweight React UI for exercising the backend API.

The current application supports:

- User registration
- User login
- Authenticated API requests using bearer tokens
- Basic user listing, messaging, and block/unblock demo flows

The assessment requirements PDF remains in this repository as reference material: `Security Engineer Technical Interview.pdf`.

## Tech Stack

The assessment stack is:

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** Neon PostgreSQL
- **Deployment:** Google Cloud Run
- **Source control:** GitHub

Current implementation note: the checked-in local development setup still contains legacy MySQL and Docker Compose configuration from the earlier version of this project. Those files are kept for now so the existing app behavior remains unchanged during this cleanup pass.

## Current Local Setup

From the application directory:

```bash
cd rxdiet-project
npm install
```

Start the backend:

```bash
npm run dev:backend
```

Start the frontend in another terminal:

```bash
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend runs on `http://localhost:3000`.

The legacy Docker Compose setup can also start the current local stack:

```bash
cd rxdiet-project
docker compose up --build
```

That local stack currently uses MySQL from `docker/mysql/init/001-schema.sql`. This is not the target database architecture for the RX Diet assessment stack.

## Deployment Status

- **Target hosting:** Google Cloud Run
- **Target database:** Neon PostgreSQL
- **Current status:** pending

The production demo should use a deployed cloud URL, not localhost. Cloud Run deployment configuration and Neon database wiring still need to be completed before the live interview demo.

## Prep TODOs

- Replace the current database configuration with a Neon PostgreSQL connection string.
- Add or update `.env.example`.
- Add Cloud Run deployment notes or configuration.
- Set required environment variables in Google Cloud Run.
- Confirm the production URL works without localhost.
- Confirm the login flow works in production.

## Git Workflow

The interview workflow should be demonstrable from the terminal or preferred Git tooling:

1. Keep `main` as the production branch.
2. Maintain a `development` branch for ongoing work.
3. Create a feature or fix branch for the live change.
4. Merge the completed branch back into `main`.
5. Push `main`.
6. Confirm the deployed production app reflects the change.

## API Summary

Public endpoints:

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/` | API status |
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

## Live Interview Demo Checklist

- Open the deployed Cloud Run application URL.
- Register or log in with a test user.
- Show the authenticated UI/API flow.
- Create a feature or fix branch.
- Make a small code change.
- Merge the branch back to `main`.
- Push the update.
- Confirm the production deployment reflects the change.
