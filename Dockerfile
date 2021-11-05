FROM node

# Create app directory
WORKDIR /app

ADD . ./

RUN yarn

EXPOSE 3000
CMD [ "yarn", "start"]
