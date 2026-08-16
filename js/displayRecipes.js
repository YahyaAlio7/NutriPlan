import { fetchMeals } from "./api/mealdb.js";

export async function displayRecipes(recipes = null) {
  if (!recipes) {
    recipes = await fetchMeals();
  }

  const grid = document.getElementById("recipes-grid");
  grid.innerHTML = ``;
  if (recipes.length === 0) {
    grid.innerHTML = `
            <div class="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <i class="fa-solid fa-search text-gray-400 text-2xl"></i>
                </div>
                <p class="text-gray-500 text-lg">No recipes found</p>
                <p class="text-gray-400 text-sm mt-2">Try searching for something else</p>
            </div>
        `;
    return;
  }
  recipes.forEach((element) => {
    grid.innerHTML += `<div
              class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
              data-meal-id="${element.id}"
            >
              <div class="relative h-48 overflow-hidden">
                <img
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src="${element.thumbnail}"
                  alt="${element.name}"
                  loading="lazy"
                />
                <div class="absolute bottom-3 left-3 flex gap-2">
                  <span
                    class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700"
                  >
                    ${element.category}
                  </span>
                  <span
                    class="px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white"
                  >
                    ${element.area}
                  </span>
                </div>
              </div>
              <div class="p-4">
                <h3
                  class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1"
                >
                  ${element.name}
                </h3>
                <p class="text-xs text-gray-600 mb-3 line-clamp-2">
                  ${element.instructions}
                </p>
                <div class="flex items-center justify-between text-xs">
                  <span class="font-semibold text-gray-900">
                    <i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>
                    ${element.category}
                  </span>
                  <span class="font-semibold text-gray-500">
                    <i class="fa-solid fa-globe text-blue-500 mr-1"></i>
                    ${element.area}
                  </span>
                </div>
              </div>
            </div>`;
  });
}
function setActiveViewBtn(activeBtn, inactiveBtn) {
  activeBtn.classList.add("bg-white", "rounded-md", "shadow-sm");
  activeBtn.classList.remove("text-gray-500");

  inactiveBtn.classList.remove("bg-white", "rounded-md", "shadow-sm");
  inactiveBtn.classList.add("text-gray-500");
}

const listBtn = document.getElementById("list-view-btn");
const gridBtn = document.getElementById("grid-view-btn");
const grid = document.getElementById("recipes-grid");

listBtn.addEventListener("click", () => {
  grid.classList.replace("grid-cols-4", "grid-cols-2");
  setActiveViewBtn(listBtn, gridBtn);
});

gridBtn.addEventListener("click", () => {
  grid.classList.replace("grid-cols-2", "grid-cols-4");
  setActiveViewBtn(gridBtn, listBtn);
});
