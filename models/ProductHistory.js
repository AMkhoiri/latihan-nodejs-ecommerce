'use strict';

import {Model} from 'sequelize'
import moment from "moment"

import {Product} from './index.js'

export default (sequelize, DataTypes) => {
  class ProductHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductHistory.belongsTo(models.Product, { foreignKey: 'productId' });
      ProductHistory.belongsTo(models.User, { foreignKey: 'createdBy' });
    }

    static async record(oldProductData, stock, newPrice, type, userId, transaction) {

      let oldStock = oldProductData.stock
      let newStock = stock
      
      if (type == Product.STOCK_INCREASE) {
        newStock = oldStock += parseInt(stock)
      }
      else if(type == Product.STOCK_DECREASE) {
        newStock = oldStock -= parseInt(stock)
      }
      await ProductHistory.create({
        productId: oldProductData.id,
        historyType: type,
        oldStock: oldProductData ? oldProductData.stock : null,
        newStock: newStock,
        oldPrice: oldProductData ? oldProductData.price : null,
        newPrice: newPrice,
        createdBy: userId,
      }, {
        transaction
      })
    }
  }

  const historyTypeEnumValues = [Product.CREATE, Product.STOCK_INCREASE, Product.STOCK_DECREASE, Product.PRICE_INCREASE, Product.PRICE_DECREASE]

  ProductHistory.init({
    productId: DataTypes.INTEGER,
    historyType: {
      type: DataTypes.ENUM(historyTypeEnumValues),
      validate: {
        isIn: {
          args: [historyTypeEnumValues],
          msg: 'Product History Type is wrong'
        }
      },
      allowNull: {
        args: false,
        msg: 'Product History Type cannot be empty',
      },
    },
    oldPrice: DataTypes.FLOAT,
    newPrice: DataTypes.FLOAT,
    oldStock: DataTypes.INTEGER,
    newStock: DataTypes.INTEGER,
    createdBy: DataTypes.INTEGER,
    createdAt: {
      type: DataTypes.DATE,
        get() {
          return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm');
        },
    },
    updatedAt: {
      type: DataTypes.DATE,
        get() {
          return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm');
        },
    },
  }, {
    sequelize,
    tableName: 'productHistories',
    modelName: 'ProductHistories',
  });
  return ProductHistory;
};