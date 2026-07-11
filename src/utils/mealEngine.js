export function findNextMeals(foodDatabase, selectedDay) {

  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  // current EST time
  const nowEST = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/New_York" })
  );

  const parseTime = (timeStr) => {

    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    const date = new Date(nowEST);
    date.setHours(hours, minutes, 0, 0);

    return date;
  };

  const getMealsForDay = (day) => {
    const dayData = foodDatabase[day] || {};

    if (Array.isArray(dayData)) {
      return dayData.map(meal => ({ ...meal, day }));
    }

    return Object.entries(dayData).map(([slot, meal]) => ({
      ...meal,
      slot,
      meal: meal.meal || meal.name,
      day
    }));
  };

  // attach day to today's meals
  const todayMeals = getMealsForDay(selectedDay);

  let upcomingMeals = todayMeals.filter(meal => parseTime(meal.time) > nowEST);

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
