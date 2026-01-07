const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db.js');

class Categorias extends Model {}

Categorias.init({
    IDCategoria: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    IDJuego: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Contenido: {
      type: DataTypes.STRING,
      allowNull: true
    }
}, {

sequelize,
modelName: 'Categorias',
tableName: 'categorias',
timestamps: false
});

module.exports = Categorias;