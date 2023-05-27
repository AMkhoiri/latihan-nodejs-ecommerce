'use strict';

import {Model} from 'sequelize'
import moment from "moment"

export default (sequelize, DataTypes) => {
  class ProductImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductImage.belongsTo(models.Product, { foreignKey: 'productId' });
    }
  }

  ProductImage.init({
    productId: DataTypes.INTEGER,
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
    tableName: 'productImages',
    modelName: 'ProductImage',
  });
  return ProductImage;
};