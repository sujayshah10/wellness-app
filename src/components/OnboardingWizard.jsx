import { useState } from "react";
import { useAppData } from "../context/useAppData";
import { useTranslation } from "../utils/useTranslation";
import * as store from "../data/store";

// Activity level options with descriptions
const ACTIVITY_LEVELS = [
  { key: "sedentary", label: "Sedentary", description: "Little to no exercise", multiplier: 1.2 },
  { key: "lightly_active", label: "Lightly Active", description: "Light exercise 1-3 days/week", multiplier: 1.375 },
  { key: "moderately_active", label: "Moderately Active", description: "Moderate exercise 3-5 days/week", multiplier: 1.55 },
  { key: "very_active", label: "Very Active", description: "Hard exercise 6-7 days/week", multiplier: 1.725 }
];

// Goal options
const GOALS = [
  { key: "lose_fat", label: "Lose Fat", calorieAdjustment: -500, proteinPerKg: 2.0 },
  { key: "maintain", label: "Maintain", calorieAdjustment: 0, proteinPerKg: 1.6 },
  { key: "build_muscle", label: "Build Muscle", calorieAdjustment: 300, proteinPerKg: 2.0 }
];

// Dietary types
const DIET_TYPES = [
  { key: "non_vegetarian", label: "Non-Vegetarian" },
  { key: "vegetarian", label: "Vegetarian" },
  { key: "eggetarian", label: "Eggetarian" },
  { key: "vegan", label: "Vegan" }
];

// Equipment options
const EQUIPMENT_OPTIONS = [
  { key: "none", label: "None / Bodyweight Only" },
  { key: "home_basics", label: "Home Basics (dumbbands, resistance bands)" },
  { key: "full_gym", label: "Full Gym Access" }
];

// Cooking time options
const COOKING_TIME_OPTIONS = [
  { key: "minimal", label: "Minimal - Quick meals only" },
  { key: "moderate", label: "Moderate - Can cook some meals" },
  { key: "enjoy", label: "Enjoy Cooking - Like cooking regularly" }
];

// Exercise experience options
const EXERCISE_EXPERIENCE = [
  { key: "beginner", label: "Beginner - New to exercise" },
  { key: "intermediate", label: "Intermediate - Some experience" },
  { key: "advanced", label: "Advanced - Experienced lifter" }
];

// Required steps (no skip)
const REQUIRED_STEPS = [
  { key: "profile", title: "Your Profile", required: true },
  { key: "goals", title: "Your Goals", required: true },
  { key: "activity", title: "Activity Level", required: true },
  { key: "diet", title: "Dietary Type", required: true },
  { key: "workout_schedule", title: "Workout Schedule", required: true },
  { key: "equipment", title: "Equipment Access", required: true },
  { key: "preferences", title: "Preferences", required: true },
  { key: "health_safety", title: "Health & Safety", required: true },
  { key: "review", title: "Review & Complete", required: true }
];

// Optional steps (with skip)
const OPTIONAL_STEPS = [
  { key: "goal_weight", title: "Goal Weight", required: false },
  { key: "meal_frequency", title: "Meal Frequency", required: false },
  { key: "location", title: "Location", required: false },
  { key: "allergies", title: "Allergies & Intolerances", required: false },
  { key: "dislikes", title: "Foods You Dislike", required: false },
  { key: "sleep_schedule", title: "Sleep Schedule", required: false },
  { title: "Cooking Time", required: false },
  { key: "exercise_experience", title: "Exercise Experience", required: false },
  { key: "limitations", title: "Injuries & Limitations", required: false },
  { key: "habits", title: "Habits", required: false }
];

const ALL_STEPS = [...REQUIRED_STEPS, ...OPTIONAL_STEPS];

