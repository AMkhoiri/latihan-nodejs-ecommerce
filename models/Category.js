'use strict';

import {Model} from "sequelize"

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
  }, {
    sequelize,
    tableName: 'categories',
    modelName: 'Category',
    defaultScope: {
      attributes: { 
        exclude: ['createdAt', 'updatedAt'] 
      }
    },
  });
  return Category;
};
