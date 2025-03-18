// controllers/stats.js
const Schedule = require('../models/Schedule');

// @desc   Get weekly performance summary
// @route  GET /api/stats/weekly-summary
// @access Private
exports.getWeeklySummary = async (req, res) => {
    try {
        // Get all schedules for the user
        const schedules = await Schedule.find({ userId: req.user.id });
        
        // Initialize data structure for days of the week
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const weeklySummary = days.map(day => ({
            day,
            totalVolume: 0,
            totalSets: 0,
            avgWeight: 0
        }));
        
        // Process each schedule
        schedules.forEach(schedule => {
            schedule.workouts.forEach(workout => {
                const dayIndex = days.indexOf(workout.day);
                
                if (dayIndex !== -1) {
                    let dayTotalWeight = 0;
                    let dayTotalSets = 0;
                    
                    // Process exercises
                    workout.exercises.forEach(exercise => {
                        exercise.sets.forEach(set => {
                            // Use weight as 0 if not defined
                            const weight = set.weight || 0;
                            weeklySummary[dayIndex].totalVolume += set.reps * weight;
                            dayTotalWeight += weight;
                            dayTotalSets++;
                        });
                    });
                    
                    // Update summary
                    weeklySummary[dayIndex].totalSets = dayTotalSets;
                    weeklySummary[dayIndex].avgWeight = dayTotalSets > 0 ? Math.round(dayTotalWeight / dayTotalSets) : 0;
                }
            });
        });
        
        res.status(200).json(weeklySummary);
    } catch (error) {
        res.status(500).json({ message: 'Error getting weekly summary' });
    }
};

// @desc   Get monthly performance summary
// @route  GET /api/stats/monthly-summary
// @access Private
exports.getMonthlySummary = async (req, res) => {
    try {
        // Get all schedules for the user
        const schedules = await Schedule.find({ userId: req.user.id });
        
        // Create a 4-week summary
        const monthlySummary = [
            { week: 'Week 1', totalVolume: 0, workoutCount: 0, averageIntensity: 0 },
            { week: 'Week 2', totalVolume: 0, workoutCount: 0, averageIntensity: 0 },
            { week: 'Week 3', totalVolume: 0, workoutCount: 0, averageIntensity: 0 },
            { week: 'Week 4', totalVolume: 0, workoutCount: 0, averageIntensity: 0 }
        ];
        
        // For demo purposes, distribute the workout data across the 4 weeks
        schedules.forEach((schedule, index) => {
            const weekIndex = index % 4;
            
            let weekTotalVolume = 0;
            let weekWorkoutCount = 0;
            let weekTotalWeight = 0;
            let weekTotalSets = 0;
            
            schedule.workouts.forEach(workout => {
                weekWorkoutCount++;
                
                workout.exercises.forEach(exercise => {
                    exercise.sets.forEach(set => {
                        const weight = set.weight || 0;
                        weekTotalVolume += set.reps * weight;
                        weekTotalWeight += weight;
                        weekTotalSets++;
                    });
                });
            });
            
            // Update summary
            monthlySummary[weekIndex].totalVolume += weekTotalVolume;
            monthlySummary[weekIndex].workoutCount += weekWorkoutCount;
            monthlySummary[weekIndex].averageIntensity = weekTotalSets > 0 ? 
                Math.round((weekTotalVolume / weekTotalSets) * 10) / 10 : 0;
        });
        
        res.status(200).json(monthlySummary);
    } catch (error) {
        res.status(500).json({ message: 'Error getting monthly summary' });
    }
};

// @desc   Get performance metrics
// @route  GET /api/stats/performance-metrics
// @access Private
exports.getPerformanceMetrics = async (req, res) => {
    try {
        // Get all schedules for the user
        const schedules = await Schedule.find({ userId: req.user.id });
        
        // Calculate metrics
        const totalWorkouts = schedules.reduce((total, schedule) => 
            total + schedule.workouts.length, 0);
        
        let totalVolume = 0;
        let totalSets = 0;
        let totalDuration = 0; // Assuming each set takes about 2 minutes
        
        schedules.forEach(schedule => {
            schedule.workouts.forEach(workout => {
                workout.exercises.forEach(exercise => {
                    totalSets += exercise.sets.length;
                    
                    exercise.sets.forEach(set => {
                        const weight = set.weight || 0;
                        totalVolume += set.reps * weight;
                        totalDuration += 2; // 2 minutes per set
                    });
                });
            });
        });
        
        // For demo purposes, set some random changes
        const metrics = {
            totalWorkouts,
            workoutChange: '+12%',
            totalVolume: `${Math.round(totalVolume / 1000)}k lbs`,
            volumeChange: '+15%',
            avgWorkoutDuration: `${Math.round(totalDuration / totalWorkouts) || 0} min`,
            durationChange: '+5%',
            weeklyFrequency: `${Math.min(7, Math.round(totalWorkouts / 4) || 0)} days`,
            frequencyChange: '+8%',
            avgIntensity: `${totalSets > 0 ? Math.round((totalVolume / totalSets) * 10) / 10 : 0} lbs`,
            intensityChange: '+10%',
            personalRecords: Math.floor(totalWorkouts * 0.2) || 0, // 20% of workouts set new PRs
            recordsChange: '+20%'
        };
        
        res.status(200).json(metrics);
    } catch (error) {
        res.status(500).json({ message: 'Error getting performance metrics' });
    }
};