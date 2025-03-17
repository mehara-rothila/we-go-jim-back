# WE GO JIM - Backend Documentation

## Overview

The WE GO JIM backend is built as a RESTful API service using Express.js and MongoDB. It provides secure user authentication and comprehensive workout schedule management functionality.

## Directory Structure

```
backend/
├── config/
│   └── db.js                # Database configuration
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── models/
│   ├── Schedule.js          # Schedule data model
│   └── User.js              # User data model
├── routes/
│   ├── auth.js              # Authentication routes
│   └── schedule.js          # Workout schedule routes
├── .env                     # Environment variables
├── package-lock.json        # Dependency lock file
├── package.json             # Project metadata & dependencies
├── reset-password.js        # Utility script for password reset
└── server.js                # Main server entry point
```

## Tech Stack

- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: MongoDB object modeling
- **JWT (JSON Web Tokens)**: For secure authentication
- **bcryptjs**: For password hashing
- **dotenv**: For environment variable management
- **CORS**: Middleware for enabling CORS

## Database Models

### User Model
```javascript
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
```

### Schedule Model
```javascript
const setSchema = new mongoose.Schema({
    setNumber: {
        type: Number,
        required: true
    },
    reps: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: false,
        default: 0
    }
});

const exerciseSchema = new mongoose.Schema({
    exerciseName: {
        type: String,
        required: true
    },
    sets: [setSchema]
});

const workoutSchema = new mongoose.Schema({
    day: {
        type: String,
        required: true,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    exercises: [exerciseSchema]
});

const scheduleSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    workouts: [workoutSchema]
}, {
    timestamps: true
});
```

## API Endpoints

### Authentication Endpoints

| Method | Endpoint           | Description                | Request Body                              | Response                                            |
|--------|-------------------|---------------------------|-------------------------------------------|-----------------------------------------------------|
| POST   | /api/auth/register | Register a new user       | `{ name, email, password }`              | `{ _id, name, email, token }`                      |
| POST   | /api/auth/login    | Login a user              | `{ email, password }`                    | `{ _id, name, email, token }`                      |
| GET    | /api/auth/me       | Get current user profile  | -                                         | `{ _id, name, email }`                            |

### Schedule Endpoints

| Method | Endpoint               | Description               | Request Body                   | Response                                 |
|--------|------------------------|---------------------------|-------------------------------|------------------------------------------|
| GET    | /api/schedules         | Get all user schedules    | -                             | `[{ _id, name, workouts, ... }]`        |
| POST   | /api/schedules         | Create a new schedule     | `{ name, workouts }`          | `{ _id, name, workouts, ... }`         |
| PUT    | /api/schedules/:id     | Update a schedule         | `{ name?, workouts? }`        | `{ _id, name, workouts, ... }`         |
| DELETE | /api/schedules/:id     | Delete a schedule         | -                             | `{ message: "Schedule deleted" }`       |

## Authentication Flow

1. **Registration**:
   - User submits name, email, and password
   - Server hashes the password using bcrypt
   - Server creates a new user record in the database
   - Server generates a JWT token and returns it with user data

2. **Login**:
   - User submits email and password
   - Server validates credentials and compares hashed password
   - If valid, server generates a JWT token and returns it with user data

3. **Authentication**:
   - Token is expected in Authorization header for protected requests
   - Backend middleware validates token for protected routes

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB Atlas account

### Environment Setup
Create a `.env` file in the backend directory:
```
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/we-go-jim
JWT_SECRET=your_jwt_secret_key
```

### Installation

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start server:
```bash
# Production mode
npm start

# Development mode with auto-restart
npm run dev
```

### Password Reset Utility
If you need to reset a user's password:
1. Modify the `reset-password.js` script with the target email
2. Run the script:
```bash
node reset-password.js
```

## Development Guidelines

### Code Style
- Follow ESLint/Prettier configurations
- Implement proper error handling
- Use async/await for asynchronous operations

### Security Best Practices
- Store sensitive data in environment variables
- Implement proper input validation
- Use HTTP-only cookies for sensitive data
- Implement proper CORS configuration

### Database Best Practices
- Implement proper indexing for frequently queried fields
- Use data validation at the model level
- Implement proper error handling for database operations

## Deployment

### Backend Deployment
1. Set up a MongoDB Atlas cluster
2. Configure environment variables
3. Deploy to a Node.js hosting service (Heroku, Vercel, etc.)

## Troubleshooting

### Common Issues

#### MongoDB Connection Issues
- Verify your IP address is whitelisted in MongoDB Atlas
- Check network connectivity
- Verify connection string is correct

#### Authentication Issues
- Check for proper JWT token configuration
- Verify token expiration settings
- Ensure secret key is properly set

## Maintenance

### Updating Dependencies
Regularly update dependencies to maintain security and performance:
```bash
npm update
```

### Database Maintenance
- Implement regular backups of MongoDB data
- Monitor database performance
- Implement proper indexing for frequently queried fields

### Monitoring
- Implement error logging
- Monitor API performance
- Track server health metrics

---

## License
This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

---

*Documentation last updated: March 17, 2025*