export default function OnboardingWizard() {
  const { appData, setAppData } = useAppData();
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({
    // Required fields
    age: "",
    gender: "male",
    heightCm: 175,
    heightUnit: "cm",
    weightKg: 80,
    weightUnit: "kg",
    goal: "lose_fat",
    activityLevel: "sedentary",
    dietType: "non_vegetarian",
    workoutDaysPerWeek: 3,
    equipment: "home_basics",
    
    // Optional fields (with defaults)
    goalWeightKg: null,
    mealsPerDay: 3,
    country: "",
    allergies: "",
    dislikes: "",
    wakeTime: "07:00",
    sleepTime: "23:00",
    cookingTime: "moderate",
    exerciseExperience: "beginner",
    limitations: "",
    habits: { smoking: null, drinking: null }
  });

  const [skippedSteps, setSkippedSteps] = useState(new Set());

  const handleNext = (data) => {
    if (data?.skipOnboarding) {
      // Skip onboarding entirely
      setAppData(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          onboardingCompleted: true,
          onboardingCompletedAt: new Date().toISOString(),
          onboardingSkipped: true
        }
      }));
      return;
    }
    
    setOnboardingData(prev => ({ ...prev, ...data }));
    if (currentStep < ALL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    setSkippedSteps(prev => new Set([...prev, ALL_STEPS[currentStep].key]));
    if (currentStep < ALL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Remove current step from skipped if going back
      setSkippedSteps(prev => {
        const newSkipped = new Set(prev);
        newSkipped.delete(ALL_STEPS[currentStep].key);
        return newSkipped;
      });
    }
  };

  const handleComplete = () => {
    // Calculate targets using Mifflin-St Jeor formula
    const weightKg = onboardingData.weightUnit === "lbs" 
      ? onboardingData.weightKg * 0.453592 
      : onboardingData.weightKg;
    const heightCm = onboardingData.heightUnit === "ft" 
      ? onboardingData.heightCm * 30.48 
      : onboardingData.heightCm;
    
    // BMR calculation (Mifflin-St Jeor)
    let bmr;
    if (onboardingData.gender === "male") {
      bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * onboardingData.age) + 5;
    } else {
      bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * onboardingData.age) - 161;
    }
    
    // TDEE calculation
    const activityMultiplier = ACTIVITY_LEVELS.find(a => a.key === onboardingData.activityLevel)?.multiplier || 1.2;
    const tdee = bmr * activityMultiplier;
    
    // Target calories based on goal
    const goalConfig = GOALS.find(g => g.key === onboardingData.goal) || GOALS[0];
    const targetCalories = Math.round(tdee + goalConfig.calorieAdjustment);
    
    // Target protein based on goal
    const targetProtein = Math.round(weightKg * goalConfig.proteinPerKg);
    
    // Workout split suggestion
    let workoutFocus = "Full Body";
    if (onboardingData.workoutDaysPerWeek >= 5) {
      workoutFocus = "Push/Pull/Legs Split";
    } else if (onboardingData.workoutDaysPerWeek >= 3) {
      workoutFocus = "Upper/Lower Split";
    } else {
      workoutFocus = "Full Body";
    }

    // Update profile using store functions
    const profileData = {
      name: "User", // Could add name field later
      birthDate: "",
      gender: onboardingData.gender,
      heightCm: heightCm,
      heightUnit: "cm",
      weightKg: weightKg,
      weightUnit: "kg",
      activityLevel: onboardingData.activityLevel,
      goal: onboardingData.goal,
      dietType: onboardingData.dietType,
      workoutDaysPerWeek: onboardingData.workoutDaysPerWeek,
      equipment: onboardingData.equipment,
      goalWeightKg: onboardingData.goalWeightKg,
      mealsPerDay: onboardingData.mealsPerDay,
      country: onboardingData.country,
      allergies: onboardingData.allergies,
      dislikes: onboardingData.dislikes,
      wakeTime: onboardingData.wakeTime,
      sleepTime: onboardingData.sleepTime,
      cookingTime: onboardingData.cookingTime,
      exerciseExperience: onboardingData.exerciseExperience,
      limitations: onboardingData.limitations,
      habits: onboardingData.habits
    };

    // Update targets using store functions
    const targetsData = {
      calories: targetCalories,
      protein: targetProtein,
      deficitMode: "auto",
      deficitOverride: goalConfig.calorieAdjustment
    };

    // Save everything via store functions
    store.updateProfile(profileData);
    store.updateTargets(targetsData);
    store.updateSettings({
      onboardingCompleted: true,
      onboardingCompletedAt: new Date().toISOString(),
      onboardingSkipped: false
    });

    // Update local state to trigger re-render
    setAppData(prev => ({
      ...prev,
      profile: { ...prev.profile, ...profileData },
      targets: { ...prev.targets, ...targetsData },
      settings: {
        ...prev.settings,
        onboardingCompleted: true,
        onboardingCompletedAt: new Date().toISOString(),
        onboardingSkipped: false
      }
    }));
  };

  const progress = ((currentStep + 1) / ALL_STEPS.length) * 100;
  const isDarkMode = document.documentElement.dataset.theme === "dark" || document.documentElement.dataset.theme === "black";
  const primaryColor = isDarkMode ? "#1D9E75" : "#2563EB";

  return (
    <div className="onboarding-wizard" style={{
      minHeight: "100vh",
      background: "var(--app-bg)",
      color: "var(--app-text)",
      padding: "20px",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Progress Bar */}
      <div style={{
        marginBottom: "20px"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
          fontSize: "14px",
          color: "var(--app-muted)",
          fontWeight: 500
        }}>
          <span>Step {currentStep + 1} of {ALL_STEPS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div style={{
          height: "6px",
          background: "var(--app-surface-soft)",
          borderRadius: "3px",
          overflow: "hidden"
        }}>
          <div style={{
            height: "100%",
            width: `${progress}%`,
            background: primaryColor,
            borderRadius: "3px",
            transition: "width 0.3s ease"
          }} />
        </div>
      </div>

      {/* Step Indicator */}
      <div style={{
        display: "flex",
        gap: "4px",
        marginBottom: "24px",
        flexWrap: "wrap"
      }}>
        {ALL_STEPS.map((step, index) => (
          <div
            key={step.key}
            style={{
              flex: 1,
              minWidth: "20px",
              height: "4px",
              background: index <= currentStep 
                ? primaryColor 
                : "var(--app-surface-soft)",
              borderRadius: "2px",
              transition: "background 0.3s ease"
            }}
          />
        ))}
      </div>

      {/* Current Step Content */}
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{
            margin: 0,
            fontSize: "24px",
            fontWeight: 600,
            color: "var(--app-text)"
          }}>
            {ALL_STEPS[currentStep].title}
          </h2>
          {!ALL_STEPS[currentStep].required && (
            <span style={{
              fontSize: "12px",
              color: "var(--app-muted)",
              fontStyle: "italic"
            }}>
              (Optional)
            </span>
          )}
        </div>

        {renderStep(currentStep, onboardingData, handleNext, handleBack, handleSkip, handleComplete, isDarkMode, primaryColor)}
      </div>
    </div>
  );
}

