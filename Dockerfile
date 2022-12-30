FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY package.json /
COPY package-lock.json /
RUN npm install
RUN npm install -g ts-node
RUN npm install -g typescript
COPY . .
EXPOSE 6666
ENV PORT=6666
RUN chown -R node /usr/src/app
USER node
CMD npm run dev