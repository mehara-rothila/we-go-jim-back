# WE GO JIM - Backend Documentation

## Overview

The WE GO JIM backend is built as a RESTful API service using Express.js and MongoDB. It provides secure user authentication, comprehensive workout schedule management, exercise library functionality, and performance analytics.

## Directory Structure

```
backend/
├── config/
│   └── db.js                # Database configuration
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   └── errorHandler.js      # Global error handling middleware
├── models/
│   ├── Schedule.js          # Schedule data model
│   ├── User.js              # User data model
│   └── Exercise.js          # Exercise data model
├── controllers/
│   ├── auth.js              # Authentication controller
│   ├── schedule.js          # Schedule management controller
│   ├── stats.js             # Performance statistics controller
│   └── exercise.js          # Exercise library controller
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── schedule.js          # Workout schedule routes
│   ├── stats.js             # Performance statistics routes
│   └── exercise.js          # Exercise library routes
├── .env                     # Environment variables
├── package-lock.json        # Dependency lock file
├── package.json             # Project metadata & dependencies
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

### Exercise Model
```javascript
const exerciseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core']
    },
    equipment: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        required: true,
        enum: ['Beginner', 'Intermediate', 'Advanced']
    },
    description: {
        type: String,
        default: ''
    },
    isDefault: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
```

## Key Features

### Auto-Seeding Exercise Library
The application automatically populates the database with a set of default exercises when a user first accesses the exercise library. This ensures that every new installation of the application comes with pre-populated exercise data, making it ready to use immediately.

```javascript
// Default exercises to seed
const defaultExercises = [
    {
        name: 'Bench Press',
        category: 'Chest',
        equipment: 'Barbell',
        difficulty: 'Intermediate',
        description: 'A compound exercise that primarily targets the chest, shoulders, and triceps.',
        isDefault: true
    },
    // Additional default exercises...
];

// Seed default exercises if none exist
const seedDefaultExercises = async () => {
    try {
        const count = await Exercise.countDocuments();
        if (count === 0) {
            await Exercise.insertMany(defaultExercises);
            console.log('Default exercises seeded successfully');
        }
    } catch (error) {
        console.error('Error seeding default exercises:', error);
    }
};
```

### Performance Analytics
The backend calculates comprehensive workout statistics and metrics for detailed performance analysis:
- Weekly workout summaries
- Monthly performance trends
- Key performance indicators and metrics

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

### Exercise Endpoints

| Method | Endpoint               | Description               | Request Body                   | Response                                 |
|--------|------------------------|---------------------------|-------------------------------|------------------------------------------|
| GET    | /api/exercises         | Get all exercises         | -                             | `[{ _id, name, category, ... }]`        |
| GET    | /api/exercises/:id     | Get single exercise       | -                             | `{ _id, name, category, ... }`         |
| POST   | /api/exercises         | Create a new exercise     | `{ name, category, ... }`     | `{ _id, name, category, ... }`         |
| PUT    | /api/exercises/:id     | Update an exercise        | `{ name?, category?, ... }`   | `{ _id, name, category, ... }`         |
| DELETE | /api/exercises/:id     | Delete an exercise        | -                             | `{ message: "Exercise deleted" }`       |

### Statistics Endpoints

| Method | Endpoint                        | Description                | Response                                 |
|--------|--------------------------------|----------------------------|------------------------------------------|
| GET    | /api/stats/weekly-summary      | Get weekly workout stats   | `[{ day, totalVolume, totalSets, ... }]`|
| GET    | /api/stats/monthly-summary     | Get monthly workout stats  | `[{ week, totalVolume, ... }]`          |
| GET    | /api/stats/performance-metrics | Get performance metrics    | `{ totalWorkouts, volumeChange, ... }`  |

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

### API Structure
- Follow RESTful conventions
- Group related endpoints under logical route paths
- Use middleware for common functionality like authentication
- Implement proper error handling and responses

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

*Documentation last updated: March 18, 2025*