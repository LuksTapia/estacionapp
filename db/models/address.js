'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Address.hasOne(models.Parking)
      Address.belongsTo(models.Location)

    }
  }
  Address.init({
    streetName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    streetNumber: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    locationId: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Address',
    tableName: 'Addresses',
  });
  return Address;
};