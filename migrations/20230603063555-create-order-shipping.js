'use strict';
/** @type {import('sequelize-cli').Migration} */

const { DataTypes } = require ('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orderShippings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      provinceId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      cityId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      weight: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      courierCode: {
        type: DataTypes.STRING,
        allowNull: false
      },
      serviceCode: {
        type: DataTypes.STRING,
        allowNull: false
      },
      cost: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      estimatedInDay: {
        type: DataTypes.STRING,
        allowNull: false
      },
      recipientName: {
        type: DataTypes.STRING
      },
      receiptDate: {
        type: DataTypes.DATE
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orderShippings');
  }
};