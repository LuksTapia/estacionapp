'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Locations', [{
      locationName: 'Agronomia',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'Almagro',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'Balvanera',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'Barracas',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'Boedo',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'Caballito',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'Chacarita',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'Coghlan',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'Colegiales',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'Constitucion',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'Flores',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'Floresta',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'La Boca',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'La Paternal',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'Liniers',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'Mataderos',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'Monte Castro',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'Monserrat',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'Nueva Pompeya',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'Nuñez',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'Palermo',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'Parque Avellaneda',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'Parque Chacabuco',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'Parque Chas',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'Parque Patricios',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'Puerto Madero',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'Recoleta',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'Retiro',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'Saavedra',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'San Cristobal',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'San Nicolas',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'San Telmo',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'Versalles',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'Villa Crespo',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'Villa Devoto',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'Villa General Mitre',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'Villa Lugano',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'Villa Luro',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'Villa Ortuzar',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'Villa Pueyrredon',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'Villa Real',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'Villa Riachuelo',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'Villa Santa Rita',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'Villa Soldati',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'Villa Urquiza',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'Villa del Parque',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      locationName: 'Velez Sarsfield',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Locations', null, {});
  }
};