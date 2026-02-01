const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db.js');

class Friend extends Model {}

Friend.init({
    IDFriend: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    UserID: { //usuario seleccionado
      type: DataTypes.INTEGER,
      allowNull: true
    },
    User2ID: { //usuario activo
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Estado: { 
      type: DataTypes.STRING,
      allowNull: true
    }
}, {

sequelize,
modelName: 'Friend',
tableName: 'friend',
timestamps: false
});

module.exports = Friend;