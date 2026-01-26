const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db.js');

class Publisher extends Model {}

Publisher.init({
    IDPublisher: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Nombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Banner: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Estado: {
      type: DataTypes.STRING,
      allowNull: true
    },
    FundadorID: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
}, {

sequelize,
modelName: 'Publisher',
tableName: 'publisher',
timestamps: false
});

module.exports = Publisher;