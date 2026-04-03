# Stage 1: Build the frontend using Node.js
FROM node:23 AS builder

# Accept the API base URL as a build-time argument (used for configuring the frontend)
ARG VITE_API_BASE_URL

# Set the working directory inside the container
WORKDIR /app

# Copy dependency files first to take advantage of Docker layer caching
COPY package.json package-lock.json .

# Install dependencies strictly according to the lockfile
RUN npm install --frozen-lockfile

# Copy the full application source into the container
COPY . .

# Build the production-ready frontend (output goes to /app/dist)
RUN npm run build


# Stage 2: Serve the built frontend using Nginx
FROM nginx:alpine

# Expose port 80 for HTTP traffic
EXPOSE 80

# Copy built frontend from the builder stage to Nginx's web root
COPY --from=builder /app/dist /usr/share/nginx/html

# Overwrite default Nginx config with custom settings
COPY nginx.conf /etc/nginx/conf.d/default.conf