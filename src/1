FROM node:16.17.0-bullseye-slim
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install npm@9.1.2
RUN npm install
RUN npm audit fix --force
RUN npm install nodemon@2.0.20
EXPOSE 6666
ENV PORT=6666
CMD npm run dev