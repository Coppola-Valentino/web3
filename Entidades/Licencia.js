const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db.js');

class Licencia extends Model {}

Licencia.init({
    IDLic: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    JuegoID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    UsuarioID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Estado: {
      type: DataTypes.STRING,
      allowNull: true
    }
}, {

sequelize,
modelName: 'Licencia',
tableName: 'licencia',
timestamps: false
});

module.exports = Licencia;