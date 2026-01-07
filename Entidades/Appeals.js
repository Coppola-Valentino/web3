const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db.js');

class Appeals extends Model {}

Appeals.init({
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
    }
}, {

sequelize,
modelName: 'Appeals',
tableName: 'appeals',
timestamps: false
});

module.exports = Appeals;