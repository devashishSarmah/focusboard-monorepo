# ─── Builder stage ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /src

# 1. Copy manifests & install deps
COPY package.json package-lock.json ./
RUN npm ci

# 2. Copy source & build the Angular app
COPY . .
RUN npm run build

# ─── Serving stage ─────────────────────────────────────────────────────────────
FROM nginx:alpine

# 3. Clear default content
RUN rm -rf /usr/share/nginx/html/*

# 4. Copy your actual build output
COPY --from=builder /src/dist/focusboard-ui/browser/. /usr/share/nginx/html

# 5. Start Nginx
CMD ["nginx", "-g", "daemon off;"]
