'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vehicle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Vehicle.hasOne(models.Booking)
      Vehicle.belongsTo(models.User)
    }
  }
  Vehicle.init({
    patent: DataTypes.STRING(7),
    userId: DataTypes.NUMBER,
  }, {
    sequelize,
    modelName: 'Vehicle',
    tableName: 'Vehicles',
  });
  return Vehicle;
};