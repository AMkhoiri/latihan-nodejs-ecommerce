'use strict';

import {Model} from 'sequelize'

export default (sequelize, DataTypes) => {
  class OrderItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      OrderItem.belongsTo(models.Order, { foreignKey: 'orderId' })
      OrderItem.belongsTo(models.Product, { foreignKey: 'productId' })
      OrderItem.belongsTo(models.DiscountItem, { foreignKey: 'discountItemId' })
    }
  }
  OrderItem.init({
    orderId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    discountItemId: DataTypes.INTEGER,
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: {
        args: false,
        msg: 'Quantity cannot be empty',
      },
    }, 
    price: {
      type: DataTypes.FLOAT,
      allowNull: {
        args: false,
        msg: 'Price cannot be empty',
      },
    }, 
    note: DataTypes.TEXT
  }, {
    sequelize,
    tableName: 'orderItems',
    modelName: 'OrderItem',
    defaultScope: {
      attributes: { 
        exclude: ['createdAt', 'updatedAt']
      }
    },
  });

  return OrderItem;
};