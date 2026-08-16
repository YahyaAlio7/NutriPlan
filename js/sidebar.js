import { renderFoodLog } from "./displayFoodlog.js";

export const mealSection = document.getElementById("all-recipes-section");
export const productsSection = document.getElementById("products-section");
export const foodLogSection = document.getElementById("foodlog-section");
export const categorySection = document.getElementById(
  "meal-categories-section",
);
export const searchSection = document.getElementById("search-filters-section");
const mealDetailsSection = document.getElementById("meal-details");

export const mealbtn = document.getElementById("meals-link");
const productbtn = document.getElementById("products-link");
const foodlogbtn = document.getElementById("foodlog-link");

const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebar-overlay");
const menuBtn = document.getElementById("header-menu-btn");
const sidebarCloseBtn = document.getElementById("sidebar-close-btn");

document.querySelectorAll("section").forEach((element) => {
  element.classList.add("hidden");
});

export function setStartSection() {
  productsSection.classList.add("hidden");
  foodLogSection.classList.add("hidden");
  mealDetailsSection.classList.add("hidden");
  categorySection.classList.remove("hidden");
  searchSection.classList.remove("hidden");
  mealSection.classList.remove("hidden");
  document.querySelector("#header h1").innerHTML = "Meals & Recipes";
  document.querySelector("#header p").innerHTML =
    "Discover delicious and nutritious recipes tailored for you";
}

export function setActiveButton(activeButton) {
  document.querySelectorAll(".nav-link").forEach((button) => {
    button.classList.remove("bg-emerald-50", "text-emerald-700");
    button.classList.add("text-gray-600", "hover:bg-gray-50");
  });

  activeButton.classList.remove("text-gray-600", "hover:bg-gray-50");
  activeButton.classList.add("bg-emerald-50", "text-emerald-700");
}

mealbtn.addEventListener("click", () => {
  productsSection.classList.add("hidden");
  foodLogSection.classList.add("hidden");
  mealDetailsSection.classList.add("hidden");
  categorySection.classList.remove("hidden");
  searchSection.classList.remove("hidden");
  mealSection.classList.remove("hidden");
  setActiveButton(mealbtn);
  document.querySelector("#header h1").innerHTML = "Meals & Recipes";
  document.querySelector("#header p").innerHTML =
    "Discover delicious and nutritious recipes tailored for you";
  closeSidebarOnMobile();
});

productbtn.addEventListener("click", () => {
  productsSection.classList.remove("hidden");
  foodLogSection.classList.add("hidden");
  categorySection.classList.add("hidden");
  searchSection.classList.add("hidden");
  mealSection.classList.add("hidden");
  mealDetailsSection.classList.add("hidden");
  setActiveButton(productbtn);
  document.querySelector("#header h1").innerHTML = "Product Scanner";
  document.querySelector("#header p").innerHTML =
    "Search packaged foods by name or barcode";
  closeSidebarOnMobile();
});

foodlogbtn.addEventListener("click", () => {
  productsSection.classList.add("hidden");
  foodLogSection.classList.remove("hidden");
  categorySection.classList.add("hidden");
  searchSection.classList.add("hidden");
  mealSection.classList.add("hidden");
  mealDetailsSection.classList.add("hidden");
  setActiveButton(foodlogbtn);
  document.querySelector("#header h1").innerHTML = "Food Log";
  document.querySelector("#header p").innerHTML =
    "Track your daily nutrition and food intake";
  renderFoodLog();
  closeSidebarOnMobile();
});

function openSidebar() {
  sidebar.classList.add("open");
  sidebarOverlay.classList.add("active");
}

function closeSidebar() {
  sidebar.classList.remove("open");
  sidebarOverlay.classList.remove("active");
}

function closeSidebarOnMobile() {
  if (window.innerWidth <= 1024) {
    closeSidebar();
  }
}

menuBtn?.addEventListener("click", openSidebar);
sidebarCloseBtn?.addEventListener("click", closeSidebar);
sidebarOverlay?.addEventListener("click", closeSidebar);
