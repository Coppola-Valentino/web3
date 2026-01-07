const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db.js');

class Reseña extends Model {}

Reseña.init({
    IDReseña: {
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
    }
}, {

sequelize,
modelName: 'Reseña',
tableName: 'reseña',
timestamps: false
});

module.exports = Reseña;