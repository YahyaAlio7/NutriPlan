import { mealSection, categorySection, searchSection } from "./sidebar.js";
import { analyzeMeal } from "./analyzeMeal.js";
import { fetchMealById } from "./api/mealdb.js";
import { addMeal } from "./foodlog.js";

document.getElementById("log-meal-modal").addEventListener("click", (e) => {
  if (e.target.id === "log-meal-modal") {
    e.target.classList.add("hidden");
  }
});

export async function fireRecipeInstruction(mealId) {
  const data = await fetchMealById(mealId);
  if (!data) {
    document.getElementById("meal-details").innerHTML = `
      <div class="flex flex-col items-center justify-center py-24 text-center">
        <i class="fa-solid fa-triangle-exclamation text-4xl text-red-400 mb-4"></i>
        <p class="text-gray-600 font-medium">Couldn't load this recipe. Please try again.</p>
        <button id="back-to-meals-btn" class="mt-4 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all">
          Back to Recipes
        </button>
      </div>`;
    document
      .getElementById("back-to-meals-btn")
      .addEventListener("click", () => {
        document.getElementById("meal-details").classList.add("hidden");
        mealSection.classList.remove("hidden");
        categorySection.classList.remove("hidden");
        searchSection.classList.remove("hidden");
      });
    return;
  }

  const mealAnalysis = await analyzeMeal(data);
  if (!mealAnalysis || !mealAnalysis.data) {
    document.getElementById("meal-details").innerHTML = `
      <div class="flex flex-col items-center justify-center py-24 text-center">
        <i class="fa-solid fa-triangle-exclamation text-4xl text-red-400 mb-4"></i>
        <p class="text-gray-600 font-medium">Couldn't analyze the nutrition for this recipe. Please try again.</p>
        <button id="back-to-meals-btn" class="mt-4 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all">
          Back to Recipes
        </button>
      </div>`;
    document
      .getElementById("back-to-meals-btn")
      .addEventListener("click", () => {
        document.getElementById("meal-details").classList.add("hidden");
        mealSection.classList.remove("hidden");
        categorySection.classList.remove("hidden");
        searchSection.classList.remove("hidden");
      });
    return;
  }
  const analysisData = mealAnalysis.data;
  const carbsPerServing = analysisData.perServing.carbs;
  const proteinPerServing = analysisData.perServing.protein;
  const fiberPerServing = analysisData.perServing.fiber;
  const sugarPerServing = analysisData.perServing.sugar;
  const fatPerServing = analysisData.perServing.fat;
  const dailyValues = {
    protein: 50,
    carbs: 275,
    fat: 78,
    fiber: 28,
    sugar: 50,
    saturatedFat: 20,
  };

  function toDV(nutrientKey, amountGrams) {
    return Math.min(100, (amountGrams / dailyValues[nutrientKey]) * 100);
  }

  document.getElementById("meal-details").innerHTML = `
        <div class="max-w-7xl mx-auto">
          <!-- Back Button -->
          <button
            id="back-to-meals-btn"
            class="flex items-center gap-2 text-gray-600 hover:text-emerald-600 font-medium mb-6 transition-colors"
          >
            <i class="fa-solid fa-arrow-left"></i>
            <span>Back to Recipes</span>
          </button>

          <!-- Hero Section -->
          <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div class="relative h-80 md:h-96">
              <img
                src="${data.thumbnail}"
                alt="${data.name}"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div class="absolute bottom-0 left-0 right-0 p-8">
                <div class="flex items-center gap-3 mb-3">
                  <span class="px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full">${data.category}</span>
                  <span class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">${data.area}</span>
                  ${(data.tags || []).map((tag) => `<span class="px-3 py-1 bg-purple-500 text-white text-sm font-semibold rounded-full">${tag}</span>`).join("")}
                </div>
                <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">${data.name}</h1>
                <div class="flex items-center gap-6 text-white/90">
                  <span class="flex items-center gap-2">
                    <i class="fa-solid fa-clock"></i>
                    <span>30 min</span>
                  </span>
                  <span class="flex items-center gap-2">
                    <i class="fa-solid fa-utensils"></i>
                    <span id="hero-servings">${analysisData.servings} servings</span>
                  </span>
                  <span class="flex items-center gap-2">
                    <i class="fa-solid fa-fire"></i>
                    <span id="hero-calories">${analysisData.perServing.calories} cal/serving</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-3 mb-8">
            <button
              id="log-meal-btn"
              class="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
              data-meal-id="${data.id}"
            >
              <i class="fa-solid fa-clipboard-list"></i>
              <span>Log This Meal</span>
            </button>
          </div>

          <!-- Main Content Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Left Column - Ingredients & Instructions -->
            <div class="lg:col-span-2 space-y-8">
              <!-- Ingredients -->
              <div class="bg-white rounded-2xl shadow-lg p-6">
                <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <i class="fa-solid fa-list-check text-emerald-600"></i>
                  Ingredients
                  <span class="text-sm font-normal text-gray-500 ml-auto">${data.ingredients.length} items</span>
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  ${data.ingredients
                    .map(
                      (item) => `
                    <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors">
                      <input type="checkbox" class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300" />
                      <span class="text-gray-700">
                        <span class="font-medium text-gray-900">${item.measure}</span> ${item.ingredient}
                      </span>
                    </div>
                  `,
                    )
                    .join("")}
                </div>
              </div>

              <!-- Instructions -->
              <div class="bg-white rounded-2xl shadow-lg p-6">
                <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <i class="fa-solid fa-shoe-prints text-emerald-600"></i>
                  Instructions
                </h2>
                <div class="space-y-4">
                  ${data.instructions
                    .map(
                      (step, i) => `
                    <div class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                      <div class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                        ${i + 1}
                      </div>
                      <p class="text-gray-700 leading-relaxed pt-2">${step}</p>
                    </div>
                  `,
                    )
                    .join("")}
                </div>
              </div>

              <!-- Video Section -->
              ${
                data.youtube && getYoutubeEmbedUrl(data.youtube)
                  ? `
              <div class="bg-white rounded-2xl shadow-lg p-6">
                <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <i class="fa-solid fa-video text-red-500"></i>
                  Video Tutorial
                </h2>
                <div class="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                  <iframe
                    src="${getYoutubeEmbedUrl(data.youtube)}"
                    class="absolute inset-0 w-full h-full"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                </div>
              </div>`
                  : ""
              }
            </div>

            <!-- Right Column - Nutrition -->
            <div class="space-y-6">
              <!-- Nutrition Facts -->
              <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <i class="fa-solid fa-chart-pie text-emerald-600"></i>
                  Nutrition Facts
                </h2>
                <div id="nutrition-facts-container">
                  <p class="text-sm text-gray-500 mb-4">Per serving</p>

                  <div class="text-center py-4 mb-4 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl">
                    <p class="text-sm text-gray-600">Calories per serving</p>
                    <p class="text-4xl font-bold text-emerald-600">${analysisData.perServing.calories}</p>
                    <p class="text-xs text-gray-500 mt-1">Total: ${analysisData.totals.calories} cal</p>
                  </div>

                  <div class="space-y-4">
                   
                    <div>
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                          <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                          <span class="text-gray-700">Protein</span>
                        </div>
                        <span class="font-bold text-gray-900">${analysisData.perServing.protein}g</span>
                      </div>
                      <div class="w-full bg-gray-100 rounded-full h-2 mt-1">
                        <div class="bg-emerald-500 h-2 rounded-full" style="width: ${toDV("protein", proteinPerServing)}%"></div>
                      </div>
                    </div>

                    
                    <div>
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                          <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span class="text-gray-700">Carbs</span>
                        </div>
                        <span class="font-bold text-gray-900">${analysisData.perServing.carbs}g</span>
                      </div>
                      <div class="w-full bg-gray-100 rounded-full h-2 mt-1">
                        <div class="bg-blue-500 h-2 rounded-full" style="width: ${toDV("carbs", carbsPerServing)}%"></div>
                      </div>
                    </div>

                   
                    <div>
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                          <div class="w-3 h-3 rounded-full bg-purple-500"></div>
                          <span class="text-gray-700">Fat</span>
                        </div>
                        <span class="font-bold text-gray-900">${analysisData.perServing.fat}g</span>
                      </div>
                      <div class="w-full bg-gray-100 rounded-full h-2 mt-1">
                        <div class="bg-purple-500 h-2 rounded-full" style="width: ${toDV("fat", analysisData.perServing.fat)}%"></div>
                      </div>
                    </div>

                    
                    <div>
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                          <div class="w-3 h-3 rounded-full bg-orange-500"></div>
                          <span class="text-gray-700">Fiber</span>
                        </div>
                        <span class="font-bold text-gray-900">${analysisData.perServing.fiber}g</span>
                      </div>
                      <div class="w-full bg-gray-100 rounded-full h-2 mt-1">
                        <div class="bg-orange-500 h-2 rounded-full" style="width: ${toDV("fiber", analysisData.perServing.fiber)}%"></div>
                      </div>
                    </div>

                    
                    <div>
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                          <div class="w-3 h-3 rounded-full bg-pink-500"></div>
                          <span class="text-gray-700">Sugar</span>
                        </div>
                        <span class="font-bold text-gray-900">${analysisData.perServing.sugar}g</span>
                      </div>
                      <div class="w-full bg-gray-100 rounded-full h-2 mt-1">
                        <div class="bg-pink-500 h-2 rounded-full" style="width: ${toDV("sugar", analysisData.perServing.sugar)}%"></div>
                      </div>
                    </div>

                    <div>
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                          <div class="w-3 h-3 rounded-full bg-red-500"></div>
                          <span class="text-gray-700">Saturated Fat</span>
                        </div>
                        <span class="font-bold text-gray-900">${analysisData.perServing.saturatedFat}g</span>
                      </div>
                      <div class="w-full bg-gray-100 rounded-full h-2 mt-1">
                        <div class="bg-red-500 h-2 rounded-full" style="width: ${toDV("saturatedFat", analysisData.perServing.saturatedFat)}%"></div>
                      </div>
                    </div>
                  </div> 

                 
                  <div class="mt-6 pt-6 border-t border-gray-100">
                    <h3 class="text-sm font-semibold text-gray-900 mb-3">Others</h3>
                    <div class="grid grid-cols-2 gap-3 text-sm">
                      <div class="flex justify-between">
                        <span class="text-gray-600">Cholesterol</span>
                        <span class="font-medium">${analysisData.perServing.cholesterol}mg</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Sodium</span>
                        <span class="font-medium">${analysisData.perServing.sodium}mg</span>
                      </div>
                    </div>
                  </div>
                </div> 
              </div> 
            </div> 
          </div> 
        </div> 
    `;

  document.getElementById("back-to-meals-btn").addEventListener("click", () => {
    document.getElementById("meal-details").classList.add("hidden");
    mealSection.classList.remove("hidden");
    categorySection.classList.remove("hidden");
    searchSection.classList.remove("hidden");
  });

  document.getElementById("log-meal-btn").addEventListener("click", () => {
    const modal = document.getElementById("log-meal-modal");
    modal.innerHTML = `
   <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
                <div class="flex items-center gap-4 mb-6">
                    <img src="${data.thumbnail}" alt="${data.name}" class="w-16 h-16 rounded-xl object-cover">
                    <div>
                        <h3 class="text-xl font-bold text-gray-900">Log This Meal</h3>
                        <p class="text-gray-500 text-sm">${data.name}</p>
                    </div>
                </div>
                
                <div class="mb-6">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Number of Servings</label>
                    <div class="flex items-center gap-3">
                        <button id="decrease-servings" class="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center" fdprocessedid="obfctb">
                            <i class="text-gray-600" data-fa-i2svg=""><svg class="svg-inline--fa fa-minus" data-prefix="fas" data-icon="minus" role="img" viewBox="0 0 448 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32z"></path></svg></i>
                        </button>
                        <input type="number" id="meal-servings" value="1" min="0.5" max="10" step="0.5" class="w-20 text-center text-xl font-bold border-2 border-gray-200 rounded-lg py-2" fdprocessedid="mmg48n">
                        <button id="increase-servings" class="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center" fdprocessedid="g3s38">
                            <i class="text-gray-600" data-fa-i2svg=""><svg class="svg-inline--fa fa-plus" data-prefix="fas" data-icon="plus" role="img" viewBox="0 0 448 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z"></path></svg></i>
                        </button>
                    </div>
                </div>
                
                
                <div class="bg-emerald-50 rounded-xl p-4 mb-6">
                    <p class="text-sm text-gray-600 mb-2">Estimated nutrition per serving:</p>
                    <div class="grid grid-cols-4 gap-2 text-center">
                        <div>
                            <p class="text-lg font-bold text-emerald-600" id="modal-calories">${analysisData.perServing.calories}</p>
                            <p class="text-xs text-gray-500">Calories</p>
                        </div>
                        <div>
                            <p class="text-lg font-bold text-blue-600" id="modal-protein">${proteinPerServing}g</p>
                            <p class="text-xs text-gray-500">Protein</p>
                        </div>
                        <div>
                            <p class="text-lg font-bold text-amber-600" id="modal-carbs">${carbsPerServing}g</p>
                            <p class="text-xs text-gray-500">Carbs</p>
                        </div>
                        <div>
                            <p class="text-lg font-bold text-purple-600" id="modal-fat">${fatPerServing}g</p>
                            <p class="text-xs text-gray-500">Fat</p>
                        </div>
                    </div>
                </div>
                
                
                <div class="flex gap-3">
                    <button id="cancel-log-meal" class="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all" fdprocessedid="h8qnio">
                        Cancel
                    </button>
                    <button id="confirm-log-meal" class="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all" fdprocessedid="rwb03">
                        <i class="mr-2" data-fa-i2svg=""><svg class="svg-inline--fa fa-clipboard-list" data-prefix="fas" data-icon="clipboard-list" role="img" viewBox="0 0 384 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M311.4 32l8.6 0c35.3 0 64 28.7 64 64l0 352c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l8.6 0C83.6 12.9 104.3 0 128 0L256 0c23.7 0 44.4 12.9 55.4 32zM248 112c13.3 0 24-10.7 24-24s-10.7-24-24-24L136 64c-13.3 0-24 10.7-24 24s10.7 24 24 24l112 0zM128 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm32 0c0 13.3 10.7 24 24 24l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-112 0c-13.3 0-24 10.7-24 24zm0 128c0 13.3 10.7 24 24 24l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-112 0c-13.3 0-24 10.7-24 24zM96 416a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"></path></svg></i>
                        Log Meal
                    </button>
                </div>
            </div>
  `;
    modal.classList.remove("hidden");

    // modal action btns
    document.getElementById("cancel-log-meal").addEventListener("click", () => {
      modal.classList.add("hidden");
    });

    //  increase and decrease btns

    const servingsInput = document.getElementById("meal-servings");

    // decrease servings btn
    document
      .getElementById("decrease-servings")
      .addEventListener("click", () => {
        let currentValue = parseFloat(servingsInput.value);
        if (currentValue > 0.5) {
          currentValue -= 0.5;
          servingsInput.value = currentValue.toFixed(1);
        }
      });

    // increase servings btn
    document
      .getElementById("increase-servings")
      .addEventListener("click", () => {
        let currentValue = parseFloat(servingsInput.value);
        currentValue += 0.5;
        servingsInput.value = currentValue.toFixed(1);
      });

    // log meal button
    document
      .getElementById("confirm-log-meal")
      .addEventListener("click", () => {
        const servings = parseFloat(servingsInput.value);
        swal.fire({
          icon: "success",
          title: "Meal Logged!",
          text: `You have logged ${servings} servings of ${data.name}.
        
      +${(analysisData.perServing.calories * servings).toFixed(0)} calories
      `,
          timer: 2000,
          showConfirmButton: false,
        });
        const meal = {
          name: data.name,
          img: data.thumbnail,
          servings,
          calories: analysisData.perServing.calories * servings,
          protein: proteinPerServing * servings,
          carbs: carbsPerServing * servings,
          fat: fatPerServing * servings,
        };
        addMeal(meal);
        modal.classList.add("hidden");
      });
  });
}

function getYoutubeEmbedUrl(youtubeUrl) {
  try {
    const url = new URL(youtubeUrl);
    const videoId = url.searchParams.get("v");
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
}
