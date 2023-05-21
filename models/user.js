'use strict';

import {Model} from "sequelize"
import moment from 'moment'

export default (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.Role, { foreignKey: 'roleId' });
    }
  }

  User.init({
    roleId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Username already exists',
      },
    }, 
    password: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN,
    createdAt: {
      type: DataTypes.DATE,
        get() {
          return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm');
        },
    },
    updatedAt: {
      type: DataTypes.DATE,
        get() {
          return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm');
        },
    },
  }, 
  {
    sequelize,
    tableName: 'users',
    modelName: 'User',
    defaultScope: {
      attributes: { 
        exclude: ['password'] 
      }
    }
  });
  return User;
};

/* createdAt & updatedAt diformat dengan menggunakan "virtual colunn" */