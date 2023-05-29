'use strict';
/** @type {import('sequelize-cli').Migration} */

const { DataTypes } = require ('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('productHistories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
       productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      historyType: {
        allowNull: false,
        type: DataTypes.STRING
      },
      oldStock: {
        allowNull: true,
        type: DataTypes.INTEGER
      },
      newStock: {
        allowNull: true,
        type: DataTypes.INTEGER
      },
      oldPrice: {
        allowNull: true,
        type: DataTypes.FLOAT
      },
      newPrice: {
        allowNull: true,
        type: DataTypes.FLOAT
      },
      createdBy: {
        allowNull: false,
        type: DataTypes.INTEGER,
        // references: {
        //   model: 'users',
        //   key: 'id'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'CASCADE'
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
    await queryInterface.dropTable('productHistories');
  }
};