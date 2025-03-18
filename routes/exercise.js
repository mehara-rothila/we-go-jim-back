// backend/routes/exercise.js
const express = require('express');
const router = express.Router();
const { 
    getExercises, 
    getExercise, 
    createExercise, 
    updateExercise, 
    deleteExercise 
} = require('../controllers/exercise');
const { protect } = require('../middleware/auth');

// All routes are protected with authentication
router.route('/')
    .get(protect, getExercises)
    .post(protect, createExercise);

router.route('/:id')
    .get(protect, getExercise)
    .put(protect, updateExercise)
    .delete(protect, deleteExercise);

module.exports = router;