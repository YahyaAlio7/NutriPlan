// meals api
export async function fetchMeals() {
  const response = await fetch(
    "https://nutriplan-api.vercel.app/api/meals/search?q=chicken&page=1&limit=25",
  );
  if (!response.ok) {
    console.error("Meal search failed:", response.status);
    return [];
  }
  const mealData = await response.json();
  return mealData.results;
}

export async function fetchAreas() {
  const response = await fetch(
    `https://nutriplan-api.vercel.app/api/meals/areas`,
  );
  if (!response.ok) {
    console.error("Fetching cuisines failed:", response.status);
    return [];
  }
  const data = await response.json();
  return data.results.map((area) => area.name);
}

export async function fetchMealCategories() {
  const response = await fetch(
    `https://nutriplan-api.vercel.app/api/meals/categories`,
  );
  if (!response.ok) {
    console.error("Fetching categories failed:", response.status);
    return [];
  }
  const data = await response.json();
  return data.results.map((category) => category.name).slice(0, 12);
}

// mealsby id
export async function fetchMealById(mealId) {
  const response = await fetch(
    `https://nutriplan-api.vercel.app/api/meals/${mealId}`,
  );
  if (!response.ok) {
    console.error("Fetching meal failed:", response.status);
    return null;
  }
  const responseData = await response.json();
  return responseData.result;
}
