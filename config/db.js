const config = require('../knexfile');
const knex = require('knex')(config);

// executa as migração quando inicia o sistema
// obs.: 
// 1. o banco de dados deve estar criado para que a migration funcione!
// 2. em produção, é uma boa prática ficar aos cuidados do DBA a manutenção do BD.
knex.migrate.latest([config]); 

module.exports = knex;