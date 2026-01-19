const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db.js');
const bcrypt = require('bcrypt');

class Usuario extends Model {

 async validar(Pass) {
  return await bcrypt.compare(Pass, this.Pass);
 }
 
};

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
    Email: {
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
    Publish: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Admin: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
}, {

sequelize,
modelName: 'Usuario',
tableName: 'usuario',
timestamps: false,
hooks: {
  beforeCreate: async (User) => {
    if (User.Pass) {
      const sal = await bcrypt.genSalt(10);
      User.Pass = await bcrypt.hash(User.Pass, sal);
    }
  },
  beforeUpdate: async (User) => {
    if (User.changed('Pass')) {
      const sal = await bcrypt.genSalt(10);
      User.Pass = await bcrypt.hash(User.Pass, sal);
    }
  }
}
});

module.exports = Usuario;