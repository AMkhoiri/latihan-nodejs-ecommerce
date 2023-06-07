'use strict';

import {Model} from 'sequelize'

export default (sequelize, DataTypes) => {
  class OrderShipping extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static COURIER = [
      {
        code: "jne",
        name: "JNE"
      },
      {
        code: "pos",
        name: "POS"
      },
      {
        code: "tiki",
        name: "TIKI"
      }
    ]

    static associate(models) {
      OrderShipping.belongsTo(models.Order, { foreignKey: 'orderId' })
    }
  }
  OrderShipping.init({
    orderId: DataTypes.INTEGER,
    provinceId: DataTypes.INTEGER,
    cityId: DataTypes.INTEGER,
    address: {
      type: DataTypes.TEXT,
      allowNull: {
        args: false,
        msg: 'Address cannot be empty',
      },
    }, 
    weight: {
      type: DataTypes.INTEGER,
      allowNull: {
        args: false,
        msg: 'Weight cannot be empty',
      },
    },
    courierCode: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'CourierCode cannot be empty',
      },
    }, 
    serviceCode: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'ServiceCode cannot be empty',
      },
    },
    cost: {
      type: DataTypes.FLOAT,
      allowNull: {
        args: false,
        msg: 'Cost cannot be empty',
      },
    },
    estimatedInDay: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'EstimatedInDay cannot be empty',
      },
    },
    recipientName: DataTypes.STRING,
    receiptDate: DataTypes.DATE
  }, {
    sequelize,
    tableName: 'orderShippings',
    modelName: 'OrderShipping',
    defaultScope: {
      attributes: { 
        exclude: ['createdAt', 'updatedAt']
      }
    },
  });

  return OrderShipping;
};