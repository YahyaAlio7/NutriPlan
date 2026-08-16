import { onStartPage } from "./startPage.js";
import { searchMeals } from "./searchMeal.js";
import { fireRecipeInstruction } from "./recipeInstruction.js";
import { mealSection, categorySection, searchSection } from "./sidebar.js";
import "./searchProduct.js";
onStartPage();

// search
searchMeals();

document.getElementById("recipes-grid").addEventListener("click", (e) => {
  const card = e.target.closest(".recipe-card");
  if (!card) return;

  const mealDetails = document.getElementById("meal-details");
  mealDetails.innerHTML = `
        <div class="flex items-center justify-center py-24">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>`;
  mealDetails.classList.remove("hidden");
  mealSection.classList.add("hidden");
  categorySection.classList.add("hidden");
  searchSection.classList.add("hidden");

  fireRecipeInstruction(card.getAttribute("data-meal-id"));
});
