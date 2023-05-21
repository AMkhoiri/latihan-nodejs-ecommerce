'use strict';

import {Model} from "sequelize"
import moment from 'moment'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

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

    /* Function for extract User data from token payload */
    static getUserFromToken(req) {
      const authorizationHeader = req.headers.authorization;
      if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
        const token = authorizationHeader.substring(7);
        try {
          const userData = jwt.verify(token, process.env.JWT_SECRET_KEY)
          return userData
        } 
        catch (error) {
          return null
        }
      }
      else {
        return null
      }
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