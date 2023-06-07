'use strict';

const { DataTypes } = require ('sequelize');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('orders', 'totalWeight', {
      type: DataTypes.INTEGER,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('orders', 'totalWeight');
  }
};