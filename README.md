# knowledge

C:\Vue-curso\knowledge
C:\Vue-curso\knowledge\versao-inicial

npm i 		instalar as dependências

npm start	(nodemon app)				--> executar a aplicação

em package.json temos:
	"scripts": {
		"start": "nodemon",
		"production": "pm2 start index.js --name knowledge-backend"
	  },
	  
npm install -g nodemon
npm install --save-dev nodemon
npm install mongoose --save
npm install body-parser --save	  
npm install cors --save
npm install consign --save
npm install jsonwebtoken --save
npm install knex --save
		
	Then add one of the following (adding a --save) flag:
	npm install pg --save
	npm install sqlite3 --save
	npm install mysql --save
	npm install mysql2 --save
	npm install oracledb --save
	npm install mssql

obs.:
1. em knexfile.js
* retirar:
  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3'
    }
  },
  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },
* retirar as chaves de:
  production: {}
----------------------------------------------------------------------------------------------------------------------------------

Conectando com o Banco de dados:

C:\Program Files\PostgreSQL\10\bin		// deve está adicionada na variável global do sistema

abrir o banco default: 
	psql -h localhost -U postgres
	psql -U postgres
	
create database knowledge;				cria o banco de dados

\c knowledge_final						conectar com o banco

\dt										lista as tabelas criadas

SELECT * FROM pg_user;

SELECT * FROM pg_tables;

Sair da ferramenta com \q

----------------------------------------------------------------------------------------------------------------------------------

Para a criação das tabelas via migrations, faca:

executar: 
	knex init
	knex migrate:make create_table_users		-> será criado a pasta 'migration' com um arquivo tipo: 20191107184452_create_table_users.js
	knex migrate:make create_table_categories
	knex migrate:make create_table_articles
	
Após as criações dos scripts de criação das tabelas, executar: 
	knex migrate:latest							-> executa as migrations to tipo 'up'
	
	knex migrate:rollback						-> desfaz a última migration executada, tipo 'down'
	"# NodeJS-API" 
