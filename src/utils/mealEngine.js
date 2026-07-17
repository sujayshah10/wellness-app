export function findNextMeals(foodDatabase, selectedDay) {

  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const safeFoodDatabase = foodDatabase || {};

  // current EST time
  const nowEST = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/New_York" })
  );

  const parseTime = (timeStr) => {
    if (!timeStr || typeof timeStr !== "string") return null;

    const [time, modifier] = timeStr.split(" ");
    if (!time) return null;

    let [hours, minutes] = time.split(":").map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    const date = new Date(nowEST);
    date.setHours(hours, minutes, 0, 0);

    return date;
  };

  const getMealsForDay = (day) => {
    const dayData = safeFoodDatabase[day] || {};

    if (Array.isArray(dayData)) {
      return dayData.map((meal) => {
        if (meal && typeof meal === "object") {
          return { ...meal, meal: meal.meal || meal.name, day };
        }

        return { name: String(meal || ""), meal: String(meal || ""), time: "", day };
      });
    }

    return Object.entries(dayData).map(([slot, meal]) => {
      if (!meal || typeof meal !== "object") {
        return { slot, name: String(meal || ""), meal: String(meal || ""), time: "", day };
      }

      return {
        ...meal,
        slot,
        meal: meal.meal || meal.name,
        day
      };
    });
  };

  // attach day to today's meals
  const todayMeals = getMealsForDay(selectedDay);

  let upcomingMeals = todayMeals.filter((meal) => {
    const mealTime = parseTime(meal.time);
    return mealTime ? mealTime > nowEST : false;
  });

  // If today's meals are finished, move to tomorrow.
  if (upcomingMeals.length === 0) {

    const todayIndex = days.indexOf(selectedDay);
    const tomorrowIndex = (todayIndex + 1) % 7;
    const tomorrow = days[tomorrowIndex];

    upcomingMeals = getMealsForDay(tomorrow);
  }

  const nextMeals = upcomingMeals.slice(0, 2);
  const nextPrepMeal = upcomingMeals.find(meal => meal.prep);

  return { nextMeals, nextPrepMeal };
}
