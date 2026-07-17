const youtube = (query) => `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

const exercise = (name, sets, reps, query = name) => ({
  name,
  sets,
  reps,
  mediaUrl: youtube(`${query} proper form`)
});

const section = (title, exercises) => ({ title, exercises });
const fullBody = (focus, sections) => ({ focus, sections });

export const WORKOUT_SPLIT = {
  Mon: fullBody("Full Body A - Push + Pull", [
    section("warmup", [
      exercise("Skipping Rope Warmup", 1, "3-5 min", "skipping rope warmup"),
      exercise("Arm Circles", 2, "15-20 reps", "arm circles"),
      exercise("Hip Hinges", 2, "10 reps", "hip hinge warmup")
    ]),
    section("mainWorkout", [
      exercise("Pushup Board - Chest Focus", 3, "8-10", "pushup board chest"),
      exercise("Dumbbell Bent-Over Row", 3, "10-12", "dumbbell bent over row"),
      exercise("Loaded Bag Squats", 3, "10-12", "weighted bag squats"),
      exercise("Standing Overhead Press", 3, "10-12", "dumbbell overhead press")
    ]),
    section("afterWorkoutStretches", [
      exercise("Chest Opener Stretch", 2, "30 sec", "chest opener stretch"),
      exercise("Hamstring Stretch", 2, "30 sec", "hamstring stretch"),
      exercise("Shoulder Stretch", 2, "30 sec", "shoulder stretch")
    ])
  ]),

  Tue: fullBody("Full Body B - Grip + Lower", [
    section("warmup", [
      exercise("Jump Rope Light Pace", 1, "3 min", "light jump rope"),
      exercise("Wrist Mobility", 2, "15 reps", "wrist mobility exercises"),
      exercise("Bodyweight Squats", 2, "12 reps", "bodyweight squat warmup")
    ]),
    section("mainWorkout", [
      exercise("Incline Pushup Board", 3, "8-10", "incline pushup board"),
      exercise("Grip Trainer Holds", 3, "20-30 sec", "grip trainer hold"),
      exercise("Bag Squats with Plates", 3, "10-12", "weighted bag squats"),
      exercise("Dumbbell Hammer Curls", 3, "10-12", "dumbbell hammer curl")
    ]),
    section("afterWorkoutStretches", [
      exercise("Quad Stretch", 2, "30 sec", "quad stretch"),
      exercise("Triceps Stretch", 2, "30 sec", "triceps stretch"),
      exercise("Calf Stretch", 2, "30 sec", "calf stretch")
    ])
  ]),

  Wed: fullBody("Recovery Day", [
    section("warmup", [
      exercise("Gentle Rope Swing", 1, "2-3 min", "gentle jump rope"),
      exercise("Cat-Cow Stretch", 2, "10 reps", "cat cow stretch")
    ]),
    section("mainWorkout", [
      exercise("Slow Walking Glute Warmup", 1, "5 min", "walking glute warmup"),
      exercise("Core Stability Hold", 3, "20-30 sec", "core stability hold")
    ]),
    section("afterWorkoutStretches", [
      exercise("Spinal Twist", 2, "30 sec each side", "spinal twist stretch"),
      exercise("Hip Flexor Stretch", 2, "30 sec each side", "hip flexor stretch")
    ])
  ]),

  Thu: fullBody("Full Body C - Strength + Stability", [
    section("warmup", [
      exercise("Skipping Rope", 1, "3-4 min", "skipping rope warmup"),
      exercise("Shoulder Circles", 2, "15 reps", "shoulder circles"),
      exercise("Bodyweight Lunges", 2, "8 each leg", "bodyweight lunge warmup")
    ]),
    section("mainWorkout", [
      exercise("Decline Pushups on Pushup Board", 3, "8-10", "decline pushup board"),
      exercise("One-Arm Dumbbell Row", 3, "10 each side", "one arm dumbbell row"),
      exercise("Weighted Bag Goblet Squats", 3, "10-12", "weighted bag goblet squat"),
      exercise("Dumbbell Lateral Raises", 3, "12-15", "dumbbell lateral raise")
    ]),
    section("afterWorkoutStretches", [
      exercise("Lower Back Stretch", 2, "30 sec", "lower back stretch"),
      exercise("Chest Stretch", 2, "30 sec", "chest stretch")
    ])
  ]),

  Fri: fullBody("Full Body D - Endurance + Core", [
    section("warmup", [
      exercise("Skipping Rope", 1, "3 min", "skipping rope warmup"),
      exercise("Wrist Warmup", 2, "15 reps", "wrist warmup"),
      exercise("Hip Swings", 2, "10 each side", "hip swing warmup")
    ]),
    section("mainWorkout", [
      exercise("Pushup Board Mixed Grip", 3, "8-10", "pushup board mixed grip"),
      exercise("Dumbbell Goblet Squat", 3, "10-12", "dumbbell goblet squat"),
      exercise("Standing Plate Hold", 3, "20 sec", "plate hold"),
      exercise("Plank Variation", 3, "25-35 sec", "plank variation")
    ]),
    section("afterWorkoutStretches", [
      exercise("Hamstring Stretch", 2, "30 sec", "hamstring stretch"),
      exercise("Shoulder Mobility Stretch", 2, "30 sec", "shoulder mobility stretch")
    ])
  ]),

  Sat: fullBody("Rest", []),
  Sun: fullBody("Rest", [])
};
