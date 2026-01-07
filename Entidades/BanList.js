const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db.js');

class BanList extends Model {}

BanList.init({
    IDBan: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    LicenciaID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Motivo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Duracion: {
      type: DataTypes.DateOnly,
      allowNull: true
    }
}, {

sequelize,
modelName: 'BanList',
tableName: 'banlist',
timestamps: false
});

module.exports = BanList;