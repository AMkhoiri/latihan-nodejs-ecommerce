FROM node:18.15.0

ENV APP_PORT=3000
ENV APP_DATA=/app

WORKDIR ${APP_DATA}

RUN npm install -g nodemon@2.0.22

# mengembalikan package.json >> type menjadi "module"  (karena di awal instalasi diubah menjadi "commonjs" untuk keperluan migration)
# RUN npm run prepare-module

EXPOSE ${APP_PORT}

# pertama (hanya untuk prepare)
# CMD ["sh", "-c", "npm install && npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all"]

# kedua (untuk run server)
CMD ["sh", "-c", "npm install && nodemon app.js"]