const { dbPostgre } = require('./.env')

module.exports = {
  client: 'postgresql',
  connection: dbPostgre,
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
};
