'use strict';
/** @type {import('sequelize-cli').Migration} */

const { DataTypes } = require ('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      orderDate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      paymentDate: {
        type: DataTypes.DATE
      },
      shippingDate: {
        type: DataTypes.DATE
      },
      confirmationDate: {
        type: DataTypes.DATE
      },
      shippingAddress: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  }
};