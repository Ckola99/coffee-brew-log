const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Brew = sequelize.define(
  'Brew',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    beans: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: 'Beans is required' } },
    },
    method: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: 'Method is required' } },
    },
    coffeeGrams: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: { args: [0.1], msg: 'Coffee grams must be greater than 0' },
      },
    },
    waterGrams: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: { args: [0.1], msg: 'Water grams must be greater than 0' },
      },
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: [0], msg: 'Rating must be between 0 and 5' },
        max: { args: [5], msg: 'Rating must be between 0 and 5' },
      },
    },
    tastingNotes: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: 'Tasting notes is required' } },
    },
  },
  {
    tableName: 'brews',
    timestamps: true,
  }
);

module.exports = Brew;
