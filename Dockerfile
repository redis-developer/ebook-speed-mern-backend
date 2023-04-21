FROM node:18.14.2-alpine

WORKDIR /app

COPY package.json .
RUN npm install

# copy files 
COPY . .

EXPOSE 3001

# WriteBehind example
CMD [ "npm","run", "docker-start" ]



