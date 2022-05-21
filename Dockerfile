FROM node:16.10.0

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY ./package.json .
RUN npm install

COPY ./dist ./dist

EXPOSE 8080

CMD ["npm", "run", "start:prod"]