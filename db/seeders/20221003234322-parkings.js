'use strict';


module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Parkings', [{
      /*name: 'Estacionamiento Mitre',
      addressId: 5,
      userId: 1,
      farePerHour: 200, 
      openHour: 6,
      closeHour: 23,
      fullCapacity: 30,
      extraInfo: 'Sólo autos y motos',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Estacionamiento Asunción',
      addressId: 6,
      userId: 1,
      farePerHour: 500, 
      openHour: 1,
      closeHour: 23,
      fullCapacity: 50,
      extraInfo: 'No info extra',
      createdAt: new Date(),
      updatedAt: new Date()
    }*/
    name: 'Estacionamiento CACIPRA',
      addressId: 8,
      userId: 2,
      farePerHour: 550, 
      openHour: 1,
      closeHour: 23,
      fullCapacity: 35,
      extraInfo: 'No info extra',
      createdAt: new Date(),
      updatedAt: new Date()
  }
  ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Parkings', null, {});
  }
};
