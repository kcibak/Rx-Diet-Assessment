# Builds a production image that compiles the Vite frontend and runs the Express backend.
# The final container serves both API routes and static frontend assets from one Node process.
FROM node:20 AS base

WORKDIR /app

# Install workspace dependencies for both frontend and backend.
COPY package*.json ./
COPY backend/package.json ./backend/package.json
RUN npm ci

FROM base AS build

WORKDIR /app
COPY . .
RUN npm run build

FROM node:20-slim AS production

ENV NODE_ENV=production

WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/backend/package.json ./backend/package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/backend ./backend
COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["npm", "run", "start", "-w", "backend"]
