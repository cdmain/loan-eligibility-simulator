# ----- Stage 1: Build -----
FROM node:20-alpine AS build

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

WORKDIR /app

# Copy workspace config and lockfile first (better layer caching)
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY apps/simulator/package.json apps/simulator/
COPY apps/shell/package.json apps/shell/

# Install dependencies
RUN pnpm install --frozen-lockfile || pnpm install

# Copy source
COPY . .

# Build the simulator (standalone app)
RUN pnpm --filter @loan-simulator/app build

# ----- Stage 2: Serve -----
FROM nginx:alpine AS production

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=build /app/apps/simulator/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
