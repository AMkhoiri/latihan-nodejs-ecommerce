'use strict';

import {Model} from "sequelize"
import moment from "moment"

export default (sequelize, DataTypes) => {
  class Brand extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Brand.hasMany(models.Product, { foreignKey: 'brandId' });
    }
  }

  Brand.init({
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
    tableName: 'brands',
    modelName: 'Brand',
    defaultScope: {
      attributes: { 
        exclude: ['createdAt', 'updatedAt'] 
      }
    },
  });
  return Brand;
};
