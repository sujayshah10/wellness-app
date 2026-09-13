// Daily completion tracking system design

/*
COMPLETION TRACKING DATA STRUCTURE:
{
  completionTracker: {
    "2026-09-12": {
      mealsCompleted: ["intake1", "intake2"], // Array of completed meal slots
      workoutCompleted: false,
      workoutSteps: {
        warmup: false,
        mainWorkout: false,
        afterWorkoutStretches: false
      },
      waterIntake: 0, // glasses of water
      customHabits: {}, // For future habit tracking
      overallCompletion: 0.66, // Percentage 0-1
      timestamp: "2026-09-12T18:30:00Z"
    }
  },
  streakData: {
    currentStreak: 5, // Consecutive days
    longestStreak: 15,
    lastCompletedDate: "2026-09-11",
    streakHistory: [1, 2, 3, 4, 5] // History of streak lengths
  },
  weeklySummary: {
    "2026-W37": { // Week number
      totalDays: 7,
      completedDays: 5,
      averageCompletion: 0.85,
      caloriesAdherence: 0.90,
      proteinAdherence: 0.80,
      workoutCompletion: 0.71
    }
  }
}

COMPLETION CRITERIA:
- Daily Meals: 3 meal slots (all 3 = 100% meal completion)
- Workout: Main workout completion (can be partial with steps)
- Water: 8 glasses target (future enhancement)
- Custom habits: Future expansion

STREAK LOGIC:
- Streak increments when overallCompletion >= 0.8 (80% threshold)
- Streak resets when user misses a day completely (overallCompletion < 0.3)
- Grace period: Allow 1 day below threshold without breaking streak
- Weekly streak preservation: Can miss 1 day per week without losing streak

WEEKLY SUMMARY METRICS:
- Completion rate: Days with 80%+ completion / total days
- Calorie adherence: Days meeting calorie target / total days
- Protein adherence: Days meeting protein target / total days  
- Workout completion: Days with workout / total days
