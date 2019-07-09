FROM node:10

ARG APP_DIR=app
RUN mkdir -p ${APP_DIR}
WORKDIR ${APP_DIR}

COPY src ./src
COPY package.json ./

RUN npm install

USER node

EXPOSE 3000

CMD ["npm", "start"]
