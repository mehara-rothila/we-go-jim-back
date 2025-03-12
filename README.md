# WE GO JIM - Complete Documentation

## Project Overview

WE GO JIM is a modern workout tracking application that helps users monitor their fitness journey, track workouts, and analyze progress over time. The application features a dark/light theme toggle, responsive design, and intuitive workout schedule management.

## System Architecture

The application follows a client-server architecture:

- **Frontend**: React-based SPA (Single Page Application) using Vite as the build tool
- **Backend**: Express.js REST API server
- **Database**: MongoDB for data persistence

## Directory Structure

### Backend Structure
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

### Frontend Structure
```
frontend/
├── node_modules/            # Dependencies
├── public/                  # Static assets
├── src/
│   ├── assets/              # Images, fonts, etc.
│   ├── components/
│   │   ├── common/
│   │   │   └── LoadingScreen.jsx  # Loading indicator component
│   │   ├── features/              # Feature-specific components
│   │   ├── hooks/                 # Custom React hooks
│   │   │   └── useWorkouts.js     # Hook for workout data management
│   │   ├── layout/
│   │   │   ├── Layout.jsx         # Main layout wrapper
│   │   │   ├── Navbar.jsx         # Top navigation bar
│   │   │   └── Sidebar.jsx        # Side navigation menu
│   │   ├── store/slices/
│   │   │   └── workoutSlice.js    # State management for workouts
│   │   └── workouts/
│   │       └── EditScheduleModal.jsx  # Modal for editing schedules
│   ├── context/
│   │   ├── AuthContext.jsx        # Authentication context provider
│   │   └── ThemeContext.jsx       # Theme context provider
│   ├── data/
│   │   └── workoutData.js         # Static workout data
│   ├── hooks/                     # Application-wide custom hooks
│   ├── pages/
│   │   ├── Dashboard.jsx          # Dashboard page
│   │   ├── Exercises.jsx          # Exercise library page
│   │   ├── Login.jsx              # Login page
│   │   ├── Profile.jsx            # User profile page
│   │   ├── Register.jsx           # Registration page
│   │   ├── Stats.jsx              # Statistics page
│   │   └── Workouts.jsx           # Workout schedules page
│   ├── services/
│   │   └── api.js                 # API service for backend communication
│   ├── utils/                     # Utility functions
│   ├── App.css                    # Global styles
│   ├── App.jsx                    # Main application component
│   ├── index.css                  # Entry CSS file
│   └── main.jsx                   # Application entry point
└── .gitignore                     # Git ignore file
```

## Tech Stack

### Frontend Technologies
- **React**: UI library for building the user interface
- **Vite**: Build tool for fast development and optimized production builds
- **React Router DOM**: For client-side routing
- **Axios**: HTTP client for API communication
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Icon library
- **React Hook Form**: Form handling and validation
- **React Context API**: State management
- **Recharts**: For data visualization charts

### Backend Technologies
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
   - Frontend stores JWT token in localStorage
   - Token is included in Authorization header for protected requests
   - Backend middleware validates token for protected routes

## Context Providers

### AuthContext
Manages authentication state throughout the application:
- User data storage
- Login/Register functions
- Token management
- Authentication state

```javascript
// Key functions
const register = async (name, email, password) => {...}
const login = async (email, password) => {...}
const logout = () => {...}
```

### ThemeContext
Manages the application theme (dark/light mode):
- Theme state storage
- Theme toggle functionality
- Theme persistence

```javascript
// Key functions
const toggleTheme = () => {...}
```

## Custom Hooks

### useSchedules
Centralizes workout schedule management:
- Fetching all schedules
- Adding a new schedule
- Error and loading states

```javascript
// Usage
const { schedules, loading, error, fetchSchedules, addSchedule } = useSchedules();
```

## Components

### Layout Components
- **Layout**: Main layout wrapper with Navbar and Sidebar
- **Navbar**: Top navigation bar with theme toggle and user menu
- **Sidebar**: Navigation menu for accessing different pages

### Workout Components
- **EditScheduleModal**: Modal for editing workout schedules
  - Allows editing days, exercises, sets and reps

### Common Components
- **LoadingScreen**: Loading indicator for async operations

## Pages

### Authentication Pages
- **Login**: User login form
- **Register**: New user registration form

### Main Content Pages
- **Dashboard**: Overview of workout statistics and progress
  - Muscle group progress visualization
  - Recent workouts display
  - Key workout metrics
- **Workouts**: Manage workout schedules
  - Create, read, update, delete schedules
  - Search through schedules
- **Exercises**: Browse exercise library
  - Filter exercises by category and equipment
- **Stats**: View detailed workout statistics (in development)
- **Profile**: User profile management (in development)

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

### Backend Setup
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

### Frontend Setup
1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
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
- Use functional components with hooks
- Implement proper error handling

### State Management
- Use React Context for global state
- Use component state for local UI state
- Use custom hooks for reusable state logic

### Performance Optimization
- Implement proper memoization (useCallback, useMemo)
- Optimize re-renders
- Lazy load components when appropriate

### Security Best Practices
- Store sensitive data in environment variables
- Implement proper input validation
- Use HTTP-only cookies for sensitive data
- Implement proper CORS configuration

## Deployment

### Backend Deployment
1. Set up a MongoDB Atlas cluster
2. Configure environment variables
3. Deploy to a Node.js hosting service (Heroku, Vercel, etc.)

### Frontend Deployment
1. Build the production bundle:
```bash
npm run build
```
2. Deploy the `dist` directory to a static hosting service (Netlify, Vercel, etc.)

## Future Development

### Planned Features
1. **Exercise Database**: Comprehensive exercise library with instructions
2. **Progress Tracking**: Visual charts showing progress over time
3. **Workout Timer**: Integrated timer for tracking workout duration
4. **Personal Records**: Track personal bests for exercises
5. **Nutrition Tracking**: Basic calorie and macronutrient tracking
6. **Social Features**: Share workouts and achievements
7. **Mobile App**: Native mobile experience

## Troubleshooting

### Common Issues

#### MongoDB Connection Issues
- Verify your IP address is whitelisted in MongoDB Atlas
- Check network connectivity
- Verify connection string is correct

#### Authentication Issues
- Clear localStorage and try logging in again
- Check for proper JWT token configuration
- Verify token expiration settings

#### Frontend Build Issues
- Clear node_modules and reinstall dependencies
- Verify compatible Node.js version
- Check for any lint or build errors

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
- Track user engagement metrics

---

## License
This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

---

*Documentation last updated: March 12, 2025*
