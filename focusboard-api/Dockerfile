# focusboard-api/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json ./
RUN npm install --frozen-lockfile
COPY . .
RUN npm run build
FROM node:20-alpine
RUN apk add --no-cache curl
WORKDIR /app
COPY --from=builder /app/package.json ./
RUN npm install --prod --frozen-lockfile
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/main.js"]
