import { useState, useEffect } from "react";
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

// Goal options (can select multiple)
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

// Cuisine preference options
const CUISINE_OPTIONS = [
  { key: "north_indian", label: "North Indian" },
  { key: "south_indian", label: "South Indian" },
  { key: "gujarati", label: "Gujarati" },
  { key: "continental", label: "Continental" },
  { key: "mixed", label: "Mixed" },
  { key: "other", label: "Other" }
];

// Comprehensive allergies list
const ALLERGIES_LIST = [
  "Peanuts", "Tree nuts (almonds, walnuts, cashews, etc.)", "Dairy/Milk", "Eggs",
  "Soy", "Wheat/Gluten", "Fish", "Shellfish (shrimp, crab, lobster, etc.)",
  "Sesame seeds", "Mustard", "Sulfites", "Latex", "Corn", "Nightshades (tomatoes, potatoes, eggplant)",
  "FODMAPs", "Histamine intolerance", "Fructose intolerance", "Lactose intolerance",
  "Coconut", "Avocado", "Banana", "Kiwi", "Mango", "Pineapple", "Strawberries",
  "Citrus fruits", "Chocolate", "Caffeine", "Alcohol", "None"
];

// Comprehensive food dislikes list (categorized)
const FOOD_DISLIKES_LIST = [
  // Vegetables
  "Bitter gourd (Karela)", "Okra (Bhindi)", "Bottle gourd (Lauki)", "Ridge gourd (Turai)",
  "Spinach (Palak)", "Broccoli", "Cauliflower", "Cabbage", "Brussels sprouts",
  "Eggplant (Baingan)", "Zucchini", "Mushrooms", "Bell peppers", "Onions",
  "Garlic", "Ginger", "Carrots", "Beets", "Radishes", "Turnips",
  "Leafy greens (methi, sarson, etc.)", "Bamboo shoots", "Lotus stem",
  // Fruits
  "Papaya", "Watermelon", "Muskmelon", "Banana", "Guava", "Pomegranate",
  "Jackfruit", "Raw mango", "Pear", "Peach", "Plum", "Apricot",
  // Herbs & Spices
  "Cilantro (Coriander)", "Curry leaves", "Mint", "Parsley", "Basil",
  "Rosemary", "Thyme", "Oregano", "Chili peppers", "Black pepper",
  "Turmeric", "Cumin", "Coriander seeds", "Fenugreek (Methi)", "Asafoetida (Hing)",
  // Proteins
  "Fish", "Shellfish", "Prawns", "Crab", "Lobster", "Chicken", "Mutton/Lamb",
  "Beef", "Pork", "Eggs", "Tofu", "Paneer", "Soy chunks",
  // Dairy alternatives
  "Soy milk", "Almond milk", "Coconut milk", "Oat milk",
  // Grains & Cereals
  "Rice", "Brown rice", "Quinoa", "Oats", "Barley", "Ragi (Finger millet)",
  "Bajra (Pearl millet)", "Jowar (Sorghum)", "Corn/Maize",
  // Legumes & Pulses
  "Lentils (Dal)", "Chickpeas (Chana)", "Kidney beans (Rajma)", "Black gram (Urad)",
  "Green peas", "Soybeans", "Mung beans", "Split peas",
  // Other
  "None"
];

// Exercise experience options
const EXERCISE_EXPERIENCE = [
  { key: "beginner", label: "Beginner - New to exercise" },
  { key: "intermediate", label: "Intermediate - Some experience" },
  { key: "advanced", label: "Advanced - Experienced lifter" }
];

// Welcome step (first step)
const WELCOME_STEP = { key: "welcome", title: "Welcome", required: true };

// Required steps (no skip)
const REQUIRED_STEPS = [
  { key: "profile", title: "Your Profile", required: true },
  { key: "goals", title: "Your Goals", required: true },
  { key: "activity", title: "Activity Level", required: true },
  { key: "diet", title: "Dietary Type", required: true },
  { key: "workout_schedule", title: "Workout Schedule", required: true },
  { key: "equipment", title: "Equipment Access", required: true },
  { key: "health_safety", title: "Health & Safety", required: true }
];

