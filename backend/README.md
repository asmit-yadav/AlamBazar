# AlamBazar Backend API

Backend API for AlamBazar Car Bazar Management System with Firebase Authentication, Cloudinary Image Upload, and Firestore Database.

## Features

- ✅ Express.js REST API
- ✅ Firebase Admin SDK for authentication
- ✅ Cloudinary for image uploads
- ✅ Firestore for car data storage
- ✅ Protected routes with JWT token verification
- ✅ Input validation
- ✅ Error handling

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

#### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Go to **Project Settings** > **Service Accounts**
4. Click **Generate New Private Key**
5. Download the JSON file
6. Extract the following values from the JSON:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `private_key_id` → `FIREBASE_PRIVATE_KEY_ID`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep the `\n` characters)
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `client_id` → `FIREBASE_CLIENT_ID`
   - `client_x509_cert_url` → `FIREBASE_CLIENT_X509_CERT_URL`

#### Cloudinary Setup

1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Sign up or log in
3. Copy your credentials:
   - `Cloud name` → `CLOUDINARY_CLOUD_NAME`
   - `API Key` → `CLOUDINARY_API_KEY`
   - `API Secret` → `CLOUDINARY_API_SECRET`

### 3. Run the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000` (or PORT from .env)

## API Endpoints

### Authentication

- `POST /api/auth/login` - Verify admin user (email/password)
- `POST /api/auth/verify` - Verify Firebase ID token

### Cars (Protected - requires Bearer token)

- `GET /api/cars` - Get all cars (with filters and pagination)
- `GET /api/cars/:id` - Get single car by ID
- `POST /api/cars` - Create new car
- `PUT /api/cars/:id` - Update car
- `DELETE /api/cars/:id` - Delete car

### Upload (Protected - requires Bearer token)

- `POST /api/upload/images` - Upload multiple images (max 10)
- `POST /api/upload/single` - Upload single image

### Health Check

- `GET /api/health` - Server health check

## Authentication Flow

1. Frontend uses Firebase Client SDK to sign in with email/password
2. Frontend receives Firebase ID token
3. Frontend sends token in `Authorization: Bearer <token>` header
4. Backend verifies token using Firebase Admin SDK
5. Protected routes are accessible

## Request Examples

### Create Car (Protected)

```bash
POST /api/cars
Authorization: Bearer <firebase-id-token>
Content-Type: application/json

{
  "brand": "Toyota",
  "model": "Camry",
  "year": 2022,
  "price": 2500000,
  "mileage": 15000,
  "fuelType": "Petrol",
  "transmission": "Automatic",
  "color": "White",
  "description": "Well maintained car",
  "images": ["https://cloudinary.com/image1.jpg", "https://cloudinary.com/image2.jpg"]
}
```

### Upload Images (Protected)

```bash
POST /api/upload/images
Authorization: Bearer <firebase-id-token>
Content-Type: multipart/form-data

Form Data:
- images: [file1.jpg, file2.jpg, ...]
```

## Project Structure

```
backend/
├── server.js              # Main entry point
├── config/
│   ├── firebaseAdmin.js   # Firebase Admin SDK config
│   └── cloudinary.js      # Cloudinary config
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── cars.js            # Car CRUD routes
│   └── upload.js          # Image upload routes
├── middleware/
│   ├── auth.js            # Authentication middleware
│   └── errorHandler.js    # Error handling middleware
├── services/
│   └── carService.js      # Firestore operations
├── utils/
│   └── validators.js      # Input validation
├── .env                   # Environment variables (not in git)
├── .env.example           # Example environment variables
└── package.json
```

## Notes

- All protected routes require `Authorization: Bearer <token>` header
- Image uploads are limited to 10MB per file, max 10 files
- Car data is stored in Firestore `cars` collection
- Images are uploaded to Cloudinary folder: `alambazar/cars`
