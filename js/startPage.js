import { setActiveButton, setStartSection, mealbtn } from "./sidebar.js";
import { displayRecipes } from "./displayRecipes.js";
import { displayCuisineFilters, displayCategories } from "./searchMeal.js";
import { displayProducts } from "./displayProducts.js";
import { displayProductsCategories } from "./displayProductsCategories.js";
export async function onStartPage() {
  setStartSection();
  setActiveButton(mealbtn);
  await displayRecipes();
  await displayCuisineFilters();
  await displayCategories();
  await displayProducts();
  await displayProductsCategories();
}
