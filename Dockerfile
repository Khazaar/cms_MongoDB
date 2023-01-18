FROM node:16.17.0-bullseye-slim
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install npm@9.1.2
RUN npm install
RUN npm audit fix --force
RUN npm install nodemon@2.0.20
EXPOSE 2050
ENV PORT=2050
ENV CHAT_ID = "-853768669"
ENV BOT_TOKEN2="5907916347:AAEGwVYfuV0N9SgX4fGILqVzZmTVR7oRPyg"
ENV ATLAS_USER="khazaaaar"
ENV ATLAS_PASSWORD="he6ATvfTi4lNALLO"
ENV PORT="2050"
ENV AUTH0_AUDIENCE="https://localhost:7192"
ENV AUTH0_DOMAIN="dev-y4bg7tadkdx0s7x6.us.auth0.com"
ENV AUTH0_CLIENT_ID="rj9XfyfdyJpHNyEWksArilpeqgxH1ti4"
ENV AUTH0_CLIENT_SECRET="vDDbkEwbzcO9LhwO7V_IKCUIC3JhZ483QuNDcFgBjAEeYPwXQP4HXJllAOXHTQeZ"
CMD npm run dev