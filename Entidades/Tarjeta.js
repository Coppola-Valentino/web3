const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db.js');
const bcrypt = require('bcrypt');

class Tarjeta extends Model {};

Tarjeta.init({
    IDTarjeta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Nombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Numero: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    NumeroSeguridad: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
}, {

sequelize,
modelName: 'Tarjeta',
tableName: 'tarjeta',
timestamps: false,
});

module.exports = Tarjeta;