require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('web3', 'root', null, {
host: 'localhost',
dialect: 'mysql',
logging: false,
port: 3306,
});

module.exports = { sequelize, DataTypes};