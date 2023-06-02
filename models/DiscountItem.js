'use strict';

import {Model} from 'sequelize'

export default (sequelize, DataTypes) => {
  class DiscountItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      DiscountItem.belongsTo(models.Discount, { foreignKey: 'discountId' })
      DiscountItem.belongsTo(models.Product, { foreignKey: 'productId' })
    }
  }

  DiscountItem.init({
    productId: DataTypes.INTEGER,
    discountId: DataTypes.INTEGER,
    discountPercentage: DataTypes.INTEGER,
    discountIdr: DataTypes.FLOAT
  }, {
    sequelize,
    tableName: 'discountItems',
    modelName: 'DiscountItem',
    defaultScope: {
      attributes: { 
        exclude: ['productId', 'discountId', 'createdAt', 'updatedAt']
      }
    },
  });
  
  return DiscountItem;
};