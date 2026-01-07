const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db.js');

class Updates extends Model {}

Updates.init({
    IDUpdate: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    IDJuego: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Contenido: {
      type: DataTypes.STRING,
      allowNull: true
    }
}, {

sequelize,
modelName: 'Updates',
tableName: 'updates',
timestamps: false
});

module.exports = Updates;