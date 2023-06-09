'use strict';

import {Model} from 'sequelize'
import moment from "moment"

export default (sequelize, DataTypes) => {
  class Discount extends Model {

    /* static prperty for Enum Discount Type */
    static PERCENTAGE = "percentage"
    static IDR = "idr"

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Discount.hasMany(models.DiscountItem, { foreignKey: 'discountId' })
    }
  }

  const discountTypeEnumValues = [Discount.PERCENTAGE, Discount.IDR]

  Discount.init({
    name: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Name cannot be empty',
      },
    }, 
    description: DataTypes.TEXT,
    startDate: {
      type: DataTypes.DATE,
        get() {
          return moment(this.getDataValue('startDate')).format('YYYY-MM-DD HH:mm');
        },
    },
    endDate: {
      type: DataTypes.DATE,
        get() {
          return moment(this.getDataValue('endDate')).format('YYYY-MM-DD HH:mm');
        },
    },
    type: {
      type: DataTypes.ENUM(discountTypeEnumValues),
      validate: {
        isIn: {
          args: [discountTypeEnumValues],
          msg: 'Discount Type is wrong'
        }
      },
      allowNull: {
        args: false,
        msg: 'Discount Type cannot be empty',
      },
    },
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName: 'discounts',
    modelName: 'Discount',
    defaultScope: {
      attributes: { 
        exclude: ['createdAt', 'updatedAt'] 
      }
    },
  });
  
  return Discount;
};