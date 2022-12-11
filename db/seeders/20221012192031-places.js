'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Places', [{
      parkingId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      parkingId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      parkingId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      parkingId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  },

  down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Places', null, {});
  }
};
