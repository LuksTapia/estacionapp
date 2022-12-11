'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Parkings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      addressId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      farePerHour: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      openHour: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      closeHour: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      fullCapacity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default:0
      },
      extraInfo: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Parkings');
  }
};