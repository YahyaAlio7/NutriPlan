import {
  getTodayItems,
  getTodayTotals,
  getWeekOverview,
  dailyGoals,
  removeLoggedItem,
  clearLoggedItems,
} from "./foodlog.js";

const typeIcon = { meal: "fa-utensils", product: "fa-barcode" };

function toPercent(value, goal) {
  return Math.min(100, Math.round((value / goal) * 100));
}

function renderHeaderDate() {
  const dateEl = document.getElementById("foodlog-date");
  dateEl.textContent = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function renderProgress(totals) {
  document.getElementById("calories-progress-text").textContent =
    `${Math.round(totals.calories)} / ${dailyGoals.calories} kcal`;
  document.getElementById("calories-progress-bar").style.width =
    `${toPercent(totals.calories, dailyGoals.calories)}%`;

  document.getElementById("protein-progress-text").textContent =
    `${Math.round(totals.protein)} / ${dailyGoals.protein} g`;
  document.getElementById("protein-progress-bar").style.width =
    `${toPercent(totals.protein, dailyGoals.protein)}%`;

  document.getElementById("carbs-progress-text").textContent =
    `${Math.round(totals.carbs)} / ${dailyGoals.carbs} g`;
  document.getElementById("carbs-progress-bar").style.width =
    `${toPercent(totals.carbs, dailyGoals.carbs)}%`;

  document.getElementById("fat-progress-text").textContent =
    `${Math.round(totals.fat)} / ${dailyGoals.fat} g`;
  document.getElementById("fat-progress-bar").style.width =
    `${toPercent(totals.fat, dailyGoals.fat)}%`;
}

function loggedItemCard(item) {
  return `
    <div class="logged-item flex items-center gap-4 p-3 bg-gray-50 rounded-xl" data-item-id="${item.id}">
        <img src="${item.img}" alt="${item.name}" class="w-12 h-12 rounded-lg object-cover" />
        <div class="flex-1">
            <p class="font-semibold text-gray-900 text-sm">${item.name}</p>
            <p class="text-xs text-gray-500">
                <i class="fa-solid ${typeIcon[item.type] || "fa-utensils"} mr-1"></i>
                ${item.type === "meal" ? `${item.servings} serving(s)` : `${item.quantity}g`} &bull; ${item.time}
            </p>
        </div>
        <div class="text-right">
            <p class="font-bold text-emerald-600">${item.calories} kcal</p>
            <p class="text-xs text-gray-500">P ${item.protein}g &bull; C ${item.carbs}g &bull; F ${item.fat}g</p>
        </div>
        <button class="remove-logged-item text-gray-400 hover:text-red-500" data-item-id="${item.id}" aria-label="Remove item">
            <i class="fa-solid fa-trash"></i>
        </button>
    </div>`;
}

function renderLoggedItems(items) {
  const list = document.getElementById("logged-items-list");
  document.getElementById("logged-items-count").textContent =
    `Logged Items (${items.length})`;
  document.getElementById("clear-foodlog").style.display = items.length
    ? ""
    : "none";

  if (items.length === 0) {
    list.innerHTML = `
            <div class="text-center py-8">
                <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fa-solid fa-utensils text-3xl text-gray-300"></i>
                </div>
                <p class="font-semibold text-gray-900">No food logged today</p>
                <p class="text-sm text-gray-500 mb-6">Start tracking your nutrition by logging meals or scanning products</p>
                <div class="flex items-center justify-center gap-3">
                    <button id="browse-recipes-btn" class="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all">
                        <i class="fa-solid fa-plus"></i>
                        Browse Recipes
                    </button>
                    <button id="scan-product-btn" class="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all">
                        <i class="fa-solid fa-barcode"></i>
                        Scan Product
                    </button>
                </div>
            </div>`;

    document
      .getElementById("browse-recipes-btn")
      .addEventListener("click", () => {
        document.getElementById("meals-link").click();
      });
    document
      .getElementById("scan-product-btn")
      .addEventListener("click", () => {
        document.getElementById("products-link").click();
      });
    return;
  }

  list.innerHTML = items.map(loggedItemCard).join("");

  list.querySelectorAll(".remove-logged-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      removeLoggedItem(btn.getAttribute("data-item-id"));
      renderFoodLog();
    });
  });
}

