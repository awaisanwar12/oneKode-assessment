# Stage 1: Build
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env* ./ 
# Copy env file if it exists, though typically envs are passed via docker-compose

EXPOSE 5000
CMD ["npm", "start"]
