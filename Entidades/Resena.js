const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db.js');

class Resena extends Model {}

Resena.init({
    IDResena: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    LicID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    JuegoID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Texto: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Numero: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Fecha: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
}, {

sequelize,
modelName: 'Resena',
tableName: 'resena',
timestamps: false
});

module.exports = Resena;