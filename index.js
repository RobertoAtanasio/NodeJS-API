const app = require('express')();
const consign = require('consign');
const db = require('./config/db');

app.db = db;    // app.db é a variável de manipulação do bando de dados.

consign().include('routes')
    .then('./config/middlewares.js')
    .then('./api/validation.js')
    .then('./api')
    .then('./config/routes.js')
    .into(app);

app.listen(3000, () => {
    console.log('Backend executando...')
});