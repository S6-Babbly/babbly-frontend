# Use Node.js as the base image
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the code (for production builds)
# For development, we'll mount the source code as a volume
COPY . .

# Accept build arguments
ARG NEXT_PUBLIC_API_URL=http://localhost:5010

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_EXPORT=false
ENV NEXT_FORCE_DYNAMIC=true
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build the app for production
RUN npm run build

# Expose port
EXPOSE 3000

# Start the app (will be overridden in dev mode via docker-compose)
CMD ["npm", "start"] 