function renderStep(stepIndex, data, onNext, onBack, onSkip, onComplete, isDarkMode, primaryColor) {
  const step = ALL_STEPS[stepIndex];
  const isLastStep = stepIndex === ALL_STEPS.length - 1;

  switch (step.key) {
    case "profile":
      return <ProfileStep data={data} onNext={onNext} isDarkMode={isDarkMode} primaryColor={primaryColor} />;
    case "goals":
      return <GoalsStep data={data} onNext={onNext} isDarkMode={isDarkMode} primaryColor={primaryColor} />;
    case "activity":
      return <ActivityStep data={data} onNext={onNext} isDarkMode={isDarkMode} primaryColor={primaryColor} />;
    case "diet":
      return <DietStep data={data} onNext={onNext} isDarkMode={isDarkMode} primaryColor={primaryColor} />;
    case "workout_schedule":
      return <WorkoutScheduleStep data={data} onNext={onNext} isDarkMode={isDarkMode} primaryColor={primaryColor} />;
    case "equipment":
      return <EquipmentStep data={data} onNext={onNext} isDarkMode={isDarkMode} primaryColor={primaryColor} />;
    case "preferences":
      return <PreferencesStep data={data} onNext={onNext} isDarkMode={isDarkMode} primaryColor={primaryColor} />;
    case "health_safety":
      return <HealthSafetyStep data={data} onNext={onNext} isDarkMode={isDarkMode} primaryColor={primaryColor} />;
    case "goal_weight":
      return <GoalWeightStep data={data} onNext={onNext} onSkip={onSkip} isDarkMode={isDarkMode} primaryColor={primaryColor} />;
    case "meal_frequency":
      return <MealFrequencyStep data={data} onNext={onNext} onSkip={onSkip} isDarkMode={isDarkMode} primaryColor={primaryColor} />;
    case "location":
      return <LocationStep data={data} onNext={onNext} onSkip={onSkip} isDarkMode={isDarkMode} primaryColor={primaryColor} />;
    case "allergies":
      return <AllergiesStep data={data} onNext={onNext} onSkip={onSkip} isDarkMode={isDarkMode} primaryColor={primaryColor} />;
    case "dislikes":
      return <DislikesStep data={data} onNext={onNext} onSkip={onSkip} isDarkMode={isDarkMode} primaryColor={primaryColor} />;
    case "sleep_schedule":
      return <SleepScheduleStep data={data} onNext={onNext} onSkip={onSkip} isDarkMode={isDarkMode} primaryColor={primaryColor} />;
    case "cooking_time":
      return <CookingTimeStep data={data} onNext={onNext} onSkip={onSkip} isDarkMode={isDarkMode} primaryColor={primaryColor} />;
    case "exercise_experience":
      return <ExerciseExperienceStep data={data} onNext={onNext} onSkip={onSkip} isDarkMode={isDarkMode} primaryColor={primaryColor} />;
    case "limitations":
      return <LimitationsStep data={data} onNext={onNext} onSkip={onSkip} isDarkMode={isDarkMode} primaryColor={primaryColor} />;
    case "habits":
      return <HabitsStep data={data} onNext={onNext} onSkip={onSkip} isDarkMode={isDarkMode} primaryColor={primaryColor} />;
    case "review":
      return <ReviewStep data={data} onComplete={onComplete} onBack={onBack} isLastStep={isLastStep} isDarkMode={isDarkMode} primaryColor={primaryColor} />;
    default:
      return <div>Step not found</div>;
  }
}

