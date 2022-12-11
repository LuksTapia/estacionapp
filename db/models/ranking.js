'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ranking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Ranking.belongsTo(models.Booking)
    }
  }
  Ranking.init({
    calification:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bookingId:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Ranking',
    tableName: 'Rankings',
  });
  return Ranking;
};