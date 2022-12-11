'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Addresses', [
    {
      streetName: 'Mitre',
      streetNumber: 250,
      locationId: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    }

  ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Addresses', null, {});
  }
};
