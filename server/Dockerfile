FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the server code
COPY . .

# Expose the port the server runs on
EXPOSE 5000

# Start the server
CMD ["node", "index.js"] 