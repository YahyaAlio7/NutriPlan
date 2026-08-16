import { fetchAreas, fetchMealCategories } from "./api/mealdb.js";
import { displayRecipes } from "./displayRecipes.js";

function debounce(callback, delay = 400) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), delay);
  };
}

export function searchMeals() {
  const searchInput = document.getElementById("search-input");
  const recipesCount = document.getElementById("recipes-count");

  const runSearch = debounce(async (searchTerm) => {
    if (!searchTerm) {
      displayRecipes();
      recipesCount.innerHTML = `Showing 25 recipes`;
      return;
    }

    const response = await fetch(
      `https://nutriplan-api.vercel.app/api/meals/search?q=${encodeURIComponent(searchTerm)}&page=1&limit=25`,
    );
    if (!response.ok) {
      console.error("Meal search failed:", response.status);
      recipesCount.innerHTML = `Couldn't search recipes right now`;
      displayRecipes([]);
      return;
    }

    const data = await response.json();
    recipesCount.innerHTML = `Showing ${data.results.length} recipes for "${searchTerm}"`;
    displayRecipes(data.results);
  });

  searchInput.addEventListener("input", () => {
    runSearch(searchInput.value.trim());
  });
}

export async function displayCuisineFilters() {
  const cuisineNames = await fetchAreas();
  const cuisinesContainer = document.getElementById("cuisines");
  for (let index = 0; index < 10; index++) {
    const cuisineBtn = document.createElement("button");
    cuisineBtn.classList.add(
      "cuisineBtn",
      "px-4",
      "py-2",
      "bg-gray-100",
      "text-gray-700",
      "rounded-full",
      "font-medium",
      "text-sm",
      "whitespace-nowrap",
      "hover:bg-gray-200",
      "transition-all",
    );
    cuisineBtn.innerHTML += `${cuisineNames[index]}`;
    cuisinesContainer.append(cuisineBtn);
    cuisineBtn.addEventListener("click", () => {
      searchByArea(cuisineNames[index]);
      setActiveBtn(cuisineBtn);
    });
  }
}

document.getElementById("allCuisineBtn").addEventListener("click", (e) => {
  displayRecipes();
  document.getElementById("recipes-count").innerHTML = `Showing 25 recipes`;
  setActiveBtn(e.target);
});

async function searchByArea(cuisineName) {
  const recipesCount = document.getElementById("recipes-count");
  const response = await fetch(
    `https://nutriplan-api.vercel.app/api/meals/filter?area=${encodeURIComponent(cuisineName)}&page=1&limit=25`,
  );
  if (!response.ok) {
    console.error("Filtering by area failed:", response.status);
    recipesCount.innerHTML = `Couldn't load ${cuisineName} recipes`;
    displayRecipes([]);
    return;
  }
  const data = await response.json();
  recipesCount.innerHTML = `Showing ${data.results.length} ${cuisineName} recipes`;
  displayRecipes(data.results);
}

function setActiveBtn(activeButton) {
  document.querySelectorAll(".cuisineBtn").forEach((button) => {
    button.classList.remove(
      "bg-emerald-600",
      "text-white",
      "hover:bg-emerald-700",
    );
    button.classList.add("bg-gray-100", "text-gray-700", "hover:bg-gray-200");
  });

  activeButton.classList.remove(
    "bg-gray-100",
    "text-gray-700",
    "hover:bg-gray-200",
  );
  activeButton.classList.add(
    "bg-emerald-600",
    "text-white",
    "hover:bg-emerald-700",
  );
}

