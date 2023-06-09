'use strict';

import {Model} from 'sequelize'

export default (sequelize, DataTypes) => {
  class Order extends Model {

    /* static prperty for Enum Order status */
    static PENDING = "pending"
    static PAID = "paid"
    static SENT = "sent"
    static DONE = "done"
    static FAIL = "fail"
    static CANCELED = "canceled"

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: 'userId' })
      Order.hasMany(models.OrderItem, { foreignKey: 'orderId' })
      Order.hasMany(models.OrderHistory, { foreignKey: 'orderId' })
      Order.hasOne(models.OrderShipping, { foreignKey: 'orderId' })
    }
  }
  Order.init({
    userId: DataTypes.INTEGER,
    status: DataTypes.STRING,
    totalAmount: DataTypes.FLOAT,
    totalWeight: DataTypes.INTEGER,
  }, {
    sequelize,
    tableName: 'orders',
    modelName: 'Order',
    defaultScope: {
      attributes: { 
        // exclude: ['createdAt', 'updatedAt']
      }
    },
  });

  return Order;
};