// models/Exercise.js
const exerciseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        // Remove unique constraint since different users can create exercises with same name
    },
    category: {
        type: String,
        required: true,
        enum: ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core']
    },
    equipment: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        required: true,
        enum: ['Beginner', 'Intermediate', 'Advanced']
    },
    description: {
        type: String,
        default: ''
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // Only required for custom exercises
    }
}, {
    timestamps: true
});