// Step Components
function ProfileStep({ data, onNext, isDarkMode, primaryColor }) {
  const [formData, setFormData] = useState(data);
  const [useImperial, setUseImperial] = useState(data.heightUnit === "ft" || data.weightUnit === "lbs");

  const handleSubmit = () => {
    if (!formData.age || formData.age < 16 || formData.age > 100) {
      alert("Please enter a valid age (16-100)");
      return;
    }
    onNext(formData);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "var(--app-text)" }}>
          Age *
        </label>
        <input
          type="number"
          value={formData.age || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value === '' ? 0 : Number(e.target.value) }))}
          placeholder="Enter your age"
          style={{
            width: "100%",
            padding: "14px",
            border: "1px solid var(--app-border)",
            borderRadius: "8px",
            background: "var(--app-surface)",
            color: "var(--app-text)",
            fontSize: "16px"
          }}
        />
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "var(--app-text)" }}>
          Sex *
        </label>
        <div style={{ display: "flex", gap: "12px" }}>
          {["male", "female"].map((gender) => (
            <button
              key={gender}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, gender }))}
              style={{
                flex: 1,
                padding: "14px",
                border: "1px solid var(--app-border)",
                borderRadius: "8px",
                background: formData.gender === gender ? primaryColor : "var(--app-surface)",
                color: formData.gender === gender ? (isDarkMode ? "white" : "white") : "var(--app-text)",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              {gender === "male" ? "Male" : "Female"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "var(--app-text)" }}>
          Height *
        </label>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            type="number"
            value={formData.heightCm || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, heightCm: e.target.value === '' ? 0 : Number(e.target.value) }))}
            placeholder={useImperial ? "Height (ft)" : "Height (cm)"}
            style={{
              flex: 1,
              padding: "14px",
              border: "1px solid var(--app-border)",
              borderRadius: "8px",
              background: "var(--app-surface)",
              color: "var(--app-text)",
              fontSize: "16px"
            }}
          />
          <button
            type="button"
            onClick={() => setUseImperial(!useImperial)}
            style={{
              padding: "8px 12px",
              border: "1px solid var(--app-border)",
              borderRadius: "6px",
              background: "var(--app-surface-soft)",
              color: "var(--app-text)",
              fontSize: "13px",
              cursor: "pointer"
            }}
          >
            {useImperial ? "ft/in" : "cm"}
          </button>
        </div>
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "var(--app-text)" }}>
          Current Weight *
        </label>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            type="number"
            value={formData.weightKg || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, weightKg: e.target.value === '' ? 0 : Number(e.target.value) }))}
            placeholder={useImperial ? "Weight (lbs)" : "Weight (kg)"}
            style={{
              flex: 1,
              padding: "14px",
              border: "1px solid var(--app-border)",
              borderRadius: "8px",
              background: "var(--app-surface)",
              color: "var(--app-text)",
              fontSize: "16px"
            }}
          />
          <button
            type="button"
            onClick={() => setUseImperial(!useImperial)}
            style={{
              padding: "8px 12px",
              border: "1px solid var(--app-border)",
              borderRadius: "6px",
              background: "var(--app-surface-soft)",
              color: "var(--app-text)",
              fontSize: "13px",
              cursor: "pointer"
            }}
          >
            {useImperial ? "lbs" : "kg"}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button
          type="button"
          onClick={handleSubmit}
          style={{
            flex: 2,
            padding: "14px",
            background: primaryColor,
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

function GoalsStep({ data, onNext, isDarkMode, primaryColor }) {
  const [formData, setFormData] = useState(data);

  const handleSubmit = () => {
    onNext(formData);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <label style={{ display: "block", marginBottom: "12px", fontWeight: 600, color: "var(--app-text)" }}>
          What's your primary goal? *
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {GOALS.map((goal) => (
            <button
              key={goal.key}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, goal: goal.key }))}
              style={{
                padding: "16px",
                border: "1px solid var(--app-border)",
                borderRadius: "8px",
                background: formData.goal === goal.key ? primaryColor : "var(--app-surface)",
                color: formData.goal === goal.key ? (isDarkMode ? "white" : "white") : "var(--app-text)",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease"
              }}
            >
              {goal.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button
          type="button"
          onClick={handleSubmit}
          style={{
            flex: 2,
            padding: "14px",
            background: primaryColor,
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

function ActivityStep({ data, onNext, isDarkMode, primaryColor }) {
  const [formData, setFormData] = useState(data);

  const handleSubmit = () => {
    onNext(formData);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <label style={{ display: "block", marginBottom: "12px", fontWeight: 600, color: "var(--app-text)" }}>
          How active are you? *
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {ACTIVITY_LEVELS.map((level) => (
            <button
              key={level.key}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, activityLevel: level.key }))}
              style={{
                padding: "16px",
                border: "1px solid var(--app-border)",
                borderRadius: "8px",
                background: formData.activityLevel === level.key ? primaryColor : "var(--app-surface)",
                color: formData.activityLevel === level.key ? (isDarkMode ? "white" : "white") : "var(--app-text)",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease"
              }}
            >
              <div>{level.label}</div>
              <div style={{ fontSize: "13px", fontWeight: 400, marginTop: "4px", opacity: 0.8 }}>
                {level.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button
          type="button"
          onClick={handleSubmit}
          style={{
            flex: 2,
            padding: "14px",
            background: primaryColor,
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

function DietStep({ data, onNext, isDarkMode, primaryColor }) {
  const [formData, setFormData] = useState(data);

  const handleSubmit = () => {
    onNext(formData);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <label style={{ display: "block", marginBottom: "12px", fontWeight: 600, color: "var(--app-text)" }}>
          What's your dietary type? *
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {DIET_TYPES.map((diet) => (
            <button
              key={diet.key}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, dietType: diet.key }))}
              style={{
                padding: "16px",
                border: "1px solid var(--app-border)",
                borderRadius: "8px",
                background: formData.dietType === diet.key ? primaryColor : "var(--app-surface)",
                color: formData.dietType === diet.key ? (isDarkMode ? "white" : "white") : "var(--app-text)",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease"
              }}
            >
              {diet.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button
          type="button"
          onClick={handleSubmit}
          style={{
            flex: 2,
            padding: "14px",
            background: primaryColor,
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

function WorkoutScheduleStep({ data, onNext, isDarkMode, primaryColor }) {
  const [formData, setFormData] = useState(data);

  const handleSubmit = () => {
    onNext(formData);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "var(--app-text)" }}>
          How many days per week can you work out? *
        </label>
        <input
          type="range"
          min="1"
          max="7"
          value={formData.workoutDaysPerWeek}
          onChange={(e) => setFormData(prev => ({ ...prev, workoutDaysPerWeek: Number(e.target.value) }))}
          style={{ width: "100%" }}
        />
        <div style={{ fontSize: "14px", fontWeight: 600, color: primaryColor, marginTop: "8px" }}>
          {formData.workoutDaysPerWeek} days per week
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button
          type="button"
          onClick={handleSubmit}
          style={{
            flex: 2,
            padding: "14px",
            background: primaryColor,
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

function EquipmentStep({ data, onNext, isDarkMode, primaryColor }) {
  const [formData, setFormData] = useState(data);

  const handleSubmit = () => {
    onNext(formData);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <label style={{ display: "block", marginBottom: "12px", fontWeight: 600, color: "var(--app-text)" }}>
          What equipment do you have access to? *
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {EQUIPMENT_OPTIONS.map((equipment) => (
            <button
              key={equipment.key}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, equipment: equipment.key }))}
              style={{
                padding: "16px",
                border: "1px solid var(--app-border)",
                borderRadius: "8px",
                background: formData.equipment === equipment.key ? primaryColor : "var(--app-surface)",
                color: formData.equipment === equipment.key ? (isDarkMode ? "white" : "white") : "var(--app-text)",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease"
              }}
            >
              {equipment.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button
          type="button"
          onClick={handleSubmit}
          style={{
            flex: 2,
            padding: "14px",
            background: primaryColor,
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

function PreferencesStep({ data, onNext, isDarkMode, primaryColor }) {
  const [formData, setFormData] = useState(data);

  const handleSubmit = () => {
    onNext(formData);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "var(--app-text)" }}>
          Preferred meal timing *
        </label>
        <select
          value={formData.mealTiming || "standard"}
          onChange={(e) => setFormData(prev => ({ ...prev, mealTiming: e.target.value }))}
          style={{
            width: "100%",
            padding: "14px",
            border: "1px solid var(--app-border)",
            borderRadius: "8px",
            background: "var(--app-surface)",
            color: "var(--app-text)",
            fontSize: "16px"
          }}
        >
          <option value="standard">Standard (Breakfast, Lunch, Dinner)</option>
          <option value="early">Early Riser (Breakfast, Lunch, Early Dinner)</option>
          <option value="late">Night Owl (Brunch, Lunch, Late Dinner)</option>
          <option value="intermittent">Intermittent Fasting (2 main meals)</option>
        </select>
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button
          type="button"
          onClick={handleSubmit}
          style={{
            flex: 2,
            padding: "14px",
            background: primaryColor,
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

function HealthSafetyStep({ data, onNext, isDarkMode, primaryColor }) {
  const [formData, setFormData] = useState(data);

  const handleSubmit = () => {
    onNext(formData);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{
        padding: "16px",
        background: "var(--app-surface-soft)",
        border: "1px solid var(--app-border)",
        borderRadius: "8px",
        marginBottom: "20px"
      }}>
        <div style={{ fontSize: "14px", color: "var(--app-text)", marginBottom: "8px" }}>
          This information helps us provide safer exercise recommendations. It is never shared or used for diagnosis.
        </div>
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "var(--app-text)" }}>
          Any injuries or physical limitations? *
        </label>
        <textarea
          value={formData.limitations || ""}
          onChange={(e) => setFormData(prev => ({ ...prev, limitations: e.target.value }))}
          placeholder="e.g., 'Lower back pain, knee issues, shoulder impingement'"
          rows={3}
          style={{
            width: "100%",
            padding: "14px",
            border: "1px solid var(--app-border)",
            borderRadius: "8px",
            background: "var(--app-surface)",
            color: "var(--app-text)",
            fontSize: "16px",
            resize: "vertical"
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button
          type="button"
          onClick={handleSubmit}
          style={{
            flex: 2,
            padding: "14px",
            background: primaryColor,
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

// Optional Steps
function GoalWeightStep({ data, onNext, onSkip, isDarkMode, primaryColor }) {
  const [formData, setFormData] = useState(data);

  const handleSubmit = () => {
    onNext(formData);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "var(--app-text)" }}>
          Goal Weight (optional)
        </label>
        <input
          type="number"
          value={formData.goalWeightKg || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, goalWeightKg: e.target.value === '' ? null : Number(e.target.value) }))}
          placeholder="Enter your goal weight"
          style={{
            width: "100%",
            padding: "14px",
            border: "1px solid var(--app-border)",
            borderRadius: "8px",
            background: "var(--app-surface)",
            color: "var(--app-text)",
            fontSize: "16px"
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button
          type="button"
          onClick={handleSubmit}
          style={{
            flex: 2,
            padding: "14px",
            background: primaryColor,
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          Next
        </button>
        <button
          type="button"
          onClick={onSkip}
          style={{
            flex: 1,
            padding: "14px",
            background: "transparent",
            color: "var(--app-muted)",
            border: "none",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
            textDecoration: "underline"
          }}
        >
          Skip
        </button>
      </div>
    </div>
  );
}

function MealFrequencyStep({ data, onNext, onSkip, isDarkMode, primaryColor }) {
  const [formData, setFormData] = useState(data);

  const handleSubmit = () => {
    onNext(formData);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "var(--app-text)" }}>
          How many meals per day? (optional)
        </label>
        <div style={{ display: "flex", gap: "12px" }}>
          {[2, 3, 4, 5].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, mealsPerDay: num }))}
              style={{
                flex: 1,
                padding: "14px",
                border: "1px solid var(--app-border)",
                borderRadius: "8px",
                background: formData.mealsPerDay === num ? primaryColor : "var(--app-surface)",
                color: formData.mealsPerDay === num ? (isDarkMode ? "white" : "white") : "var(--app-text)",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button
          type="button"
          onClick={handleSubmit}
          style={{
            flex: 2,
            padding: "14px",
            background: primaryColor,
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          Next
        </button>
        <button
          type="button"
          onClick={onSkip}
          style={{
            flex: 1,
            padding: "14px",
            background: "transparent",
            color: "var(--app-muted)",
            border: "none",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
            textDecoration: "underline"
          }}
        >
          Skip
        </button>
      </div>
    </div>
  );
}

function LocationStep({ data, onNext, onSkip, isDarkMode, primaryColor }) {
  const [formData, setFormData] = useState(data);

  const handleSubmit = () => {
    onNext(formData);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "var(--app-text)" }}>
          Country/Region (optional)
        </label>
        <input
          type="text"
          value={formData.country || ""}
          onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
          placeholder="e.g., 'India', 'United States', 'United Kingdom'"
          style={{
            width: "100%",
            padding: "14px",
            border: "1px solid var(--app-border)",
            borderRadius: "8px",
            background: "var(--app-surface)",
            color: "var(--app-text)",
            fontSize: "16px"
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button
          type="button"
          onClick={handleSubmit}
          style={{
            flex: 2,
            padding: "14px",
            background: primaryColor,
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          Next
        </button>
        <button
          type="button"
          onClick={onSkip}
          style={{
            flex: 1,
            padding: "14px",
            background: "transparent",
            color: "var(--app-muted)",
            border: "none",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
            textDecoration: "underline"
          }}
        >
          Skip
        </button>
      </div>
    </div>
  );
}

function AllergiesStep({ data, onNext, onSkip, isDarkMode, primaryColor }) {
  const [formData, setFormData] = useState(data);

  const handleSubmit = () => {
    onNext(formData);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "var(--app-text)" }}>
          Any allergies or food intolerances? (optional)
        </label>
        <textarea
          value={formData.allergies || ""}
          onChange={(e) => setFormData(prev => ({ ...prev, allergies: e.target.value }))}
          placeholder="e.g., 'Peanuts, gluten, dairy, shellfish'"
          rows={3}
          style={{
            width: "100%",
            padding: "14px",
            border: "1px solid var(--app-border)",
            borderRadius: "8px",
            background: "var(--app-surface)",
            color: "var(--app-text)",
            fontSize: "16px",
            resize: "vertical"
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button
          type="button"
          onClick={handleSubmit}
          style={{
            flex: 2,
            padding: "14px",
            background: primaryColor,
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          Next
        </button>
        <button
          type="button"
          onClick={onSkip}
          style={{
            flex: 1,
            padding: "14px",
            background: "transparent",
            color: "var(--app-muted)",
            border: "none",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
            textDecoration: "underline"
          }}
        >
          Skip
        </button>
      </div>
    </div>
  );
}

function DislikesStep({ data, onNext, onSkip, isDarkMode, primaryColor }) {
  const [formData, setFormData] = useState(data);

  const handleSubmit = () => {
    onNext(formData);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "var(--app-text)" }}>
          Foods you dislike (optional)
        </label>
        <textarea
          value={formData.dislikes || ""}
          onChange={(e) => setFormData(prev => ({ ...prev, dislikes: e.target.value }))}
          placeholder="e.g., 'okra, bitter gourd, cilantro'"
          rows={3}
          style={{
            width: "100%",
            padding: "14px",
            border: "1px solid var(--app-border)",
            borderRadius: "8px",
            background: "var(--app-surface)",
            color: "var(--app-text)",
            fontSize: "16px",
            resize: "vertical"
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button
          type="button"
          onClick={handleSubmit}
          style={{
            flex: 2,
            padding: "14px",
            background: primaryColor,
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          Next
        </button>
        <button
          type="button"
          onClick={onSkip}
          style={{
            flex: 1,
            padding: "14px",
            background: "transparent",
            color: "var(--app-muted)",
            border: "none",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
            textDecoration: "underline"
          }}
        >
          Skip
        </button>
      </div>
    </div>
  );
}

function SleepScheduleStep({ data, onNext, onSkip, isDarkMode, primaryColor }) {
  const [formData, setFormData] = useState(data);

  const handleSubmit = () => {
    onNext(formData);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "var(--app-text)" }}>
          Sleep Schedule (optional)
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "4px", fontSize: "13px", color: "var(--app-muted)" }}>
              Wake Time
            </label>
            <input
              type="time"
              value={formData.wakeTime}
              onChange={(e) => setFormData(prev => ({ ...prev, wakeTime: e.target.value }))}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid var(--app-border)",
                borderRadius: "8px",
                background: "var(--app-surface)",
                color: "var(--app-text)",
                fontSize: "16px"
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "4px", fontSize: "13px", color: "var(--app-muted)" }}>
              Sleep Time
            </label>
            <input
              type="time"
              value={formData.sleepTime}
              onChange={(e) => setFormData(prev => ({ ...prev, sleepTime: e.target.value }))}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid var(--app-border)",
                borderRadius: "8px",
                background: "var(--app-surface)",
                color: "var(--app-text)",
                fontSize: "16px"
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button
          type="button"
          onClick={handleSubmit}
          style={{
            flex: 2,
            padding: "14px",
            background: primaryColor,
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          Next
        </button>
        <button
          type="button"
          onClick={onSkip}
          style={{
            flex: 1,
            padding: "14px",
            background: "transparent",
            color: "var(--app-muted)",
            border: "none",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
            textDecoration: underline
          }}
        >
          Skip
        </button>
      </div>
    </div>
  );
}

function CookingTimeStep({ data, onNext, onSkip, isDarkMode, primaryColor }) {
  const [formData, setFormData] = useState(data);

  const handleSubmit = () => {
    onNext(formData);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <label style={{ display: "block", marginBottom: "12px", fontWeight: 600, color: "var(--app-text)" }}>
          Cooking Time Available (optional)
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {COOKING_TIME_OPTIONS.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, cookingTime: option.key }))}
              style={{
                padding: "16px",
                border: "1px solid var(--app-border)",
                borderRadius: "8px",
                background: formData.cookingTime === option.key ? primaryColor : "var(--app-surface)",
                color: formData.cookingTime === option.key ? (isDarkMode ? "white" : "white") : "var(--app-text)",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease"
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button
          type="button"
          onClick={handleSubmit}
          style={{
            flex: 2,
            padding: "14px",
            background: primaryColor,
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          Next
        </button>
        <button
          type="button"
          onClick={onSkip}
          style={{
            flex: 1,
            padding: "14px",
            background: "transparent",
            color: "var(--app-muted)",
            border: "none",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
            textDecoration: underline
          }}
        >
          Skip
        </button>
      </div>
    </div>
  );
}

function ExerciseExperienceStep({ data, onNext, onSkip, isDarkMode, primaryColor }) {
  const [formData, setFormData] = useState(data);

  const handleSubmit = () => {
    onNext(formData);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <label style={{ display: "block", marginBottom: "12px", fontWeight: 600, color: "var(--app-text)" }}>
          Exercise Experience (optional)
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {EXERCISE_EXPERIENCE.map((level) => (
            <button
              key={level.key}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, exerciseExperience: level.key }))}
              style={{
                padding: "16px",
                border: "1px solid var(--app-border)",
                borderRadius: "8px",
                background: formData.exerciseExperience === level.key ? primaryColor : "var(--app-surface)",
                color: formData.exerciseExperience === level.key ? (isDarkMode ? "white" : "white") : "var(--app-text)",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease"
              }}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button
          type="button"
          onClick={handleSubmit}
          style={{
            flex: 2,
            padding: "14px",
            background: primaryColor,
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          Next
        </button>
        <button
          type="button"
          onClick={onSkip}
          style={{
            flex: 1,
            padding: "14px",
            background: "transparent",
            color: "var(--app-muted)",
            border: "none",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
            textDecoration: underline
          }}
        >
          Skip
        </button>
      </div>
    </div>
  );
}

function LimitationsStep({ data, onNext, onSkip, isDarkMode, primaryColor }) {
  const [formData, setFormData] = useState(data);

  const handleSubmit = () => {
    onNext(formData);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "var(--app-text)" }}>
          Additional Injuries or Limitations (optional)
        </label>
        <textarea
          value={formData.limitations || ""}
          onChange={(e) => setFormData(prev => ({ ...prev, limitations: e.target.value }))}
          placeholder="Any other injuries or physical limitations we should know about?"
          rows={3}
          style={{
            width: "100%",
            padding: "14px",
            border: "1px solid var(--app-border)",
            borderRadius: "8px",
            background: "var(--app-surface)",
            color: "var(--app-text)",
            fontSize: "16px",
            resize: "vertical"
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button
          type="button"
          onClick={handleSubmit}
          style={{
            flex: 2,
            padding: "14px",
            background: primaryColor,
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          Next
        </button>
        <button
          type="button"
          onClick={onSkip}
          style={{
            flex: 1,
            padding: "14px",
            background: "transparent",
            color: "var(--app-muted)",
            border: "none",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
            textDecoration: underline
          }}
        >
          Skip
        </button>
      </div>
    </div>
  );
}

function HabitsStep({ data, onNext, onSkip, isDarkMode, primaryColor }) {
  const [formData, setFormData] = useState(data);

  const handleSubmit = () => {
    onNext(formData);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "var(--app-text)" }}>
          Smoking & Drinking (optional)
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "14px", color: "var(--app-text)" }}>Do you smoke?</span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, habits: { ...prev.habits, smoking: true } }))}
                style={{
                  padding: "10px 16px",
                  border: "1px solid var(--app-border)",
                  borderRadius: "6px",
                  background: formData.habits?.smoking ? primaryColor : "var(--app-surface)",
                  color: formData.habits?.smoking ? (isDarkMode ? "white" : "white") : "var(--app-text)",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, habits: { ...prev.habits, smoking: false } }))}
                style={{
                  padding: "10px 16px",
                  border: "1px solid var(--app-border)",
                  borderRadius: "6px",
                  background: !formData.habits?.smoking ? primaryColor : "var(--app-surface)",
                  color: !formData.habits?.smoking ? (isDarkMode ? "white" : "white") : "var(--app-text)",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                No
              </button>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: center", gap: "12px" }}>
            <span style={{ fontSize: "14px", color: "var(--app-text)" }}>Do you drink alcohol?</span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, habits: { ...prev.habits, drinking: true } }))}
                style={{
                  padding: "10px 16px",
                  border: "1px solid var(--app-border)",
                  borderRadius: "6px",
                  background: formData.habits?.drinking ? primaryColor : "var(--app-surface)",
                  color: formData.habits?.drinking ? (isDarkMode ? "white" : "white) : "var(--app-text)",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, habits: { ...prev.habits, drinking: false } }))}
                style={{
                  padding: "10px 16px",
                  border: "1px solid var(--app-border)",
                  borderRadius: "6px",
                  background: !formData.habits?.drinking ? primaryColor : "var(--app-surface)",
                  color: !formData.habits?.drinking ? (isDarkMode ? "white" : "white") : "var(--app-text)",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button
          type="button"
          onClick={handleSubmit}
          style={{
            flex: 2,
            padding: "14px",
            background: primaryColor,
            color: "white",
            border: "none",
          borderRadius: "8px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          Next
        </button>
        <button
          type="button"
          onClick={onSkip}
          style={{
            flex: 1,
            padding: "14px",
            background: "transparent",
            color: "var(--app-muted)",
            border: "none",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
            textDecoration: underline
          }}
        >
          Skip
        </button>
      </div>
    </div>
  );
}

function ReviewStep({ data, onComplete, onBack, isLastStep, isDarkMode, primaryColor }) {
  const weightKg = data.weightUnit === "lbs" ? data.weightKg * 0.3527 : data.weightKg;
  const heightCm = data.heightUnit === "ft" ? data.heightCm * 30.48 : data.heightCm;
  
  const goalConfig = GOALS.find(g => g.key === data.goal) || GOALS[0];
  const activityMultiplier = ACTIVITY_LEVELS.find(a => a.key === data.activityLevel)?.multiplier || 1.2;
  
  let bmr;
  if (data.gender === "male") {
    bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * data.age) + 5;
  } else {
    bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * data.age) - 161;
  }
  
  const tdee = bmr * activityMultiplier;
  const targetCalories = Math.round(tdee + goalConfig.calorieAdjustment);
  const targetProtein = Math.round(weightKg * goalConfig.proteinPerKg);

  let workoutFocus = "Full Body";
  if (data.workoutDaysPerWeek >= 5) {
    workoutFocus = "Push/Pull/Legs Split";
  } else if (data.workoutDaysPerWeek >= 3) {
    workoutFocus = "Upper/Lower Split";
  }

  const handleComplete = () => {
    onComplete();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{
        padding: "20px",
        background: "var(--app-surface-soft)",
        border: "1px solid var(--app-border)",
        borderRadius: "12px"
      }}>
        <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", color: "var(--app-text)" }}>
          Your Personalized Plan
        </h3>

        <div style={{ fontSize: "14px", color: "var(--app-text)", lineHeight: 1.6 }}>
          <div style={{ marginBottom: "12px" }}>
            <strong>Profile:</strong> {data.gender === "male" ? "Male" : "Female"}, {data.age} years old, {Math.round(weightKg)}kg, {Math.round(heightCm)}cm
          </div>
          <div style={{ marginBottom: 12px }}>
            <strong>Goal:</strong> {GOALS.find(g => g.key === data.goal)?.label}
          </div>
          <div style={{ marginBottom: 12px }}>
            <strong>Activity:</strong> {ACTIVITY_LEVELS.find(a => a.key === data.activityLevel)?.label}
          </div>
          <div style={{ marginBottom: 12px }}>
            <strong>Diet:</strong> {DIET_TYPES.find(d => d.key === data.dietType)?.label}
          </div>
          <div style={{ marginBottom: 12px }}>
            <strong>Workout:</strong> {data.workoutDaysPerWeek} days/week
          </div>
          <div style={{ marginBottom: 12px }}>
            <strong>Equipment:</strong> {EQUIPMENT_OPTIONS.find(e => e.key === data.equipment)?.label}
          </div>
        </div>

        <div style={{
          padding: "16px",
          background: isDarkMode ? "rgba(29, 209, 117, 0.15)" : "rgba(37, 99, 235, 0.1)",
          border: "1px solid var(--app-primary)",
          borderRadius: "8px"
        }}>
          <h4 style={{ margin: "0 0 12px 0", fontSize: "16px", color: "var(--app-text)" }}>
            Your Calculated Targets
          </h4>
          <div style={{ fontSize: "14px", color: "var(--app-text)", lineHeight: 1.6 }}>
            <div style={{ marginBottom: "8px" }}>
              <strong>Daily Calories:</strong> {targetCalories} kcal
            </div>
            <div style={{ marginBottom: 8px }}>
              <strong>Daily Protein:</strong> {targetProtein}g
            </div>
            <div style={{ marginBottom: 8px }}>
              <strong>Workout Focus:</strong> {workoutFocus}
            </div>
            <div>
              <strong>Calorie Deficit:</strong> {goalConfig.calorieAdjustment > 0 ? `+${goalConfig.calorieAdjustment}` : goalConfig.calorieAdjustment} kcal
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            flex: 1,
            padding: "14px",
            background: "var(--app-surface-soft)",
            color: "var(--app-text)",
            border: "1px solid var(--app-border)",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleComplete}
          style={{
            flex: 2,
            padding: "14px",
            background: primaryColor,
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          {isLastStep ? "Complete & Start" : "Next"}
        </button>
      </div>
    </div>
  );
}
