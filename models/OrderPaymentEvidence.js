'use strict';

import {Model} from 'sequelize'

import Utility from '../helpers/utility.js'

export default (sequelize, DataTypes) => {
  class OrderPaymentEvidence extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      OrderPaymentEvidence.belongsTo(models.Order, { foreignKey: 'orderId' });
    }
  }

  OrderPaymentEvidence.init({
    orderId: DataTypes.INTEGER,
    name: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Name cannot be empty',
      },
    }, 
    path: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Path cannot be empty',
      },
    }, 
    extension: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Extension cannot be empty',
      },
    }, 
    size: {
      type: DataTypes.FLOAT,
      allowNull: {
        args: false,
        msg: 'Size cannot be empty',
      },
    }, 
    mimetype: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Mimetype cannot be empty',
      },
    },
  }, {
    sequelize,
    tableName: 'orderPaymentEvidences',
    modelName: 'OrderPaymentEvidence',
    defaultScope: {
      attributes: { 
        exclude: ['createdAt', 'updatedAt']
      }
    },
    getterMethods: {
      link() {
        return Utility.generateFileLink('orderPaymentEvidence', this.getDataValue('id'))
      },
    },

  });
  return OrderPaymentEvidence;
};