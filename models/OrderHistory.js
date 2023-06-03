'use strict';

import {Model} from 'sequelize'

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
  }
  OrderHistory.init({
    orderId: DataTypes.INTEGER,
    date: DataTypes.DATE,
    historyType: DataTypes.STRING
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