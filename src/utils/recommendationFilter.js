/**
 * Filters meal recommendations based on user's food avoidances
 * @param {Object} meal - The meal object to check
 * @param {Array} avoidances - Array of food avoidance tags (e.g., ["Dairy", "Gluten", "sgg"])
 * @param {string} otherAvoidances - Additional text avoidances
 * @returns {boolean} - true if meal should be shown, false if should be hidden
 */
export function shouldShowMeal(meal, avoidances = [], otherAvoidances = "") {
  if (!meal || (!avoidances.length && !otherAvoidances)) return true;

  const mealName = (meal.name || "").toLowerCase();
  const mealPrep = (meal.prep || "").toLowerCase();
  const allAvoidances = [...avoidances, otherAvoidances].filter(Boolean).map(a => a.toLowerCase());

  // Check if any avoidance matches meal name or prep
  for (const avoidance of allAvoidances) {
    if (mealName.includes(avoidance) || mealPrep.includes(avoidance)) {
      return false;
    }
  }

  return true;
}

/**
 * Filters exercise recommendations based on user's workout limitations
 * @param {Object} exercise - The exercise object to check
 * @param {Array} limitations - Array of workout limitation tags (e.g., ["Knee Pain", "Back Issue"])
 * @param {string} otherLimitations - Additional text limitations
 * @returns {boolean} - true if exercise should be shown, false if should be hidden
 */
export function shouldShowExercise(exercise, limitations = [], otherLimitations = "") {
  if (!exercise || (!limitations.length && !otherLimitations)) return true;

  const exerciseName = (exercise.name || "").toLowerCase();
  const allLimitations = [...limitations, otherLimitations].filter(Boolean).map(l => l.toLowerCase());

  // Mapping of limitations to exercise keywords to exclude
  const limitationMap = {
    "back issue": ["row", "deadlift", "bent over", "superman"],
    "cervical issue": ["overhead", "press", "neck"],
    "knee pain": ["squat", "lunge", "jump", "leg", "knee"],
    "shoulder pain": ["overhead", "press", "dip", "shoulder"],
    "wrist pain": ["push-up", "dip", "plank", "wrist"],
    "high impact": ["jump", "burpee", "box jump", "skip"],
    "heavy lifting": ["deadlift", "squat", "bench", "heavy"],
    "overhead press": ["overhead", "press", "military"],
    "deep squats": ["squat", "lunge"],
    "jumping": ["jump", "burpee", "box jump", "skip"]
  };

  // Check each limitation
  for (const limitation of allLimitations) {
    const keywords = limitationMap[limitation] || [limitation];
    
    for (const keyword of keywords) {
      if (exerciseName.includes(keyword)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Filters a diet plan based on food avoidances
 * @param {Object} dietPlan - The full diet plan object
 * @param {Array} avoidances - Array of food avoidance tags
 * @param {string} otherAvoidances - Additional text avoidances
 * @returns {Object} - Filtered diet plan with warnings for removed items
 */
export function filterDietPlan(dietPlan, avoidances = [], otherAvoidances = "") {
  const filtered = {};
  const warnings = [];

  for (const [day, meals] of Object.entries(dietPlan)) {
    filtered[day] = {};
    
    for (const [mealKey, meal] of Object.entries(meals)) {
      if (shouldShowMeal(meal, avoidances, otherAvoidances)) {
        filtered[day][mealKey] = meal;
      } else {
        warnings.push({
          day,
          mealKey,
          mealName: meal.name,
          reason: avoidances.includes(meal.name) || otherAvoidances.includes(meal.name) 
            ? "avoidance" 
            : "custom"
        });
      }
    }
  }

  return { filteredPlan: filtered, warnings };
}

/**
 * Filters workout plan based on limitations
 * @param {Object} workoutPlan - The full workout plan object
 * @param {Array} limitations - Array of workout limitation tags
 * @param {string} otherLimitations - Additional text limitations
 * @returns {Object} - Filtered workout plan with warnings for removed items
 */
export function filterWorkoutPlan(workoutPlan, limitations = [], otherLimitations = "") {
  const filtered = {};
  const warnings = [];

  for (const [day, workout] of Object.entries(workoutPlan)) {
    filtered[day] = { ...workout };
    
    if (workout.exercises && Array.isArray(workout.exercises)) {
      filtered[day].exercises = workout.exercises.filter(exercise => {
        if (shouldShowExercise(exercise, limitations, otherLimitations)) {
          return true;
        } else {
          warnings.push({
            day,
            exerciseName: exercise.name,
            reason: "limitation"
          });
          return false;
        }
      });
    }

    if (workout.sections && Array.isArray(workout.sections)) {
      filtered[day].sections = workout.sections.map(section => ({
        ...section,
        exercises: (section.exercises || []).filter(exercise => {
          if (shouldShowExercise(exercise, limitations, otherLimitations)) {
            return true;
          } else {
            warnings.push({
              day,
              exerciseName: exercise.name,
              reason: "limitation"
            });
            return false;
          }
        })
      }));
    }
  }

  return { filteredPlan: filtered, warnings };
}
