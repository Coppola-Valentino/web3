const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db.js');

class Juego extends Model {}

Juego.init({
    IDJuego: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Nombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Precio: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    Imagen: {
      type: DataTypes.STRING,
      allowNull: true
    },
    DevID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Descripcion: {
      type: DataTypes.STRING,
      allowNull: true
    }
}, {

sequelize,
modelName: 'Juego',
tableName: 'juego',
timestamps: false
});

module.exports = Juego;