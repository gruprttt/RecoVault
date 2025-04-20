#!/bin/bash

# Start the Node.js server
cd /home/ubuntu/backend
npm start &
SERVER_PID=$!

# Wait for server to start
sleep 5

# Test health endpoint
echo "Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s http://localhost:3000/api/health)
echo "Health endpoint response: $HEALTH_RESPONSE"

# Test adding a recommendation to a collection
echo -e "\nTesting add recommendation to collection..."
ADD_RESPONSE=$(curl -s -X POST http://localhost:3000/api/collections/recommendations \
  -H "Content-Type: application/json" \
  -d '{"collection_id": 1, "recommendation_id": 2}')
echo "Add recommendation response: $ADD_RESPONSE"

# Test viewing recommendations in a collection
echo -e "\nTesting view recommendations in collection..."
VIEW_RESPONSE=$(curl -s http://localhost:3000/api/collections/1/recommendations)
echo "View recommendations response: $VIEW_RESPONSE"

# Test removing a recommendation from a collection
echo -e "\nTesting remove recommendation from collection..."
REMOVE_RESPONSE=$(curl -s -X DELETE http://localhost:3000/api/collections/1/recommendations/2)
echo "Remove recommendation response: $REMOVE_RESPONSE"

# Test pagination
echo -e "\nTesting pagination..."
PAGINATION_RESPONSE=$(curl -s "http://localhost:3000/api/collections/1/recommendations?page=1&limit=2")
echo "Pagination response: $PAGINATION_RESPONSE"

# Kill the server
kill $SERVER_PID

echo -e "\nAPI testing completed!"
