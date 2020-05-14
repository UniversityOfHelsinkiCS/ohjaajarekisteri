# Set base image
FROM node:10

# Set working directory for the app in container
WORKDIR /app

# Copy package.json to container's /app directory and install dependencies
COPY package.json package-lock.json /app/
RUN npm install

# Launch application
CMD ["npm", "run", "watch"]

# Expose container's port 8080 to the outside
EXPOSE 8080
