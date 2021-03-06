FROM node:14.15.4-alpine

# Create app directory
WORKDIR /app

ADD . ./

COPY .env.example .env

RUN yarn

EXPOSE 4000

CMD [ "yarn", "dev"]
