# Backend & DevOps Hybrid Coding Challenge Documentation

This document provides comprehensive documentation for the Backend & DevOps Hybrid Coding Challenge implementation, including setup instructions, system design, and testing procedures.

## Table of Contents
1. [Project Overview](#project-overview)
2. [Backend Implementation](#backend-implementation)
3. [Infrastructure as Code](#infrastructure-as-code)
4. [Setup Instructions](#setup-instructions)
5. [API Documentation](#api-documentation)
6. [Testing Instructions](#testing-instructions)
7. [Design Decisions and Assumptions](#design-decisions-and-assumptions)

## Project Overview

This project implements a backend system for managing recommendation collections and the infrastructure as code to deploy it to AWS. The system allows users to create collections and add their recommendations (movies, TV shows, places, etc.) to these collections.

### Key Features
- Add recommendations to collections
- Remove recommendations from collections
- View recommendations within a collection
- Pagination support for viewing recommendations
- Infrastructure as code for AWS deployment

## Backend Implementation

The backend is implemented using Node.js with Express framework and uses PostgreSQL for data storage.

### Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (hosted on neon.tech)
- **ORM**: Sequelize

### Database Schema

The database consists of the following tables:

1. **users**
   - `id`: BIGINT (Primary Key)
   - `fname`: VARCHAR(255)
   - `sname`: VARCHAR(255)
   - `profile_picture`: TEXT
   - `bio`: TEXT
   - `created_at`: TIMESTAMP

2. **recommendations**
   - `id`: BIGINT (Primary Key)
   - `user_id`: BIGINT (Foreign Key to users.id)
   - `title`: VARCHAR(255)
   - `caption`: TEXT
   - `category`: VARCHAR(50)
   - `created_at`: TIMESTAMP

3. **collections**
   - `id`: BIGINT (Primary Key)
   - `user_id`: BIGINT (Foreign Key to users.id)
   - `title`: VARCHAR(255)
   - `created_at`: TIMESTAMP

4. **collection_recommendations** (Junction table)
   - `id`: BIGINT (Primary Key)
   - `collection_id`: BIGINT (Foreign Key to collections.id)
   - `recommendation_id`: BIGINT (Foreign Key to recommendations.id)
   - `added_at`: TIMESTAMP

### Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   └── collectionController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Recommendation.js
│   │   ├── Collection.js
│   │   ├── CollectionRecommendation.js
│   │   └── index.js
│   ├── routes/
│   │   ├── collectionRoutes.js
│   │   └── healthRoutes.js
│   ├── scripts/
│   │   └── importData.js
│   └── index.js
├── users.csv
├── recommendations.csv
├── collections.csv
├── test_api.sh
├── package.json
└── README.md
```

## Infrastructure as Code

The infrastructure is defined using Terraform and includes all necessary AWS components to host the API.

### AWS Components

1. **VPC and Networking**
   - VPC with public and private subnets
   - Internet Gateway
   - Route Tables
   - Security Groups

2. **Compute**
   - EC2 instance for hosting the API

3. **Load Balancing**
   - Application Load Balancer
   - Target Group
   - Listener

### Terraform Structure

```
terraform/
├── main.tf
├── variables.tf
├── outputs.tf
├── vpc.tf
├── security_groups.tf
├── ec2.tf
├── alb.tf
├── validate_terraform.sh
└── README.md
```

## Setup Instructions

### Backend Setup

1. **Clone the repository**

2. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the backend directory with the following variables:
   ```
   DATABASE_URL=postgres://your_username:your_password@your_neon_host/your_database
   PORT=3000
   ```

4. **Set up the database**
   - Create a PostgreSQL database on neon.tech
   - Import sample data using the provided script:
     ```bash
     node src/scripts/importData.js
     ```

5. **Start the server**
   ```bash
   npm start
   ```

### Infrastructure Setup

1. **Install Terraform**
   Follow the [official Terraform installation guide](https://learn.hashicorp.com/tutorials/terraform/install-cli)

2. **Configure AWS credentials**
   Set up your AWS credentials using one of the following methods:
   - AWS CLI configuration
   - Environment variables
   - Shared credentials file

3. **Initialize Terraform**
   ```bash
   cd terraform
   terraform init
   ```

4. **Review the execution plan**
   ```bash
   terraform plan
   ```

5. **Apply the configuration**
   ```bash
   terraform apply
   ```

## API Documentation

### Endpoints

#### 1. Add Recommendation to Collection
- **URL**: `/api/collections/recommendations`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "collection_id": 1,
    "recommendation_id": 2
  }
  ```
- **Success Response**: 201 Created
  ```json
  {
    "message": "Recommendation added to collection successfully",
    "data": {
      "id": 1,
      "collection_id": 1,
      "recommendation_id": 2,
      "added_at": "2025-04-19T10:30:00.000Z"
    }
  }
  ```
- **Error Responses**:
  - 404 Not Found: Collection or recommendation not found
  - 403 Forbidden: Cannot add a recommendation that does not belong to the user
  - 409 Conflict: Recommendation is already in this collection

#### 2. Remove Recommendation from Collection
- **URL**: `/api/collections/:collection_id/recommendations/:recommendation_id`
- **Method**: `DELETE`
- **Success Response**: 200 OK
  ```json
  {
    "message": "Recommendation removed from collection successfully"
  }
  ```
- **Error Responses**:
  - 404 Not Found: Collection or recommendation not found in the collection

#### 3. View Recommendations of a Collection
- **URL**: `/api/collections/:collection_id/recommendations`
- **Method**: `GET`
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
- **Success Response**: 200 OK
  ```json
  {
    "data": [
      {
        "id": 1,
        "user_id": 1,
        "title": "The Shawshank Redemption",
        "caption": "A must-watch classic about hope and redemption",
        "category": "movies",
        "created_at": "2025-04-19T10:30:00.000Z",
        "User": {
          "id": 1,
          "fname": "John",
          "sname": "Doe",
          "profile_picture": "https://randomuser.me/api/portraits/men/1.jpg"
        }
      }
    ],
    "pagination": {
      "total": 1,
      "totalPages": 1,
      "currentPage": 1,
      "limit": 10,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
  ```
- **Error Responses**:
  - 404 Not Found: Collection not found

#### 4. Health Check
- **URL**: `/api/health`
- **Method**: `GET`
- **Success Response**: 200 OK
  ```json
  {
    "status": "ok",
    "message": "API is running"
  }
  ```

## Testing Instructions

### Backend API Testing

1. **Make the test script executable**
   ```bash
   chmod +x test_api.sh
   ```

2. **Run the test script**
   ```bash
   ./test_api.sh
   ```

   This script will:
   - Start the Node.js server
   - Test the health endpoint
   - Test adding a recommendation to a collection
   - Test viewing recommendations in a collection
   - Test removing a recommendation from a collection
   - Test pagination
   - Stop the server

### Terraform Validation

1. **Make the validation script executable**
   ```bash
   chmod +x validate_terraform.sh
   ```

2. **Run the validation script**
   ```bash
   ./validate_terraform.sh
   ```

   This script will:
   - Validate the Terraform configuration
   - Check for required resources
   - Verify security best practices

## Design Decisions and Assumptions

### Backend Design

1. **Database Schema**
   - Used a junction table (collection_recommendations) to represent the many-to-many relationship between collections and recommendations
   - Added timestamps to track when items were created and added to collections

2. **API Design**
   - Implemented RESTful API endpoints following best practices
   - Added pagination to handle potentially large collections
   - Included proper error handling for various scenarios

3. **Security Considerations**
   - Implemented validation to ensure users can only add their own recommendations to collections
   - Added error handling for unauthorized access attempts

### Infrastructure Design

1. **Network Architecture**
   - Used a VPC with both public and private subnets for security
   - Placed the EC2 instance in a public subnet for accessibility
   - Implemented security groups with principle of least privilege

2. **Load Balancing**
   - Used an Application Load Balancer for HTTP/HTTPS traffic
   - Implemented health checks to ensure high availability

3. **Security Best Practices**
   - Restricted security group rules to only necessary ports
   - Followed AWS best practices for network security
   - Implemented proper access controls

4. **Assumptions**
   - Assumed a single EC2 instance is sufficient for the initial deployment
   - Assumed the application will be deployed in the us-east-1 region
   - Assumed t2.micro instance type is adequate for the application's needs
