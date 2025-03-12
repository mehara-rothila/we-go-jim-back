// routes/schedule.js
const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule');
const { protect } = require('../middleware/auth');

// Get all schedules for logged in user
router.get('/', protect, async (req, res) => {
    try {
        const schedules = await Schedule.find({ userId: req.user.id });
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ message: 'Error getting schedules' });
    }
});

// Create a new schedule
router.post('/', protect, async (req, res) => {
    try {
        const schedule = await Schedule.create({
            userId: req.user.id,
            ...req.body
        });
        res.status(201).json(schedule);
    } catch (error) {
        res.status(500).json({ message: 'Error creating schedule' });
    }
});

// Update a schedule
router.put('/:id', protect, async (req, res) => {
    try {
        const schedule = await Schedule.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        // Update name if provided
        if (req.body.name) {
            schedule.name = req.body.name;
        }

        // Update workouts if provided
        if (req.body.workouts) {
            schedule.workouts = req.body.workouts;
        }

        await schedule.save();
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ message: 'Error updating schedule' });
    }
});

// Delete a schedule
router.delete('/:id', protect, async (req, res) => {
    try {
        const schedule = await Schedule.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        res.json({ message: 'Schedule deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting schedule' });
    }
});

module.exports = router;