// Optional steps (with skip)
const OPTIONAL_STEPS = [
  { key: "goal_weight", title: "Goal Weight", required: false },
  { key: "meal_frequency", title: "Meal Frequency", required: false },
  { key: "preferences", title: "Meal Timing", required: false }, // Moved after meal_frequency
  { key: "location", title: "Location", required: false },
  { key: "cuisine", title: "Cuisine Preference", required: false },
  { key: "allergies", title: "Allergies & Intolerances", required: false },
  { key: "dislikes", title: "Foods You Dislike", required: false },
  { key: "sleep_schedule", title: "Sleep Schedule", required: false },
  { key: "cooking_time", title: "Cooking Time", required: false },
  { key: "exercise_experience", title: "Exercise Experience", required: false },
  { key: "limitations", title: "Injuries & Limitations", required: false },
  { key: "habits", title: "Habits", required: false }
];

// Review step (always last)
const REVIEW_STEP = { key: "review", title: "Review & Complete", required: true };

const ALL_STEPS = [WELCOME_STEP, ...REQUIRED_STEPS, ...OPTIONAL_STEPS, REVIEW_STEP];

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
    goals: ["lose_fat"], // Changed to array to support multiple goals
    activityLevel: "sedentary",
    dietType: "non_vegetarian",
    workoutDaysPerWeek: 3,
    equipment: "home_basics",
    
    // Optional fields (with defaults)
    goalWeightKg: null,
    mealsPerDay: 3,
    mealTimes: ["08:00", "13:00", "20:00"], // Default 3 meal times
    country: "",
    cuisine: "mixed",
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
  const [savedTheme, setSavedTheme] = useState(null);

  // Force dark theme during onboarding
  useEffect(() => {
    const root = document.documentElement;
    const currentTheme = root.dataset.theme || "light";
    setSavedTheme(currentTheme);
    root.dataset.theme = "dark";

    // Restore theme on unmount
    return () => {
      root.dataset.theme = currentTheme;
    };
  }, []);

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
    // Restore user's theme preference
    const root = document.documentElement;
    root.dataset.theme = savedTheme || "light";

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

    // Target calories based on goals (handle multiple selections)
    const selectedGoals = onboardingData.goals || ["lose_fat"];
    let targetCalories = tdee;
    let targetProtein = Math.round(weightKg * 1.6); // Default to maintain protein

    if (selectedGoals.includes("lose_fat") && selectedGoals.includes("build_muscle")) {
      // Body recomposition: maintain calories, higher protein
      targetCalories = Math.round(tdee);
      targetProtein = Math.round(weightKg * 2.2); // Higher protein for recomp
    } else if (selectedGoals.includes("lose_fat")) {
      targetCalories = Math.round(tdee - 500);
      targetProtein = Math.round(weightKg * 2.0);
    } else if (selectedGoals.includes("build_muscle")) {
      targetCalories = Math.round(tdee + 300);
      targetProtein = Math.round(weightKg * 2.0);
    } else if (selectedGoals.includes("maintain")) {
      targetCalories = Math.round(tdee);
      targetProtein = Math.round(weightKg * 1.6);
    }
    
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
      goals: onboardingData.goals, // Changed to array
      dietType: onboardingData.dietType,
      workoutDaysPerWeek: onboardingData.workoutDaysPerWeek,
      equipment: onboardingData.equipment,
      goalWeightKg: onboardingData.goalWeightKg,
      mealsPerDay: onboardingData.mealsPerDay,
      mealTimes: onboardingData.mealTimes,
      country: onboardingData.country,
      cuisine: onboardingData.cuisine,
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
      deficitOverride: targetCalories - tdee
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
    case "welcome":
      return <WelcomeStep data={data} onNext={onNext} isDarkMode={isDarkMode} primaryColor={primaryColor} />;
    case "profile":
      return <ProfileStep data={data} onNext={onNext} onBack={onBack} isDarkMode={isDarkMode} primaryColor={primaryColor} />;
    case "goals":
      return <GoalsStep data={data} onNext={onNext} onBack={onBack} isDarkMode={isDarkMode} primaryColor={primaryColor} />;
    case "activity":
      return <ActivityStep data={data} onNext={onNext} onBack={onBack} isDarkMode={isDarkMode} primaryColor={primaryColor} />;
    case "diet":
      return <DietStep data={data} onNext={onNext} onBack={onBack} isDarkMode={isDarkMode} primaryColor={primaryColor} />;
    case "workout_schedule":
      return <WorkoutScheduleStep data={data} onNext={onNext} onBack={onBack} isDarkMode={isDarkMode} primaryColor={primaryColor} />;
    case "equipment":
      return <EquipmentStep data={data} onNext={onNext} onBack={onBack} isDarkMode={isDarkMode} primaryColor={primaryColor} />;
    case "preferences":
      return <PreferencesStep data={data} onNext={onNext} onBack={onBack} isDarkMode={isDarkMode} primaryColor={primaryColor} />;
    case "health_safety":
      return <HealthSafetyStep data={data} onNext={onNext} onBack={onBack} isDarkMode={isDarkMode} primaryColor={primaryColor} />;
    case "goal_weight":
      return <GoalWeightStep data={data} onNext={onNext} onBack={onBack} onSkip={onSkip} isDarkMode={isDarkMode} primaryColor={primaryColor} />;
    case "meal_frequency":
      return <MealFrequencyStep data={data} onNext={onNext} onBack={onBack} onSkip={onSkip} isDarkMode={isDarkMode} primaryColor={primaryColor} />;
    case "location":
      return <LocationStep data={data} onNext={onNext} onBack={onBack} onSkip={onSkip} isDarkMode={isDarkMode} primaryColor={primaryColor} />;
    case "cuisine":
      return <CuisineStep data={data} onNext={onNext} onBack={onBack} onSkip={onSkip} isDarkMode={isDarkMode} primaryColor={primaryColor} />;
    case "allergies":
      return <AllergiesStep data={data} onNext={onNext} onBack={onBack} onSkip={onSkip} isDarkMode={isDarkMode} primaryColor={primaryColor} />;
    case "dislikes":
      return <DislikesStep data={data} onNext={onNext} onBack={onBack} onSkip={onSkip} isDarkMode={isDarkMode} primaryColor={primaryColor} />;
    case "sleep_schedule":
      return <SleepScheduleStep data={data} onNext={onNext} onBack={onBack} onSkip={onSkip} isDarkMode={isDarkMode} primaryColor={primaryColor} />;
    case "cooking_time":
      return <CookingTimeStep data={data} onNext={onNext} onBack={onBack} onSkip={onSkip} isDarkMode={isDarkMode} primaryColor={primaryColor} />;
    case "exercise_experience":
      return <ExerciseExperienceStep data={data} onNext={onNext} onBack={onBack} onSkip={onSkip} isDarkMode={isDarkMode} primaryColor={primaryColor} />;
    case "limitations":
      return <LimitationsStep data={data} onNext={onNext} onBack={onBack} onSkip={onSkip} isDarkMode={isDarkMode} primaryColor={primaryColor} />;
    case "habits":
      return <HabitsStep data={data} onNext={onNext} onBack={onBack} onSkip={onSkip} isDarkMode={isDarkMode} primaryColor={primaryColor} />;
    case "review":
      return <ReviewStep data={data} onComplete={onComplete} onBack={onBack} isLastStep={isLastStep} isDarkMode={isDarkMode} primaryColor={primaryColor} />;
    default:
      return <div>Step not found</div>;
  }
}

