'use strict';

import {Model} from 'sequelize'
import moment from "moment"

import {Order} from './index.js'

export default (sequelize, DataTypes) => {
  class OrderHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      OrderHistory.belongsTo(models.Order, { foreignKey: 'orderId' })
    }

    static async record(orderId, historyType, userId, transaction) {
      let option = {}
      if (transaction) {
        option = {transaction}
      }

      await OrderHistory.create({
        orderId,
        historyType,
        date: moment().format('YYYY-MM-DD HH:mm'),
        createdBy: userId,
      }, option )
    }
  }

  const historyTypeEnumValues = [Order.PENDING, Order.PAID, Order.PAYMENT_REJECTED, Order.SENT, Order.DONE, Order.FAIL, Order.CANCELED]

  OrderHistory.init({
    orderId: DataTypes.INTEGER,
    date: {
      type: DataTypes.DATE,
        get() {
          return moment(this.getDataValue('date')).format('YYYY-MM-DD HH:mm');
        },
    },
    historyType: {
      type: DataTypes.ENUM(historyTypeEnumValues),
      validate: {
        isIn: {
          args: [historyTypeEnumValues],
          msg: 'Order History Type is wrong'
        }
      },
      allowNull: {
        args: false,
        msg: 'Order History Type cannot be empty',
      },
    },
    createdBy: DataTypes.INTEGER,
  }, {
    sequelize,
    tableName: 'orderHistories',
    modelName: 'OrderHistory',
    defaultScope: {
      attributes: { 
        exclude: ['createdAt', 'updatedAt']
      }
    },
  });

  return OrderHistory;
};