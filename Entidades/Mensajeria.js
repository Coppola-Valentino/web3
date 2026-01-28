const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db.js');

class Mensajeria extends Model {}

Mensajeria.init({
    IDMensaje: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    User2ID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Texto: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Imagen: {
      type: DataTypes.STRING,
      allowNull: true
    }
}, {

sequelize,
modelName: 'Mensajeria',
tableName: 'mensajeria',
timestamps: false
});

module.exports = Mensajeria;