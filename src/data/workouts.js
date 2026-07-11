const youtube = (query) => `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

const exercise = (name, sets, reps, query = name) => ({
  name,
  sets,
  reps,
  mediaUrl: youtube(`${query} proper form`)
});

const fullBody = (focus, exercises) => ({ focus, exercises });

export const WORKOUT_SPLIT = {
  Mon: fullBody("Full Body A - Small Portions", [
    exercise("Push-Up Board - Chest", 2, "8-10", "push up board chest"),
    exercise("Dumbbell Bent-Over Rows - Back", 2, "10-12", "dumbbell bent over row"),
    exercise("Bodyweight Squats - Legs", 2, "12-15", "bodyweight squat"),
    exercise("Dumbbell Shoulder Press - Shoulders", 2, "10-12", "dumbbell shoulder press"),
    exercise("Plank - Core", 2, "25-40 sec", "plank exercise")
  ]),

  Tue: fullBody("Full Body B - Small Portions", [
    exercise("Incline or Narrow Push-Ups - Chest/Triceps", 2, "8-10", "incline narrow push up"),
    exercise("Rear Delt Fly - Upper Back", 2, "12-15", "rear delt fly"),
    exercise("Reverse Lunges - Legs", 2, "8-10 each leg", "reverse lunge"),
    exercise("Bicep Curls - Arms", 2, "10-12", "dumbbell bicep curl"),
    exercise("Dead Bug - Core", 2, "10 each side", "dead bug exercise")
  ]),

  Wed: fullBody("Rest", []),

  Thu: fullBody("Full Body C - Small Portions", [
    exercise("Decline Push-Ups - Chest", 2, "6-8", "decline push up"),
    exercise("One-Arm Dumbbell Row - Back", 2, "10 each side", "one arm dumbbell row"),
    exercise("Glute Bridges - Glutes", 2, "15-20", "glute bridge"),
    exercise("Lateral Raises - Shoulders", 2, "12-15", "dumbbell lateral raise"),
    exercise("Side Plank - Core", 2, "20 sec each side", "side plank")
  ]),

  Fri: fullBody("Full Body D - Small Portions", [
    exercise("Push-Up Board - Mixed Grip", 2, "8-10", "push up board mixed grip"),
    exercise("Superman Hold - Back/Posture", 2, "25-35 sec", "superman hold"),
    exercise("Calf Raises - Legs", 2, "18-25", "calf raise"),
    exercise("Overhead Tricep Extension - Arms", 2, "10-12", "overhead tricep extension"),
    exercise("Crunches - Core", 2, "15-20", "crunch exercise")
  ]),

  Sat: fullBody("Rest", []),

  Sun: fullBody("Rest", [])
};
