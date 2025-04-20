// src/models/CollectionRecommendation.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Collection = require('./Collection');
const Recommendation = require('./Recommendation');

const CollectionRecommendation = sequelize.define('CollectionRecommendation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  collection_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Collection,
      key: 'id'
    }
  },
  recommendation_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Recommendation,
      key: 'id'
    }
  },
  added_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'collection_recommendations',
  timestamps: false
});

// Define associations
Collection.belongsToMany(Recommendation, { 
  through: CollectionRecommendation,
  foreignKey: 'collection_id',
  otherKey: 'recommendation_id'
});

Recommendation.belongsToMany(Collection, { 
  through: CollectionRecommendation,
  foreignKey: 'recommendation_id',
  otherKey: 'collection_id'
});

module.exports = CollectionRecommendation;
