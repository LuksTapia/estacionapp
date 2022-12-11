'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(models.Parking)
      Booking.belongsTo(models.Vehicle)
      Booking.belongsTo(models.Place)
      Booking.hasOne(models.Ranking)
    }
  }
  Booking.init({
    vehicleId: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    parkingId: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    placeId: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    incomeTo: {
      type: DataTypes.DATE,
      allowNull: false
    },
    egressTo: {
      type: DataTypes.DATE,
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'Booking',
    tableName: 'Bookings',
  });
  return Booking;
};