// Helper component for navigation buttons
function NavigationButtons({ onBack, onNext, onSkip, isLastStep, isDarkMode, primaryColor, showSkip = false }) {
  return (
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
          fontWeight: 600,
          cursor: "pointer"
        }}
      >
        Back
      </button>
      {showSkip ? (
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
      ) : null}
      <button
        type="button"
        onClick={onNext}
        style={{
          flex: showSkip ? 1 : 2,
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
        {isLastStep ? "Complete" : "Next"}
      </button>
    </div>
  );
}

// Welcome Step Component
function WelcomeStep({ data, onNext, isDarkMode, primaryColor }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", alignItems: "center", textAlign: "center" }}>
      <div style={{
        fontSize: "64px",
        marginBottom: "16px"
      }}>
        🌟
      </div>
      
      <h2 style={{
        margin: 0,
        fontSize: "28px",
        fontWeight: 600,
        color: "var(--app-text)"
      }}>
        Let's build your plan together
      </h2>
      
      <p style={{
        margin: 0,
        fontSize: "16px",
        lineHeight: 1.6,
        color: "var(--app-muted)",
        maxWidth: "400px"
      }}>
        This will take just a couple of minutes. We'll personalize your meals, workouts, and daily targets to help you reach your goals.
      </p>
      
      <div style={{
        padding: "20px",
        background: "var(--app-surface-soft)",
        borderRadius: "12px",
        border: "1px solid var(--app-border)",
        maxWidth: "400px"
      }}>
        <div style={{ fontSize: "14px", color: "var(--app-text)", lineHeight: 1.6 }}>
          <div style={{ marginBottom: "8px" }}>✓ Personalized calorie & protein targets</div>
          <div style={{ marginBottom: "8px" }}>✓ Meal timing that fits your schedule</div>
          <div style={{ marginBottom: "8px" }}>✓ Workout plan based on your equipment</div>
          <div>✓ Progress tracking & weekly summaries</div>
        </div>
      </div>
      
      <button
        onClick={() => onNext(data)}
        style={{
          padding: "16px 32px",
          background: primaryColor,
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "18px",
          fontWeight: 600,
          cursor: "pointer",
          minWidth: "200px"
        }}
      >
        Let's begin
      </button>
    </div>
  );
}

