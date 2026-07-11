const fullBody = (focus, exercises) => ({ focus, exercises });

export const WORKOUT_SPLIT = {
  Mon: fullBody("Full Body A - Small Portions", [
    { name: "Push-Up Board - Chest", sets: 2, reps: "8-10" },
    { name: "Dumbbell Bent-Over Rows - Back", sets: 2, reps: "10-12" },
    { name: "Bodyweight Squats - Legs", sets: 2, reps: "12-15" },
    { name: "Dumbbell Shoulder Press - Shoulders", sets: 2, reps: "10-12" },
    { name: "Plank - Core", sets: 2, reps: "25-40 sec" }
  ]),

  Tue: fullBody("Full Body B - Small Portions", [
    { name: "Incline or Narrow Push-Ups - Chest/Triceps", sets: 2, reps: "8-10" },
    { name: "Rear Delt Fly - Upper Back", sets: 2, reps: "12-15" },
    { name: "Reverse Lunges - Legs", sets: 2, reps: "8-10 each leg" },
    { name: "Bicep Curls - Arms", sets: 2, reps: "10-12" },
    { name: "Dead Bug - Core", sets: 2, reps: "10 each side" }
  ]),

  Wed: fullBody("Rest", []),

  Thu: fullBody("Full Body C - Small Portions", [
    { name: "Decline Push-Ups - Chest", sets: 2, reps: "6-8" },
    { name: "One-Arm Dumbbell Row - Back", sets: 2, reps: "10 each side" },
    { name: "Glute Bridges - Glutes", sets: 2, reps: "15-20" },
    { name: "Lateral Raises - Shoulders", sets: 2, reps: "12-15" },
    { name: "Side Plank - Core", sets: 2, reps: "20 sec each side" }
  ]),

  Fri: fullBody("Full Body D - Small Portions", [
    { name: "Push-Up Board - Mixed Grip", sets: 2, reps: "8-10" },
    { name: "Superman Hold - Back/Posture", sets: 2, reps: "25-35 sec" },
    { name: "Calf Raises - Legs", sets: 2, reps: "18-25" },
    { name: "Overhead Tricep Extension - Arms", sets: 2, reps: "10-12" },
    { name: "Crunches - Core", sets: 2, reps: "15-20" }
  ]),

  Sat: fullBody("Rest", []),

  Sun: fullBody("Rest", [])
};
