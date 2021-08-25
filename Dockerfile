FROM node:14 as frontend

WORKDIR /usr/app/frontend

COPY frontend/package*.json .

RUN npm install

COPY frontend/ .

RUN npm run build

FROM node:14

WORKDIR /usr/src/app/backend

COPY --from=frontend /usr/app/frontend/build/ ./build

COPY backend/package*.json .

RUN npm install

COPY backend .

CMD ["npm", "start"]
