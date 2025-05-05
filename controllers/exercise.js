// controllers/exercise.js
const Exercise = require('../models/Exercise');
const mongoose = require('mongoose');

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
    {
        name: 'Squats',
        category: 'Legs',
        equipment: 'Barbell',
        difficulty: 'Intermediate',
        description: 'A compound exercise that primarily targets the quadriceps, hamstrings, and glutes.',
        isDefault: true
    },
    {
        name: 'Pull-ups',
        category: 'Back',
        equipment: 'Body Weight',
        difficulty: 'Advanced',
        description: 'An upper body exercise that targets the lats, biceps, and upper back.',
        isDefault: true
    },
    {
        name: 'Shoulder Press',
        category: 'Shoulders',
        equipment: 'Dumbbells',
        difficulty: 'Intermediate',
        description: 'An upper body exercise that targets the deltoids and triceps.',
        isDefault: true
    },
    {
        name: 'Deadlift',
        category: 'Back',
        equipment: 'Barbell',
        difficulty: 'Advanced',
        description: 'A compound exercise that targets the lower back, hamstrings, and glutes.',
        isDefault: true
    }
];

// Seed default exercises if none exist
const seedDefaultExercises = async () => {
    try {
        const count = await Exercise.countDocuments({ isDefault: true });
        if (count === 0) {
            await Exercise.insertMany(defaultExercises);
            console.log('Default exercises seeded successfully');
        }
    } catch (error) {
        console.error('Error seeding default exercises:', error);
    }
};

// Get all exercises - now filtered by user
exports.getExercises = async (req, res, next) => {
    try {
        await seedDefaultExercises();
        
        // Get default exercises OR exercises created by this user
        const exercises = await Exercise.find({
            $or: [
                { isDefault: true },
                { userId: req.user.id }
            ]
        });
        
        res.status(200).json(exercises);
    } catch (error) {
        next(error);
    }
};

// Get single exercise - verify ownership or default
exports.getExercise = async (req, res, next) => {
    try {
        const exerciseId = new mongoose.Types.ObjectId(req.params.id);
        const exercise = await Exercise.findById(exerciseId);
        
        if (!exercise) {
            return res.status(404).json({ message: 'Exercise not found' });
        }
        
        // Check if exercise is default or belongs to user
        if (!exercise.isDefault && (!exercise.userId || exercise.userId.toString() !== req.user.id)) {
            return res.status(403).json({ message: 'Not authorized to access this exercise' });
        }
        
        res.status(200).json(exercise);
    } catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid exercise ID format' });
        }
        next(error);
    }
};

// Create new exercise - now associates with user
exports.createExercise = async (req, res, next) => {
    try {
        // Add current user id to exercise data
        const exerciseData = {
            ...req.body,
            userId: req.user.id
        };
        
        const exercise = await Exercise.create(exerciseData);
        res.status(201).json(exercise);
    } catch (error) {
        // Handle unique constraint violation
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: 'You already have an exercise with this name. Please use a different name.' 
            });
        }
        next(error);
    }
};

// Update exercise - verify ownership
exports.updateExercise = async (req, res, next) => {
    try {
        const exerciseId = new mongoose.Types.ObjectId(req.params.id);
        const exercise = await Exercise.findById(exerciseId);
        
        if (!exercise) {
            return res.status(404).json({ message: 'Exercise not found' });
        }
        
        // Prevent updating default exercises' key properties
        if (exercise.isDefault) {
            // Allow only description updates for default exercises
            const allowedUpdates = ['description'];
            const requestedUpdates = Object.keys(req.body);
            
            const isValidUpdate = requestedUpdates.every(update => allowedUpdates.includes(update));
            
            if (!isValidUpdate) {
                return res.status(400).json({ 
                    message: 'Cannot modify core properties of default exercises. Only description can be updated.' 
                });
            }
        } else {
            // For custom exercises, verify user owns this exercise
            if (!exercise.userId || exercise.userId.toString() !== req.user.id) {
                return res.status(403).json({ message: 'Not authorized to update this exercise' });
            }
        }
        
        const updatedExercise = await Exercise.findByIdAndUpdate(
            exerciseId,
            req.body,
            { new: true, runValidators: true }
        );
        
        res.status(200).json(updatedExercise);
    } catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid exercise ID format' });
        }
        next(error);
    }
};

// Delete exercise - verify ownership
exports.deleteExercise = async (req, res, next) => {
    try {
        const exerciseId = new mongoose.Types.ObjectId(req.params.id);
        const exercise = await Exercise.findById(exerciseId);

        if (!exercise) {
            return res.status(404).json({ message: 'Exercise not found' });
        }

        if (exercise.isDefault) {
            return res.status(400).json({ message: 'Cannot delete default exercises' });
        }

        // Verify user owns this exercise
        if (!exercise.userId || exercise.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this exercise' });
        }

        await Exercise.findByIdAndDelete(exerciseId);
        res.status(200).json({ message: 'Exercise deleted successfully' });
    } catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid exercise ID format' });
        }
        next(error);
    }
};