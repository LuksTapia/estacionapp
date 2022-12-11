'use strict';


module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.bulkInsert('Vehicles', [{
        patent: 'ABC123',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        patent: 'ABC444',
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        patent: 'ABC555',
        userId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        patent: 'ABC333',
        userId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
    
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
