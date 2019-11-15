const app = require('express')();
const consign = require('consign');
const db = require('./config/db');
const mongoose = require('mongoose');

require('./config/mongodb');
require('colors');

app.db = db;    // app.db é a variável de manipulação do bando de dados.
app.mongoose = mongoose

consign()
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./api/validation.js')
    .then('./api')
    .then('./schedule/statsSchedule.js')
    .then('./config/routes.js')
    .into(app);

app.listen(3000, () => {
    console.log('Backend executando na porta 3000...'.blue)
});