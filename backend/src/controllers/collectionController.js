// src/controllers/collectionController.js
const { Collection, Recommendation, CollectionRecommendation, User } = require('../models');
const { sequelize } = require('../config/database');

// Add recommendation to collection
exports.addRecommendationToCollection = async (req, res) => {
  const { collection_id, recommendation_id } = req.body;
  
  try {
    // Check if collection exists
    const collection = await Collection.findByPk(collection_id);
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }
    
    // Check if recommendation exists
    const recommendation = await Recommendation.findByPk(recommendation_id);
    if (!recommendation) {
      return res.status(404).json({ error: 'Recommendation not found' });
    }
    
    // Check if recommendation belongs to the user
    if (recommendation.user_id !== collection.user_id) {
      return res.status(403).json({ error: 'Cannot add a recommendation that does not belong to the user' });
    }
    
    // Check if recommendation is already in the collection
    const existingEntry = await CollectionRecommendation.findOne({
      where: {
        collection_id,
        recommendation_id
      }
    });
    
    if (existingEntry) {
      return res.status(409).json({ error: 'Recommendation is already in this collection' });
    }
    
    // Add recommendation to collection
    const collectionRecommendation = await CollectionRecommendation.create({
      collection_id,
      recommendation_id
    });
    
    res.status(201).json({
      message: 'Recommendation added to collection successfully',
      data: collectionRecommendation
    });
  } catch (error) {
    console.error('Error adding recommendation to collection:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Remove recommendation from collection
exports.removeRecommendationFromCollection = async (req, res) => {
  const { collection_id, recommendation_id } = req.params;
  
  try {
    // Check if collection exists
    const collection = await Collection.findByPk(collection_id);
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }
    
    // Check if recommendation exists in the collection
    const collectionRecommendation = await CollectionRecommendation.findOne({
      where: {
        collection_id,
        recommendation_id
      }
    });
    
    if (!collectionRecommendation) {
      return res.status(404).json({ error: 'Recommendation not found in this collection' });
    }
    
    // Remove recommendation from collection
    await collectionRecommendation.destroy();
    
    res.status(200).json({
      message: 'Recommendation removed from collection successfully'
    });
  } catch (error) {
    console.error('Error removing recommendation from collection:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// View recommendations of a collection with pagination
exports.getCollectionRecommendations = async (req, res) => {
  const { collection_id } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  
  try {
    // Check if collection exists
    const collection = await Collection.findByPk(collection_id);
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }
    
    // Get recommendations in the collection with pagination
    const { count, rows } = await Recommendation.findAndCountAll({
      include: [
        {
          model: Collection,
          where: { id: collection_id },
          attributes: [],
          through: { attributes: [] }
        },
        {
          model: User,
          attributes: ['id', 'fname', 'sname', 'profile_picture']
        }
      ],
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    res.status(200).json({
      data: rows,
      pagination: {
        total: count,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage,
        hasPrevPage
      }
    });
  } catch (error) {
    console.error('Error getting collection recommendations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
