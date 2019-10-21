# grab latest node 10 build
FROM node:10

COPY . /usr/share/ticket-calc

#Install node
WORKDIR /usr/share/ticket-calc
RUN ls -la
RUN yarn install

WORKDIR ui
RUN ls -la
RUN yarn install
RUN npm run build_prod

WORKDIR ..
RUN rm -rf ui


CMD npm start

