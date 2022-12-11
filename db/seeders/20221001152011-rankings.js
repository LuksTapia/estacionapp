'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Rankings', [{
      calification: 1,
      bookingId: 3, 
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      calification: 5,
      bookingId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Rankings', null, {});
  }
};