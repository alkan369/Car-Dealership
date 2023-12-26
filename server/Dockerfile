FROM node:alpine

RUN mkdir -p /home/node/car_dealership

WORKDIR /home/node/car_dealership

COPY package*.json ./

RUN chown -R node:node /home/node/car_dealership

USER node

RUN npm install

USER root

RUN npm install -g typescript

USER node

COPY --chown=node:node . .

RUN tsc

EXPOSE 8080

CMD ["node", "dist/index.js"]