FROM node:alpine as development

WORKDIR /app/meeting-mgmt

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 8000

CMD [ "yarn", "start:dev" ]
