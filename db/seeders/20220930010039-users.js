'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      userName: 'Nicolas',
      lastName: 'Calabria',
      email: 'nicocala@gmail.com',
      password: '12233',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      userName: 'Gabriel',
      lastName: 'Arce',
      email: 'gabyarce@gmail.com',
      password: '127899',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      userName: 'Lucas',
      lastName: 'tapia',
      email: 'lucastapia@gmail.com',
      password: 'ind333',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      userName: 'Cai',
      lastName: 'Suarez',
      email: 'caiSuarez@gmail.com',
      password: 'boca333',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};