'use strict';

import {Model} from "sequelize"
import moment from "moment"

export default (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Category.hasMany(models.Product, { foreignKey: 'categoryId' });
    }
  }

  Category.init({
    name: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Name cannot be empty',
      },
    }, 
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
  }, {
    sequelize,
    tableName: 'categories',
    modelName: 'Category',
  });
  return Category;
};
