// models/Schedule.js
const mongoose = require('mongoose');

const setSchema = new mongoose.Schema({
    setNumber: {
        type: Number,
        required: true
    },
    reps: {
        type: Number,
        required: true
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

module.exports = mongoose.model('Schedule', scheduleSchema);