function renderWeeklyDaysGrid(weekOverview) {
  const grid = document.getElementById("weekly-days-grid");
  grid.innerHTML = weekOverview
    .map(
      (day) => `
        <div class="text-center p-2 rounded-lg ${day.isToday ? "bg-indigo-100" : ""}">
            <p class="text-xs font-semibold text-gray-500">${day.label}</p>
            <p class="text-sm font-bold text-gray-900">${day.dateNumber}</p>
            <p class="text-xs ${day.calories > 0 ? "text-gray-700" : "text-gray-400"} mt-1">${day.calories} kcal</p>
        </div>
    `,
    )
    .join("");
}

function renderWeeklyStats(weekOverview) {
  const daysLogged = weekOverview.filter((day) => day.calories > 0);
  const totalCalories = weekOverview.reduce(
    (sum, day) => sum + day.calories,
    0,
  );
  const weeklyAverage = daysLogged.length
    ? Math.round(totalCalories / daysLogged.length)
    : 0;
  const totalItemsThisWeek = getWeekLoggedItemsCount(weekOverview);
  const daysOnGoal = weekOverview.filter(
    (day) => day.calories > 0 && day.calories <= dailyGoals.calories,
  ).length;

  const grid = document.getElementById("weekly-stats-grid");
  grid.innerHTML = `
        <div class="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <i class="fa-solid fa-chart-line text-emerald-600"></i>
            </div>
            <div>
                <p class="text-xs text-gray-500">Weekly Average</p>
                <p class="font-bold text-gray-900">${weeklyAverage} kcal</p>
            </div>
        </div>
        <div class="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <i class="fa-solid fa-utensils text-blue-600"></i>
            </div>
            <div>
                <p class="text-xs text-gray-500">Total Items This Week</p>
                <p class="font-bold text-gray-900">${totalItemsThisWeek} items</p>
            </div>
        </div>
        <div class="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <i class="fa-solid fa-bullseye text-purple-600"></i>
            </div>
            <div>
                <p class="text-xs text-gray-500">Days On Goal</p>
                <p class="font-bold text-gray-900">${daysOnGoal} / 7</p>
            </div>
        </div>
    `;
}

function getWeekLoggedItemsCount(weekOverview) {
  const weekStart = weekOverview[0].date;
  const weekEnd = new Date(weekOverview[6].date);
  weekEnd.setHours(23, 59, 59, 999);
  return JSON.parse(localStorage.getItem("loggedItems") || "[]").filter(
    (item) => {
      const itemDate = new Date(item.date);
      return itemDate >= weekStart && itemDate <= weekEnd;
    },
  ).length;
}

function setupClearFoodlogButton() {
  document.getElementById("clear-foodlog")?.addEventListener("click", () => {
    swal
      .fire({
        title: "Clear Food Log?",
        text: "This will remove all logged items for today and previous days.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Clear All",
        confirmButtonColor: "#ef4444",
      })
      .then((result) => {
        if (result.isConfirmed) {
          clearLoggedItems();
          renderFoodLog();
        }
      });
  });
}

let clearButtonBound = false;

export function renderFoodLog() {
  renderHeaderDate();
  renderProgress(getTodayTotals());
  renderLoggedItems(getTodayItems());

  const weekOverview = getWeekOverview();
  renderWeeklyDaysGrid(weekOverview);
  renderWeeklyStats(weekOverview);

  if (!clearButtonBound) {
    setupClearFoodlogButton();
    clearButtonBound = true;
  }
}
