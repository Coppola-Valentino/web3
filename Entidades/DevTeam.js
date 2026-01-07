const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db.js');

class DevTeam extends Model {}

DevTeam.init({
    IDTeam: {
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
    FundadorID: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
}, {

sequelize,
modelName: 'DevTeam',
tableName: 'devteam',
timestamps: false
});

module.exports = DevTeam;