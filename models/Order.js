'use strict';

import {Model} from 'sequelize'

export default (sequelize, DataTypes) => {
  class Order extends Model {
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
    transactionDate: DataTypes.DATE,
    paymentDate: DataTypes.DATE,
    sentDate: DataTypes.DATE,
    receivedDate: DataTypes.DATE,
    status: DataTypes.STRING,
    totalAmount: DataTypes.FLOAT
  }, {
    sequelize,
    tableName: 'orders',
    modelName: 'Order',
    defaultScope: {
      attributes: { 
        exclude: ['createdAt', 'updatedAt']
      }
    },
  });

  return Order;
};