// Step Components
function ProfileStep({ data, onNext, onBack, isDarkMode, primaryColor }) {
  const [formData, setFormData] = useState(data);
  const [useImperial, setUseImperial] = useState(data.heightUnit === "ft" || data.weightUnit === "lbs");
  
  // Split height into feet and inches for imperial display
  const [feet, setFeet] = useState(() => {
    if (data.heightUnit === "ft") {
      return Math.floor(data.heightCm / 30.48);
    }
    return 5;
  });
  const [inches, setInches] = useState(() => {
    if (data.heightUnit === "ft") {
      return Math.round((data.heightCm % 30.48) / 2.54);
    }
    return 9;
  });

  const handleSubmit = () => {
    if (!formData.age || formData.age < 16 || formData.age > 100) {
      alert("Please enter a valid age (16-100)");
      return;
    }
    
    // Convert imperial to metric if needed
    let finalHeightCm = formData.heightCm;
    if (useImperial) {
      finalHeightCm = (feet * 30.48) + (inches * 2.54);
    }
    
    onNext({ ...formData, heightCm: finalHeightCm, heightUnit: useImperial ? "ft" : "cm" });
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
          {useImperial ? (
            <>
              <input
                type="number"
                value={feet || ''}
                onChange={(e) => setFeet(e.target.value === '' ? 0 : Number(e.target.value))}
                placeholder="ft"
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
              <input
                type="number"
                value={inches || ''}
                onChange={(e) => setInches(e.target.value === '' ? 0 : Number(e.target.value))}
                placeholder="in"
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
            </>
          ) : (
            <input
              type="number"
              value={formData.heightCm || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, heightCm: e.target.value === '' ? 0 : Number(e.target.value) }))}
              placeholder="Height (cm)"
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
          )}
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

      <NavigationButtons onBack={onBack} onNext={() => handleSubmit()} isDarkMode={isDarkMode} primaryColor={primaryColor} />
    </div>
  );
}

