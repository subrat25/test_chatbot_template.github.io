const { Sequelize } = require('sequelize');
require('dotenv').config();

const isPostgresUsed = process.env.POSTGRES_USE === 'true';

const mysqlOptions = {
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DB,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    dialect: 'mysql',
    logging: false, 
};

const postgresOptions = {
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    dialect: 'postgres',
    logging: false, 
};

const sequelize = new Sequelize(isPostgresUsed ? postgresOptions : mysqlOptions);

module.exports = sequelize;
