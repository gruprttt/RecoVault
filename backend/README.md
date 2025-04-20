# Recommendation Collection API

This is a Node.js backend API for managing recommendation collections. Users can create collections and add their recommendations to these collections.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database (we're using neon.tech)

### Installation

1. Clone the repository
2. Install dependencies:
```
npm install
```
3. Create a `.env` file in the root directory with the following variables:
```
DATABASE_URL=postgres://your_username:your_password@your_neon_host/your_database
PORT=3000
```
4. Import sample data:
```
node src/scripts/importData.js
```
5. Start the server:
```
npm start
```

## API Endpoints

### Add Recommendation to Collection
- **URL**: `/api/collections/recommendations`
- **Method**: `POST`
- **Body**:
```json
{
  "collection_id": 1,
  "recommendation_id": 2
}
```
- **Response**: 201 Created

### Remove Recommendation from Collection
- **URL**: `/api/collections/:collection_id/recommendations/:recommendation_id`
- **Method**: `DELETE`
- **Response**: 200 OK

### View Recommendations of a Collection
- **URL**: `/api/collections/:collection_id/recommendations`
- **Method**: `GET`
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
- **Response**: 200 OK

## Error Handling

The API handles various error scenarios:
- Attempting to add a recommendation that doesn't belong to the user
- Trying to view collections for a non-existent user
- Other error scenarios

## Database Schema

The database consists of the following tables:
- `users`: User information
- `recommendations`: User recommendations
- `collections`: User-created collections
- `collection_recommendations`: Junction table for many-to-many relationship
