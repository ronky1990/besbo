# Use Node.js LTS (Long Term Support) version
FROM node:20-slim

# Create app directory
WORKDIR /usr/src/app

# Copy package files from server directory
COPY ././package.json ./

# Install dependencies
RUN npm install

# Copy server source code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Command to run the app
CMD ["node", "index.js"] 