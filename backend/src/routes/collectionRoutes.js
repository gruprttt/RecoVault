// src/routes/collectionRoutes.js
const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collectionController');

// Add recommendation to collection
router.post('/collections/recommendations', collectionController.addRecommendationToCollection);

// Remove recommendation from collection
router.delete('/collections/:collection_id/recommendations/:recommendation_id', collectionController.removeRecommendationFromCollection);

// View recommendations of a collection with pagination
router.get('/collections/:collection_id/recommendations', collectionController.getCollectionRecommendations);

module.exports = router;
