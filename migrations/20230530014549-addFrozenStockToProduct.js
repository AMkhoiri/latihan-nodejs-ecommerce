'use strict';

/** @type {import('sequelize-cli').Migration} */

const { DataTypes } = require ('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('products', 'frozenStock', {
      type: DataTypes.INTEGER,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('products', 'frozenStock');
  }
};
