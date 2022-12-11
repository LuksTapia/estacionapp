'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Bookings', [{//Booking activo
      vehicleId: 1,
      incomeTo: new Date(),
      egressTo: null,
      parkingId: 1,
      placeId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {//Booking inactivo
      vehicleId: 2,
      incomeTo: new Date(),
      egressTo: new Date(),
      parkingId: 1,
      placeId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {//Booking activo
      vehicleId: 2,
      incomeTo: new Date(),
      egressTo: null,
      parkingId: 1,
      placeId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {//Booking activo
      vehicleId: 3,
      incomeTo: new Date(),
      egressTo: null,
      parkingId: 2,
      placeId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {//Booking inactivo
      vehicleId: 4,
      incomeTo: new Date(),
      egressTo: new Date(),
      parkingId: 2,
      placeId: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Bookings', null, {});
  }
};