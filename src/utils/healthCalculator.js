const activityMultipliers = {
  sedentary: 1.2,
  light: 1.375,
  lightly_active: 1.375,
  moderate: 1.55,
  moderately_active: 1.55,
  active: 1.725,
  very_active: 1.725,
  veryActive: 1.9
};

export function poundsToKg(value) {
  return (Number(value) || 0) / 2.20462;
}

export function kgToPounds(value) {
  return (Number(value) || 0) * 2.20462;
}

export function feetInchesToCm(feet, inches) {
  return ((Number(feet) || 0) * 30.48) + ((Number(inches) || 0) * 2.54);
}

export function cmToFeetInches(value) {
  const totalInches = Math.round((Number(value) || 0) / 2.54);
  return {
    feet: Math.floor(totalInches / 12),
    inches: totalInches % 12
  };
}

function roundToNearest(value, step = 10) {
  return Math.round(value / step) * step;
}

export function ageFromBirthDate(birthDate) {
  if (!birthDate) return 0;
  const date = new Date(birthDate);
  if (Number.isNaN(date.getTime())) return 0;

  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const hasBirthdayPassed =
    today.getMonth() > date.getMonth()
    || (today.getMonth() === date.getMonth() && today.getDate() >= date.getDate());

  return hasBirthdayPassed ? age : age - 1;
}

function genderBmrOffset(gender) {
  if (gender === "female") return -161;
  if (gender === "male") return 5;
  return -78;
}

export function calculateBodyMetrics(profile = {}, targets = {}) {
  const age = ageFromBirthDate(profile.birthDate) || Number(profile.age) || 0;
  const heightCm = Number(profile.heightCm) || 0;
  const weightKg = Number(profile.weightKg) || 0;
  const gender = profile.gender || "male";
  const activityLevel = profile.activityLevel || "light";

  // Handle new goals array format (for backward compatibility)
  const goals = Array.isArray(profile.goals) ? profile.goals : [];
  const deficitTarget = Number(profile.deficitTarget) || 400;

  const hasRequiredData = age > 0 && heightCm > 0 && weightKg > 0;
  const genderOffset = genderBmrOffset(gender);
  const bmr = hasRequiredData
    ? roundToNearest((10 * weightKg) + (6.25 * heightCm) - (5 * age) + genderOffset)
    : 0;
  const tdee = bmr
    ? roundToNearest(bmr * (activityMultipliers[activityLevel] || activityMultipliers.light))
    : 0;

  // Calculate calorie adjustment based on goals
  let calorieAdjustment = 0;
  let proteinMultiplier = 1.6;

  if (goals.includes("lose_fat") && goals.includes("build_muscle")) {
    // Body recomposition: maintain calories, higher protein
    calorieAdjustment = 0;
    proteinMultiplier = 2.2;
  } else if (goals.includes("lose_fat")) {
    calorieAdjustment = -500;
    proteinMultiplier = 2.0;
  } else if (goals.includes("build_muscle")) {
    calorieAdjustment = 300;
    proteinMultiplier = 2.0;
  } else if (goals.includes("maintain")) {
    calorieAdjustment = 0;
    proteinMultiplier = 1.6;
  } else {
    // Fallback to old deficitTarget for backward compatibility
    calorieAdjustment = -deficitTarget;
    proteinMultiplier = 1.6;
  }

  const autoCalories = tdee ? Math.max(1200, roundToNearest(tdee + calorieAdjustment)) : Number(targets.calories) || 0;
  const manualCalories = Number(targets.calories) || autoCalories;
  const calorieTarget = targets.deficitMode === "manual" ? manualCalories : autoCalories;
  const proteinTarget = weightKg ? roundToNearest(weightKg * proteinMultiplier, 5) : Number(targets.protein) || 0;

  return {
    bmr,
    tdee,
    age,
    calorieTarget,
    autoCalories,
    proteinTarget,
    deficitTarget: tdee ? tdee - calorieTarget : 0
  };
}
