const activityMultipliers = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725
};

function roundToNearest(value, step = 10) {
  return Math.round(value / step) * step;
}

export function calculateBodyMetrics(profile = {}, targets = {}) {
  const age = Number(profile.age) || 0;
  const heightCm = Number(profile.heightCm) || 0;
  const weightKg = Number(profile.weightKg) || 0;
  const gender = profile.gender || "male";
  const activityLevel = profile.activityLevel || "light";
  const deficitTarget = Number(profile.deficitTarget) || 400;

  const hasRequiredData = age > 0 && heightCm > 0 && weightKg > 0;
  const genderOffset = gender === "female" ? -161 : 5;
  const bmr = hasRequiredData
    ? roundToNearest((10 * weightKg) + (6.25 * heightCm) - (5 * age) + genderOffset)
    : 0;
  const tdee = bmr
    ? roundToNearest(bmr * (activityMultipliers[activityLevel] || activityMultipliers.light))
    : 0;

  const autoCalories = tdee ? Math.max(1200, roundToNearest(tdee - deficitTarget)) : Number(targets.calories) || 0;
  const manualCalories = Number(targets.calories) || autoCalories;
  const calorieTarget = targets.deficitMode === "manual" ? manualCalories : autoCalories;
  const proteinTarget = weightKg ? roundToNearest(weightKg * 1.6, 5) : Number(targets.protein) || 0;

  return {
    bmr,
    tdee,
    calorieTarget,
    autoCalories,
    proteinTarget,
    deficitTarget: tdee ? tdee - calorieTarget : 0
  };
}
