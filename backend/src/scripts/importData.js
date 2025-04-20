// src/scripts/importData.js
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { sequelize } = require('../config/database');
const { User, Recommendation, Collection, CollectionRecommendation } = require('../models');

// Function to parse CSV file
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
};

// Import data function
const importData = async () => {
  try {
    // Sync database models
    await sequelize.sync({ force: true });
    console.log('Database synchronized');

    // Import users
    const usersData = await parseCSV(path.join(__dirname, '../../users.csv'));
    await User.bulkCreate(usersData);
    console.log(`Imported ${usersData.length} users`);

    // Import recommendations
    const recommendationsData = await parseCSV(path.join(__dirname, '../../recommendations.csv'));
    await Recommendation.bulkCreate(recommendationsData);
    console.log(`Imported ${recommendationsData.length} recommendations`);

    // Import collections
    const collectionsData = await parseCSV(path.join(__dirname, '../../collections.csv'));
    await Collection.bulkCreate(collectionsData);
    console.log(`Imported ${collectionsData.length} collections`);

    // Create some sample collection-recommendation relationships
    const collectionRecommendations = [
      { collection_id: 1, recommendation_id: 1 },
      { collection_id: 1, recommendation_id: 6 },
      { collection_id: 2, recommendation_id: 2 },
      { collection_id: 3, recommendation_id: 3 },
      { collection_id: 4, recommendation_id: 4 },
      { collection_id: 5, recommendation_id: 5 },
      { collection_id: 5, recommendation_id: 7 }
    ];
    
    await CollectionRecommendation.bulkCreate(collectionRecommendations);
    console.log(`Created ${collectionRecommendations.length} collection-recommendation relationships`);

    console.log('Data import completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

// Run the import
importData();
