const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Updated CORS configuration for deployment
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Allow requests from specified frontend or any origin as fallback
  credentials: true
}));

// Connect to MongoDB with updated options
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
    .then(() => {
        console.log('MongoDB Connected');
    })
    .catch((err) => {
        console.log('MongoDB connection error:', err);
        process.exit(1);
    });

// Handle MongoDB connection errors
mongoose.connection.on('error', err => {
    console.log('MongoDB connection error:', err);
});

mongoose.connection.on('connected', () => {
    console.log('MongoDB connected successfully');
});

// Add a simple health check route for deployment platforms
app.get('/', (req, res) => {
    res.status(200).json({ message: 'WE GO JIM API is running' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/schedules', require('./routes/schedule'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/exercises', require('./routes/exercise'));

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});