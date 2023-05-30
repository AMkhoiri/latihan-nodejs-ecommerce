'use strict';

/** @type {import('sequelize-cli').Migration} */

const { DataTypes } = require ('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('productHistories', 'description', {
      type: DataTypes.TEXT,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('productHistories', 'description');
  }
};
