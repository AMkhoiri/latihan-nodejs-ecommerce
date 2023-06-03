'use strict';

import {Model} from 'sequelize'

export default (sequelize, DataTypes) => {
  class CartItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CartItem.belongsTo(models.User, { foreignKey: 'userId' })
      CartItem.belongsTo(models.Product, { foreignKey: 'productId' })
    }
  }
  CartItem.init({
    userId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: {
        args: false,
        msg: 'Quantity cannot be empty',
      },
    }, 
    note: DataTypes.TEXT
  }, {
    sequelize,
    tableName: 'cartItems',
    modelName: 'CartItem',
    defaultScope: {
      attributes: { 
        exclude: ['createdAt', 'updatedAt']
      }
    },
  });

  return CartItem;
};