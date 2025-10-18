// routes/workoutSession.js
const express = require('express');
const router = express.Router();
const WorkoutSession = require('../models/WorkoutSession');
const Schedule = require('../models/Schedule');
const { protect } = require('../middleware/auth');

// Get all workout sessions for logged in user
router.get('/', protect, async (req, res) => {
    try {
        const sessions = await WorkoutSession.find({ userId: req.user.id })
            .sort({ createdAt: -1 });
        res.json(sessions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting workout sessions' });
    }
});

// Get workout sessions by date range
router.get('/date-range', protect, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        const query = { userId: req.user.id };
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        
        const sessions = await WorkoutSession.find(query)
            .sort({ createdAt: -1 });
        res.json(sessions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting workout sessions' });
    }
});

// Start a new workout session from a schedule
router.post('/start', protect, async (req, res) => {
    try {
        const { scheduleId, workoutDay } = req.body;
        
        // Get the schedule and specific workout day
        const schedule = await Schedule.findOne({
            _id: scheduleId,
            userId: req.user.id
        });
        
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }
        
        const workout = schedule.workouts.find(w => w.day === workoutDay);
        if (!workout) {
            return res.status(404).json({ message: 'Workout day not found' });
        }
        
        // Create a new workout session with the template data
        const session = await WorkoutSession.create({
            userId: req.user.id,
            scheduleId: schedule._id,
            scheduleName: schedule.name,
            workoutDay: workoutDay,
            exercises: workout.exercises.map(exercise => ({
                exerciseName: exercise.exerciseName,
                sets: exercise.sets.map(set => ({
                    setNumber: set.setNumber,
                    plannedReps: set.reps,
                    actualReps: set.reps,
                    weight: set.weight || 0,
                    completed: false
                })),
                notes: ''
            })),
            status: 'in-progress'
        });
        
        res.status(201).json(session);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error starting workout session' });
    }
});

// Create a completed workout session (for logging past workouts)
router.post('/', protect, async (req, res) => {
    try {
        const session = await WorkoutSession.create({
            userId: req.user.id,
            ...req.body
        });
        
        res.status(201).json(session);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error starting workout session' });
    }
});

// Update a workout session (log sets, update weights, etc.)
router.put('/:id', protect, async (req, res) => {
    try {
        const session = await WorkoutSession.findOne({
            _id: req.params.id,
            userId: req.user.id
        });
        
        if (!session) {
            return res.status(404).json({ message: 'Workout session not found' });
        }
        
        // Update the session with new data
        Object.assign(session, req.body);
        
        // If marking as completed, set end time and calculate duration
        if (req.body.status === 'completed' && !session.endTime) {
            session.endTime = new Date();
            session.duration = Math.round((session.endTime - session.startTime) / (1000 * 60));
        }
        
        await session.save();
        res.json(session);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating workout session' });
    }
});

// Complete a workout session
router.post('/:id/complete', protect, async (req, res) => {
    try {
        const session = await WorkoutSession.findOne({
            _id: req.params.id,
            userId: req.user.id
        });
        
        if (!session) {
            return res.status(404).json({ message: 'Workout session not found' });
        }
        
        session.status = 'completed';
        session.endTime = new Date();
        session.duration = Math.round((session.endTime - session.startTime) / (1000 * 60));
        
        if (req.body.notes) {
            session.notes = req.body.notes;
        }
        
        await session.save();
        res.json(session);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error completing workout session' });
    }
});

// Delete a workout session
router.delete('/:id', protect, async (req, res) => {
    try {
        const session = await WorkoutSession.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });
        
        if (!session) {
            return res.status(404).json({ message: 'Workout session not found' });
        }
        
        res.json({ message: 'Workout session deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting workout session' });
    }
});

module.exports = router;