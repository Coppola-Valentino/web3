const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db.js');

class BanAppeal2 extends Model {}

BanAppeal2.init({
    IDAppeal2: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
modelName: 'BanAppeal2',
tableName: 'banappeal2',
timestamps: false
});

module.exports = BanAppeal2;