const categoryMeta = {
  Beef: {
    icon: "fa-drumstick-bite",
    gradient: "from-red-400 to-rose-500",
    bg: "from-red-50 to-rose-50",
    border: "border-red-200 hover:border-red-400",
  },
  Chicken: {
    icon: "fa-drumstick-bite",
    gradient: "from-orange-400 to-amber-500",
    bg: "from-orange-50 to-amber-50",
    border: "border-orange-200 hover:border-orange-400",
  },
  Dessert: {
    icon: "fa-cake-candles",
    gradient: "from-pink-500 to-rose-600",
    bg: "from-pink-50 to-rose-50",
    border: "border-pink-200 hover:border-pink-400",
  },
  Lamb: {
    icon: "fa-drumstick-bite",
    gradient: "from-orange-400 to-amber-500",
    bg: "from-orange-50 to-amber-50",
    border: "border-orange-200 hover:border-orange-400",
  },
  Miscellaneous: {
    icon: "fa-bowl-rice",
    gradient: "from-slate-400 to-gray-500",
    bg: "from-slate-50 to-gray-50",
    border: "border-slate-200 hover:border-slate-400",
  },
  Pasta: {
    icon: "fa-bowl-rice",
    gradient: "from-amber-400 to-yellow-500",
    bg: "from-amber-50 to-yellow-50",
    border: "border-amber-200 hover:border-amber-400",
  },
  Pork: {
    icon: "fa-bacon",
    gradient: "from-red-400 to-pink-500",
    bg: "from-red-50 to-pink-50",
    border: "border-red-200 hover:border-red-400",
  },
  Seafood: {
    icon: "fa-fish",
    gradient: "from-blue-500 to-sky-600",
    bg: "from-blue-50 to-sky-50",
    border: "border-blue-200 hover:border-blue-400",
  },
  Side: {
    icon: "fa-bowl-rice",
    gradient: "from-emerald-400 to-green-500",
    bg: "from-emerald-50 to-green-50",
    border: "border-emerald-200 hover:border-emerald-400",
  },
  Starter: {
    icon: "fa-utensils",
    gradient: "from-cyan-400 to-teal-500",
    bg: "from-cyan-50 to-teal-50",
    border: "border-cyan-200 hover:border-cyan-400",
  },
  Vegan: {
    icon: "fa-leaf",
    gradient: "from-green-400 to-emerald-500",
    bg: "from-green-50 to-emerald-50",
    border: "border-green-200 hover:border-green-400",
  },
  Vegetarian: {
    icon: "fa-seedling",
    gradient: "from-lime-400 to-green-500",
    bg: "from-lime-50 to-green-50",
    border: "border-lime-200 hover:border-lime-400",
  },
};

function renderCategoryCard(name) {
  const { icon, gradient, bg, border } = categoryMeta[name] || {
    icon: "fa-utensils",
    gradient: "from-gray-400 to-gray-500",
    bg: "from-gray-50 to-gray-50",
    border: "border-gray-200 hover:border-gray-400",
  };

  return ` <div
              class="category-card bg-gradient-to-br ${bg} rounded-xl p-3 border ${border} hover:shadow-md cursor-pointer transition-all group"
              data-category="${name}"
            >
              <div class="flex items-center gap-2.5">
                <div
                  class="text-white w-9 h-9 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm"
                >
                  <i class="fa-solid ${icon}"></i>
                </div>
                <div>
                  <h3 class="text-sm font-bold text-gray-900">${name}</h3>
                </div>
              </div>
            </div>
            `;
}

export async function displayCategories() {
  const categoryNames = await fetchMealCategories();
  const grid = document.getElementById("categories-grid");
  grid.innerHTML = categoryNames.map(renderCategoryCard).join("");
  document.querySelectorAll(".category-card").forEach((el) => {
    el.addEventListener("click", () => {
      searchByCategory(el.getAttribute("data-category"));
    });
  });
}

async function searchByCategory(categoryName) {
  const recipesCount = document.getElementById("recipes-count");
  const response = await fetch(
    `https://nutriplan-api.vercel.app/api/meals/filter?category=${encodeURIComponent(categoryName)}&page=1&limit=25`,
  );
  if (!response.ok) {
    console.error("Filtering by category failed:", response.status);
    recipesCount.innerHTML = `Couldn't load ${categoryName} recipes`;
    displayRecipes([]);
    return;
  }
  const data = await response.json();
  recipesCount.innerHTML = `Showing ${data.results.length} ${categoryName} recipes`;
  displayRecipes(data.results);
}
