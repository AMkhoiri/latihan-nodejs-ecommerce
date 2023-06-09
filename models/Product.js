'use strict';

import {Model} from 'sequelize'
import moment from "moment"

export default (sequelize, DataTypes) => {
  class Product extends Model {

    /* static prperty for Enum Adjusment Type (for histories)*/
    static CREATE = "create"
    static STOCK_INCREASE = "stock-increase"
    static STOCK_DECREASE = "stock-decrease"
    static PRICE_INCREASE = "price-increase"
    static PRICE_DECREASE = "price-decrease"

    /* static property for ordering product list */
    static HIGHER_PRICE = "higher-price"
    static LOWER_PRICE = "lower-price"

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsTo(models.Category, { foreignKey: 'categoryId' });
      Product.belongsTo(models.Brand, { foreignKey: 'brandId' });
      Product.hasMany(models.ProductImage, { foreignKey: 'productId' });
      Product.hasMany(models.ProductHistory, { foreignKey: 'productId' });
      Product.hasOne(models.DiscountItem, { foreignKey: 'productId' });
    }
  }

  Product.init({
    categoryId: DataTypes.INTEGER,
    brandId: DataTypes.INTEGER,
    name: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Name cannot be empty',
      },
    }, 
    description: DataTypes.TEXT,
    stock: {
      type: DataTypes.INTEGER,
      allowNull: {
        args: false,
        msg: 'Stock cannot be empty',
      },
    }, 
    frozenStock: DataTypes.INTEGER,
    price: {
      type: DataTypes.FLOAT,
      allowNull: {
        args: false,
        msg: 'Price cannot be empty',
      },
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: {
        args: false,
        msg: 'Weight cannot be empty',
      },
    },
    isActive: DataTypes.BOOLEAN,
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
    tableName: 'products',
    modelName: 'Product',
  });
  return Product;
};