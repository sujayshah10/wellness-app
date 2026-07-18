const activityMultipliers = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
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
  const deficitTarget = Number(profile.deficitTarget) || 400;

  const hasRequiredData = age > 0 && heightCm > 0 && weightKg > 0;
  const genderOffset = genderBmrOffset(gender);
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
    age,
    calorieTarget,
    autoCalories,
    proteinTarget,
    deficitTarget: tdee ? tdee - calorieTarget : 0
  };
}
