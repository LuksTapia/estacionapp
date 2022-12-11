'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Parking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Parking.belongsTo(models.Address)
      Parking.belongsTo(models.User)
      Parking.hasMany(models.Booking)
      Parking.hasMany(models.Place)
      Parking.belongsTo(models.User)

    }
  }
  Parking.init({
    name: {
      type: DataTypes.STRING(30),
      allowNull: false 
    },
    addressId: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    userId: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    farePerHour: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    openHour: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    closeHour: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    fullCapacity: {
      type: DataTypes.NUMBER,
      allowNull: false,
      default:0
    },
    extraInfo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'Parking',
    tableName: 'Parkings',
  });
  return Parking;
};