const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db.js');

class Usuario extends Model {}

Usuario.init({
    IDUser: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Pass: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Nombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Avatar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Team: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Adm: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
}, {

sequelize,
modelName: 'Usuario',
tableName: 'usuario',
timestamps: false
});

module.exports = Usuario;