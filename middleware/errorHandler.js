// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    // Log error to console for dev
    console.error(err.stack);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        return res.status(404).json({
            message: 'Resource not found'
        });
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        return res.status(400).json({
            message: 'Duplicate field value entered'
        });
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({
            message: messages
        });
    }

    // Default to 500 server error
    res.status(err.statusCode || 500).json({
        message: err.message || 'Server Error'
    });
};

module.exports = errorHandler;