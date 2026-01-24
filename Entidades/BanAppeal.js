const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db.js');

class BanAppeal extends Model {}

BanAppeal.init({
    IDAppeal: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    BanID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Contenido: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Estado:{
      type: DataTypes.STRING,
      allowNull: true
    }
}, {

sequelize,
modelName: 'BanAppeal',
tableName: 'banappeal',
timestamps: false
});

module.exports = BanAppeal;