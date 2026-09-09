import { useState } from "react";
import { useAppData } from "../context/useAppData";
import { useTranslation } from "../utils/useTranslation";
import { calculateBodyMetrics } from "../utils/healthCalculator";
import WelcomeScreen from "./onboarding/WelcomeScreen";
import ProfileSetup from "./onboarding/ProfileSetup";
import GoalsSetup from "./onboarding/GoalsSetup";
import PersonalizationSetup from "./onboarding/PersonalizationSetup";
import ScheduleSetup from "./onboarding/ScheduleSetup";
import SuccessScreen from "./onboarding/SuccessScreen";

const STEPS = [
  { key: "welcome", component: WelcomeScreen, title: "Welcome" },
  { key: "profile", component: ProfileSetup, title: "Your Profile" },
  { key: "goals", component: GoalsSetup, title: "Your Goals" },
  { key: "personalization", component: PersonalizationSetup, title: "Personalization" },
  { key: "schedule", component: ScheduleSetup, title: "Your Schedule" },
  { key: "success", component: SuccessScreen, title: "All Set!" }
];

export default function OnboardingWizard() {
  const { appData, setAppData } = useAppData();
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({
    // Profile data
    name: "",
    birthDate: "",
    gender: "male",
    heightCm: 175,
    heightUnit: "cm",
    weightKg: 80,
    weightUnit: "kg",
    
    // Goals data
    goal: "fatLoss",
    activityLevel: "light",
    timeline: "moderate",
    
    // Personalization data
    foodAvoidanceTags: [],
    workoutLimitationTags: [],
    otherFoodAvoidances: "",
    otherWorkoutLimitations: "",
    equipment: [],
    
    // Schedule data
    mealTimes: ["4:30 PM", "6:30 PM", "4:00 AM"],
    workoutTime: "6:00 PM"
  });

  const CurrentStepComponent = STEPS[currentStep].component;

  const handleNext = (data) => {
    if (data?.skipOnboarding) {
      // Skip onboarding and mark as completed
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
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Save all onboarding data to appData
    setAppData(prev => {
      const updatedProfile = {
        ...prev.profile,
        name: onboardingData.name,
        birthDate: onboardingData.birthDate,
        gender: onboardingData.gender,
        heightCm: onboardingData.heightCm,
        heightUnit: onboardingData.heightUnit,
        weightKg: onboardingData.weightKg,
        weightUnit: onboardingData.weightUnit,
        activityLevel: onboardingData.activityLevel,
        goal: onboardingData.goal,
        foodAvoidanceTags: onboardingData.foodAvoidanceTags,
        workoutLimitationTags: onboardingData.workoutLimitationTags,
        foodAvoidances: onboardingData.otherFoodAvoidances,
        workoutLimitations: onboardingData.otherWorkoutLimitations
      };

      // Calculate targets based on profile
      const metrics = calculateBodyMetrics(updatedProfile, prev.targets);

      return {
        ...prev,
        profile: updatedProfile,
        targets: {
          ...prev.targets,
          calories: metrics.calorieTarget,
          protein: metrics.proteinTarget,
          deficitTarget: metrics.deficitTarget
        },
        intakeSlots: onboardingData.mealTimes.map((time, index) => ({
          key: `intake${index + 1}`,
          label: `Meal ${index + 1}`,
          time: time,
          active: true
        })),
        settings: {
          ...prev.settings,
          onboardingCompleted: true,
          onboardingCompletedAt: new Date().toISOString()
        }
      };
    });
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

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
          color: "var(--app-muted)"
        }}>
          <span>Step {currentStep + 1} of {STEPS.length}</span>
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
            background: "linear-gradient(90deg, var(--app-primary), #1D4ED8)",
            borderRadius: "3px",
            transition: "width 0.3s ease"
          }} />
        </div>
      </div>

      {/* Step Indicator */}
      <div style={{
        display: "flex",
        gap: "8px",
        marginBottom: "24px",
        flexWrap: "wrap"
      }}>
        {STEPS.map((step, index) => (
          <div
            key={step.key}
            style={{
              flex: 1,
              minWidth: "40px",
              height: "4px",
              background: index <= currentStep 
                ? "var(--app-primary)" 
                : "var(--app-surface-soft)",
              borderRadius: "2px",
              transition: "background 0.3s ease"
            }}
          />
        ))}
      </div>

      {/* Current Step */}
      <div style={{ flex: 1 }}>
        <CurrentStepComponent
          data={onboardingData}
          onNext={handleNext}
          onBack={handleBack}
          onComplete={handleComplete}
          isFirstStep={currentStep === 0}
          isLastStep={currentStep === STEPS.length - 1}
          t={t}
        />
      </div>
    </div>
  );
}