// models/WorkoutSession.js
const mongoose = require('mongoose');

const loggedSetSchema = new mongoose.Schema({
    setNumber: {
        type: Number,
        required: true
    },
    plannedReps: {
        type: Number,
        required: true
    },
    actualReps: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true,
        default: 0
    },
    completed: {
        type: Boolean,
        default: true
    }
});

const loggedExerciseSchema = new mongoose.Schema({
    exerciseName: {
        type: String,
        required: true
    },
    sets: [loggedSetSchema],
    notes: {
        type: String,
        default: ''
    }
});

const workoutSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    scheduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Schedule',
        required: true
    },
    scheduleName: {
        type: String,
        required: true
    },
    workoutDay: {
        type: String,
        required: true
    },
    exercises: [loggedExerciseSchema],
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type: Date
    },
    duration: {
        type: Number // in minutes
    },
    status: {
        type: String,
        enum: ['in-progress', 'completed', 'cancelled'],
        default: 'in-progress'
    },
    notes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('WorkoutSession', workoutSessionSchema);