'use strict';

import {Model} from 'sequelize'

export default (sequelize, DataTypes) => {
  class Order extends Model {

    /* static prperty for Enum Order status */
    static PENDING = "pending"
    static PAID = "paid"
    static PAYMENT_REJECTED = "payment-rejected"
    static SENT = "sent"
    static DONE = "done"
    static FAIL = "fail"
    static CANCELED = "canceled"

    /* static prperty for Enum Payment Confirmation */
    static REJECT_PAYMENT = "reject-payment"
    static ACCEPT_PAYMENT = "accept-payment"

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
      Order.hasOne(models.OrderPaymentEvidence, { foreignKey: 'orderId' })
    }
  }

  const statusEnumValues = [Order.PENDING, Order.PAID, Order.PAYMENT_REJECTED, Order.SENT, Order.DONE, Order.FAIL, Order.CANCELED]

  Order.init({
    userId: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM(statusEnumValues),
      validate: {
        isIn: {
          args: [statusEnumValues],
          msg: 'Order Status is wrong'
        }
      },
      allowNull: {
        args: false,
        msg: 'Order Status cannot be empty',
      },
    },
    totalAmount: DataTypes.FLOAT,
    totalWeight: DataTypes.INTEGER,
    note: DataTypes.TEXT,
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