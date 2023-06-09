'use strict';

/** @type {import('sequelize-cli').Migration} */

const { DataTypes } = require ('sequelize');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'weight', {
      type: DataTypes.INTEGER,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('products', 'weight');
  }
};
