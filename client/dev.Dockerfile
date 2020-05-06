# specify base image
FROM node:10

# set working directory 
WORKDIR /app

# copy files and install dependencies
COPY package.json package-lock.json /app/
RUN npm install
COPY . /app/

# build
CMD npm start

# specify which port to expose
EXPOSE 3000