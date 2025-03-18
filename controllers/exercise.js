// backend/controllers/exercise.js
const Exercise = require('../models/Exercise');

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
        const count = await Exercise.countDocuments();
        if (count === 0) {
            await Exercise.insertMany(defaultExercises);
            console.log('Default exercises seeded successfully');
        }
    } catch (error) {
        console.error('Error seeding default exercises:', error);
    }
};

// Get all exercises
exports.getExercises = async (req, res) => {
    try {
        // First check if we need to seed default exercises
        await seedDefaultExercises();

        // Then get all exercises
        const exercises = await Exercise.find();
        res.status(200).json(exercises);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching exercises', error: error.message });
    }
};

// Get single exercise
exports.getExercise = async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id);
        if (!exercise) {
            return res.status(404).json({ message: 'Exercise not found' });
        }
        res.status(200).json(exercise);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching exercise', error: error.message });
    }
};

// Create new exercise
exports.createExercise = async (req, res) => {
    try {
        const exercise = await Exercise.create(req.body);
        res.status(201).json(exercise);
    } catch (error) {
        res.status(500).json({ message: 'Error creating exercise', error: error.message });
    }
};

// Update exercise
exports.updateExercise = async (req, res) => {
    try {
        const exercise = await Exercise.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!exercise) {
            return res.status(404).json({ message: 'Exercise not found' });
        }
        res.status(200).json(exercise);
    } catch (error) {
        res.status(500).json({ message: 'Error updating exercise', error: error.message });
    }
};

// Delete exercise
exports.deleteExercise = async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id);
        if (!exercise) {
            return res.status(404).json({ message: 'Exercise not found' });
        }
        
        // Prevent deletion of default exercises
        if (exercise.isDefault) {
            return res.status(400).json({ message: 'Cannot delete default exercises' });
        }
        
        await exercise.remove();
        res.status(200).json({ message: 'Exercise deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting exercise', error: error.message });
    }
};