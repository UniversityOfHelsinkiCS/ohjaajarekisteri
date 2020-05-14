FROM node:10 as builder

ARG BASE_URL
ENV REACT_APP_PUBLIC_URL=$BASE_URL

WORKDIR /front

COPY ./client/package.json ./client/package-lock.json /front/
RUN npm install
COPY ./client /front/

RUN npm run build

# Set base image
FROM node:10

# Set working directory for the app in container
WORKDIR /app

# Copy package.json to container's /app directory and install dependencies
COPY ./server/package.json ./server/package-lock.json /app/
RUN npm install
COPY ./server /app

COPY --from=builder /front/build /app/build

# Launch application
CMD ["node", "index.js"]

# Expose container's port 8080 to the outside
EXPOSE 8080