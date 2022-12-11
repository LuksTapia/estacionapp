'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    
    static associate(models) {
      Location.hasMany(models.Address)
    }
  }
  Location.init({
    locationName: { 
      type: DataTypes.STRING(30),
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Location',
    tableName: 'Locations', 
  });
  return Location;
};