const STORAGE_KEY = "loggedItems";

export const dailyGoals = {
  calories: 2000,
  protein: 50,
  carbs: 250,
  fat: 65,
};

export function getLoggedItems() {
  const loggedItems = localStorage.getItem(STORAGE_KEY);
  return loggedItems ? JSON.parse(loggedItems) : [];
}

function saveLoggedItems(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}
export function addMeal(meal) {
  const loggedItems = getLoggedItems();
  const now = new Date();
  loggedItems.push({
    id: `meal-${now.getTime()}`,
    type: "meal",
    name: meal.name,
    img: meal.img,
    date: now.toISOString(),
    time:
      meal.time ||
      now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    servings: meal.servings,
    calories: Math.round(meal.calories),
    protein: Math.round(meal.protein * 10) / 10,
    carbs: Math.round(meal.carbs * 10) / 10,
    fat: Math.round(meal.fat * 10) / 10,
  });
  saveLoggedItems(loggedItems);
}

export function addProduct(product) {
  const loggedItems = getLoggedItems();
  const now = new Date();
  loggedItems.push({
    id: `product-${now.getTime()}`,
    type: "product",
    name: product.name,
    img: product.img,
    date: now.toISOString(),
    time: now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
    quantity: product.quantity,
    calories: Math.round(product.calories),
    protein: Math.round(product.protein * 10) / 10,
    carbs: Math.round(product.carbs * 10) / 10,
    fat: Math.round(product.fat * 10) / 10,
  });
  saveLoggedItems(loggedItems);
}

export function removeLoggedItem(id) {
  const loggedItems = getLoggedItems().filter((item) => item.id !== id);
  saveLoggedItems(loggedItems);
}

export function clearLoggedItems() {
  saveLoggedItems([]);
}

function isSameDay(isoDate, referenceDate) {
  const date = new Date(isoDate);
  return date.toDateString() === referenceDate.toDateString();
}

export function getTodayItems() {
  const today = new Date();
  return getLoggedItems().filter((item) => isSameDay(item.date, today));
}

export function getTodayTotals() {
  return getTodayItems().reduce(
    (totals, item) => {
      totals.calories += item.calories;
      totals.protein += item.protein;
      totals.carbs += item.carbs;
      totals.fat += item.fat;
      return totals;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );
}
export function getWeekOverview() {
  const today = new Date();
  const dayIndex = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - dayIndex);

  const loggedItems = getLoggedItems();
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return dayLabels.map((label, index) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + index);

    const calories = loggedItems
      .filter((item) => isSameDay(item.date, day))
      .reduce((sum, item) => sum + item.calories, 0);

    return {
      label,
      date: day,
      dateNumber: day.getDate(),
      calories: Math.round(calories),
      isToday: day.toDateString() === today.toDateString(),
    };
  });
}