function GoalsStep({ data, onNext, onBack, isDarkMode, primaryColor }) {
  const [formData, setFormData] = useState(data);

  const handleSubmit = () => {
    onNext(formData);
  };

  const toggleGoal = (goalKey) => {
    setFormData(prev => {
      const currentGoals = prev.goals || [];
      if (currentGoals.includes(goalKey)) {
        // Don't allow deselecting all goals - keep at least one
        if (currentGoals.length > 1) {
          return { ...prev, goals: currentGoals.filter(g => g !== goalKey) };
        }
        return prev;
      } else {
        return { ...prev, goals: [...currentGoals, goalKey] };
      }
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <label style={{ display: "block", marginBottom: "12px", fontWeight: 600, color: "var(--app-text)" }}>
          What are your goals? (Select all that apply) *
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {GOALS.map((goal) => {
            const isSelected = (formData.goals || []).includes(goal.key);
            return (
              <button
                key={goal.key}
                type="button"
                onClick={() => toggleGoal(goal.key)}
                style={{
                  padding: "16px",
                  border: "1px solid var(--app-border)",
                  borderRadius: "8px",
                  background: isSelected ? primaryColor : "var(--app-surface)",
                  color: isSelected ? (isDarkMode ? "white" : "white") : "var(--app-text)",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <span>{goal.label}</span>
                {isSelected && <span>✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      <NavigationButtons onBack={onBack} onNext={() => handleSubmit()} isDarkMode={isDarkMode} primaryColor={primaryColor} />
    </div>
  );
}

function ActivityStep({ data, onNext, onBack, isDarkMode, primaryColor }) {
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

      <NavigationButtons onBack={onBack} onNext={() => handleSubmit()} isDarkMode={isDarkMode} primaryColor={primaryColor} />
    </div>
  );
}

function DietStep({ data, onNext, onBack, isDarkMode, primaryColor }) {
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

      <NavigationButtons onBack={onBack} onNext={() => handleSubmit()} isDarkMode={isDarkMode} primaryColor={primaryColor} />
    </div>
  );
}

function WorkoutScheduleStep({ data, onNext, onBack, isDarkMode, primaryColor }) {
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

      <NavigationButtons onBack={onBack} onNext={() => handleSubmit()} isDarkMode={isDarkMode} primaryColor={primaryColor} />
    </div>
  );
}

function EquipmentStep({ data, onNext, onBack, isDarkMode, primaryColor }) {
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

      <NavigationButtons onBack={onBack} onNext={() => handleSubmit()} isDarkMode={isDarkMode} primaryColor={primaryColor} />
    </div>
  );
}

function PreferencesStep({ data, onNext, onBack, isDarkMode, primaryColor }) {
  const [formData, setFormData] = useState(data);
  const mealsPerDay = data.mealsPerDay || 3;

  // Initialize meal times if not set
  const mealTimes = formData.mealTimes || Array(mealsPerDay).fill("12:00");

  const handleMealTimeChange = (index, time) => {
    const newMealTimes = [...mealTimes];
    newMealTimes[index] = time;
    setFormData(prev => ({ ...prev, mealTimes: newMealTimes }));
  };

  const getMealLabel = (index) => {
    const labels = {
      1: ["Meal"],
      2: ["First Meal", "Second Meal"],
      3: ["Breakfast", "Lunch", "Dinner"],
      4: ["Breakfast", "Morning Snack", "Lunch", "Dinner"],
      5: ["Breakfast", "Morning Snack", "Lunch", "Afternoon Snack", "Dinner"]
    };
    return labels[mealsPerDay]?.[index] || `Meal ${index + 1}`;
  };

  const handleSubmit = () => {
    setFormData(prev => ({ ...prev, mealTimes }));
    onNext(formData);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <label style={{ display: "block", marginBottom: "12px", fontWeight: 600, color: "var(--app-text)" }}>
          Set your meal times ({mealsPerDay} meals/day) *
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {Array.from({ length: mealsPerDay }).map((_, index) => (
            <div key={index}>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "13px", color: "var(--app-muted)" }}>
                {getMealLabel(index)}
              </label>
              <input
                type="time"
                value={mealTimes[index]}
                onChange={(e) => handleMealTimeChange(index, e.target.value)}
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
          ))}
        </div>
      </div>

      <NavigationButtons onBack={onBack} onNext={() => handleSubmit()} isDarkMode={isDarkMode} primaryColor={primaryColor} />
    </div>
  );
}

function HealthSafetyStep({ data, onNext, onBack, isDarkMode, primaryColor }) {
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

      <NavigationButtons onBack={onBack} onNext={() => handleSubmit()} isDarkMode={isDarkMode} primaryColor={primaryColor} />
    </div>
  );
}

// Optional Steps
function GoalWeightStep({ data, onNext, onBack, onSkip, isDarkMode, primaryColor }) {
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

      <NavigationButtons onBack={onBack} onNext={() => handleSubmit()} onSkip={onSkip} showSkip={true} isDarkMode={isDarkMode} primaryColor={primaryColor} />
    </div>
  );
}

function MealFrequencyStep({ data, onNext, onBack, onSkip, isDarkMode, primaryColor }) {
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
          {[1, 2, 3, 4, 5].map((num) => (
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

      <NavigationButtons onBack={onBack} onNext={() => handleSubmit()} onSkip={onSkip} showSkip={true} isDarkMode={isDarkMode} primaryColor={primaryColor} />
    </div>
  );
}

function LocationStep({ data, onNext, onBack, onSkip, isDarkMode, primaryColor }) {
  const [formData, setFormData] = useState(data);
  const [searchQuery, setSearchQuery] = useState(formData.country || "");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      // Using countries.dev free API for city/region search
      const response = await fetch(`https://countries.dev/cities?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('API request failed');
      }
      const data = await response.json();
      const cities = data.cities || [];
      setSuggestions(cities.slice(0, 10)); // Limit to 10 suggestions
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectLocation = (location) => {
    setFormData(prev => ({ ...prev, country: location }));
    setSearchQuery(location);
    setShowSuggestions(false);
  };

  const handleSubmit = () => {
    setFormData(prev => ({ ...prev, country: searchQuery }));
    onNext(formData);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "var(--app-text)" }}>
          City/Location (optional)
        </label>
        <div style={{ position: "relative" }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Type to search your city..."
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
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
          {showSuggestions && suggestions.length > 0 && (
            <div style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              maxHeight: "200px",
              overflowY: "auto",
              background: "var(--app-surface)",
              border: "1px solid var(--app-border)",
              borderRadius: "8px",
              marginTop: "4px",
              zIndex: 1000,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}>
              {suggestions.map((city, index) => (
                <div
                  key={index}
                  onClick={() => selectLocation(city.name)}
                  style={{
                    padding: "12px 14px",
                    cursor: "pointer",
                    borderBottom: index < suggestions.length - 1 ? "1px solid var(--app-border)" : "none",
                    fontSize: "14px",
                    color: "var(--app-text)"
                  }}
                  onMouseEnter={(e) => e.target.style.background = "var(--app-surface-soft)"}
                  onMouseLeave={(e) => e.target.style.background = "var(--app-surface)"}
                >
                  {city.name}{city.country ? `, ${city.country}` : ""}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <NavigationButtons onBack={onBack} onNext={() => handleSubmit()} onSkip={onSkip} showSkip={true} isDarkMode={isDarkMode} primaryColor={primaryColor} />
    </div>
  );
}

function AllergiesStep({ data, onNext, onBack, onSkip, isDarkMode, primaryColor }) {
  const [formData, setFormData] = useState(data);
  const [selectedAllergies, setSelectedAllergies] = useState(() => {
    // Parse existing allergies string into array
    const existing = formData.allergies || "";
    return existing ? existing.split(", ").filter(a => a.trim()) : [];
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredAllergies = ALLERGIES_LIST.filter(allergy =>
    allergy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleAllergy = (allergy) => {
    setSelectedAllergies(prev => {
      if (prev.includes(allergy)) {
        return prev.filter(a => a !== allergy);
      } else {
        return [...prev, allergy];
      }
    });
  };

  const handleSubmit = () => {
    const updatedData = { ...formData, allergies: selectedAllergies.join(", ") };
    setFormData(updatedData);
    onNext(updatedData);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "var(--app-text)" }}>
          Any allergies or food intolerances? (optional)
        </label>
        <div style={{ position: "relative" }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            placeholder="Search or select allergies..."
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
          {showDropdown && (
            <div style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              maxHeight: "250px",
              overflowY: "auto",
              background: "var(--app-surface)",
              border: "1px solid var(--app-border)",
              borderRadius: "8px",
              marginTop: "4px",
              zIndex: 1000,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}>
              {filteredAllergies.map((allergy, index) => {
                const isSelected = selectedAllergies.includes(allergy);
                return (
                  <div
                    key={index}
                    onClick={() => toggleAllergy(allergy)}
                    style={{
                      padding: "12px 14px",
                      cursor: "pointer",
                      borderBottom: index < filteredAllergies.length - 1 ? "1px solid var(--app-border)" : "none",
                      fontSize: "14px",
                      color: "var(--app-text)",
                      background: isSelected ? "var(--app-surface-soft)" : "var(--app-surface)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                    onMouseEnter={(e) => e.target.style.background = isSelected ? "var(--app-surface-soft)" : "var(--app-surface-soft)"}
                    onMouseLeave={(e) => e.target.style.background = isSelected ? "var(--app-surface-soft)" : "var(--app-surface)"}
                  >
                    <span>{allergy}</span>
                    {isSelected && <span>✓</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {selectedAllergies.length > 0 && (
          <div style={{ marginTop: "12px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {selectedAllergies.map((allergy, index) => (
              <span
                key={index}
                onClick={() => toggleAllergy(allergy)}
                style={{
                  padding: "6px 12px",
                  background: primaryColor,
                  color: "white",
                  borderRadius: "16px",
                  fontSize: "12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                {allergy} ×
              </span>
            ))}
          </div>
        )}
      </div>

      <NavigationButtons onBack={onBack} onNext={() => handleSubmit()} onSkip={onSkip} showSkip={true} isDarkMode={isDarkMode} primaryColor={primaryColor} />
    </div>
  );
}

function CuisineStep({ data, onNext, onBack, onSkip, isDarkMode, primaryColor }) {
  const [formData, setFormData] = useState(data);

  const handleSubmit = () => {
    onNext(formData);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <label style={{ display: "block", marginBottom: "12px", fontWeight: 600, color: "var(--app-text)" }}>
          What cuisine do you eat most often? (optional)
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {CUISINE_OPTIONS.map((cuisine) => (
            <button
              key={cuisine.key}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, cuisine: cuisine.key }))}
              style={{
                padding: "16px",
                border: "1px solid var(--app-border)",
                borderRadius: "8px",
                background: formData.cuisine === cuisine.key ? primaryColor : "var(--app-surface)",
                color: formData.cuisine === cuisine.key ? (isDarkMode ? "white" : "white") : "var(--app-text)",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease"
              }}
            >
              {cuisine.label}
            </button>
          ))}
        </div>
      </div>

      <NavigationButtons onBack={onBack} onNext={() => handleSubmit()} onSkip={onSkip} showSkip={true} isDarkMode={isDarkMode} primaryColor={primaryColor} />
    </div>
  );
}

function DislikesStep({ data, onNext, onBack, onSkip, isDarkMode, primaryColor }) {
  const [formData, setFormData] = useState(data);
  const [selectedDislikes, setSelectedDislikes] = useState(() => {
    const existing = formData.dislikes || "";
    return existing ? existing.split(", ").filter(d => d.trim()) : [];
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredFoods = FOOD_DISLIKES_LIST.filter(food =>
    food.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleDislike = (food) => {
    setSelectedDislikes(prev => {
      if (prev.includes(food)) {
        return prev.filter(d => d !== food);
      } else {
        return [...prev, food];
      }
    });
  };

  const handleSubmit = () => {
    const updatedData = { ...formData, dislikes: selectedDislikes.join(", ") };
    setFormData(updatedData);
    onNext(updatedData);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "var(--app-text)" }}>
          Foods you dislike (optional)
        </label>
        <div style={{ position: "relative" }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            placeholder="Search or select foods you dislike..."
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
          {showDropdown && (
            <div style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              maxHeight: "300px",
              overflowY: "auto",
              background: "var(--app-surface)",
              border: "1px solid var(--app-border)",
              borderRadius: "8px",
              marginTop: "4px",
              zIndex: 1000,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}>
              {filteredFoods.map((food, index) => {
                const isSelected = selectedDislikes.includes(food);
                return (
                  <div
                    key={index}
                    onClick={() => toggleDislike(food)}
                    style={{
                      padding: "12px 14px",
                      cursor: "pointer",
                      borderBottom: index < filteredFoods.length - 1 ? "1px solid var(--app-border)" : "none",
                      fontSize: "14px",
                      color: "var(--app-text)",
                      background: isSelected ? "var(--app-surface-soft)" : "var(--app-surface)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                    onMouseEnter={(e) => e.target.style.background = isSelected ? "var(--app-surface-soft)" : "var(--app-surface-soft)"}
                    onMouseLeave={(e) => e.target.style.background = isSelected ? "var(--app-surface-soft)" : "var(--app-surface)"}
                  >
                    <span>{food}</span>
                    {isSelected && <span>✓</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {selectedDislikes.length > 0 && (
          <div style={{ marginTop: "12px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {selectedDislikes.map((food, index) => (
              <span
                key={index}
                onClick={() => toggleDislike(food)}
                style={{
                  padding: "6px 12px",
                  background: primaryColor,
                  color: "white",
                  borderRadius: "16px",
                  fontSize: "12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                {food} ×
              </span>
            ))}
          </div>
        )}
      </div>

      <NavigationButtons onBack={onBack} onNext={() => handleSubmit()} onSkip={onSkip} showSkip={true} isDarkMode={isDarkMode} primaryColor={primaryColor} />
    </div>
  );
}

function SleepScheduleStep({ data, onNext, onBack, onSkip, isDarkMode, primaryColor }) {
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
            textDecoration: "underline"
          }}
        >
          Skip
        </button>
      </div>
    </div>
  );
}

function CookingTimeStep({ data, onNext, onBack, onSkip, isDarkMode, primaryColor }) {
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
            textDecoration: "underline"
          }}
        >
          Skip
        </button>
      </div>
    </div>
  );
}

function ExerciseExperienceStep({ data, onNext, onBack, onSkip, isDarkMode, primaryColor }) {
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
            textDecoration: "underline"
          }}
        >
          Skip
        </button>
      </div>
    </div>
  );
}

function LimitationsStep({ data, onNext, onBack, onSkip, isDarkMode, primaryColor }) {
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
            textDecoration: "underline"
          }}
        >
          Skip
        </button>
      </div>
    </div>
  );
}

function HabitsStep({ data, onNext, onBack, onSkip, isDarkMode, primaryColor }) {
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

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
                  color: formData.habits?.drinking ? (isDarkMode ? "white" : "white") : "var(--app-text)",
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
            textDecoration: "underline"
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

  const selectedGoals = data.goals || ["lose_fat"];
  const activityMultiplier = ACTIVITY_LEVELS.find(a => a.key === data.activityLevel)?.multiplier || 1.2;

  let bmr;
  if (data.gender === "male") {
    bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * data.age) + 5;
  } else {
    bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * data.age) - 161;
  }

  const tdee = bmr * activityMultiplier;

  // Calculate targets based on multiple goals
  let targetCalories = tdee;
  let targetProtein = Math.round(weightKg * 1.6);
  let calorieAdjustment = 0;

  if (selectedGoals.includes("lose_fat") && selectedGoals.includes("build_muscle")) {
    targetCalories = Math.round(tdee);
    targetProtein = Math.round(weightKg * 2.2);
    calorieAdjustment = 0;
  } else if (selectedGoals.includes("lose_fat")) {
    targetCalories = Math.round(tdee - 500);
    targetProtein = Math.round(weightKg * 2.0);
    calorieAdjustment = -500;
  } else if (selectedGoals.includes("build_muscle")) {
    targetCalories = Math.round(tdee + 300);
    targetProtein = Math.round(weightKg * 2.0);
    calorieAdjustment = 300;
  } else if (selectedGoals.includes("maintain")) {
    targetCalories = Math.round(tdee);
    targetProtein = Math.round(weightKg * 1.6);
    calorieAdjustment = 0;
  }

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
          <div style={{ marginBottom: "12px" }}>
            <strong>Goals:</strong> {selectedGoals.map(g => GOALS.find(goal => goal.key === g)?.label).join(", ")}
          </div>
          <div style={{ marginBottom: "12px" }}>
            <strong>Activity:</strong> {ACTIVITY_LEVELS.find(a => a.key === data.activityLevel)?.label}
          </div>
          <div style={{ marginBottom: "12px" }}>
            <strong>Diet:</strong> {DIET_TYPES.find(d => d.key === data.dietType)?.label}
          </div>
          <div style={{ marginBottom: "12px" }}>
            <strong>Workout:</strong> {data.workoutDaysPerWeek} days/week
          </div>
          <div style={{ marginBottom: "12px" }}>
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
            <div style={{ marginBottom: "8px" }}>
              <strong>Daily Protein:</strong> {targetProtein}g
            </div>
            <div style={{ marginBottom: "8px" }}>
              <strong>Workout Focus:</strong> {workoutFocus}
            </div>
            <div>
              <strong>Calorie Adjustment:</strong> {calorieAdjustment > 0 ? `+${calorieAdjustment}` : calorieAdjustment} kcal
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
