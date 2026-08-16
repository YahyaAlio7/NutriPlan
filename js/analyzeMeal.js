export async function analyzeMeal(data) {
  const ingredientStrings = data.ingredients.map(
    (item) => `${item.measure} ${item.ingredient}`,
  );
  const response = await fetch(
    "https://nutriplan-api.vercel.app/api/nutrition/analyze",
    {
      method: "POST",
      headers: {
        "x-api-key": "bdFXADgcnw227NVbSdHYUb9a7NUlWBKkdX2f07La",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipeName: data.name,
        ingredients: ingredientStrings,
      }),
    },
  );

  if (!response.ok) {
    console.error("Nutrition analysis failed:", response.status);
    return null;
  }

  const result = await response.json();
  return result;
}
