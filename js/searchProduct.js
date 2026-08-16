import {
  fetchProducts,
  fetchProductsByCategory,
  fetchProductByBarcode,
} from "./api/productsdb.js";
import { displayProducts } from "./displayProducts.js";
import { addProduct } from "./foodlog.js";

const gradeColors = {
  a: "#1fa462",
  b: "#85bb2f",
  c: "#f9c035",
  d: "#ee8100",
  e: "#e63e11",
};
const novaColors = { 1: "#1fa462", 2: "#85bb2f", 3: "#f9c035", 4: "#e63e11" };
const dailyValues = {
  protein: 50,
  carbs: 275,
  fat: 78,
  fiber: 28,
  sugar: 50,
  saturatedFat: 20,
};

let availableProducts = [];

document
  .getElementById("product-detail-modal")
  .addEventListener("click", (e) => {
    if (e.target.id === "product-detail-modal") {
      e.target.classList.add("hidden");
    }
  });

function toDV(nutrientKey, amountGrams) {
  if (!amountGrams || !dailyValues[nutrientKey]) return 0;
  return Math.min(100, (amountGrams / dailyValues[nutrientKey]) * 100);
}

function productDetailModalHTML(product) {
  const gradeKey = product.nutritionGrade?.toLowerCase();
  const gradeColor = gradeColors[gradeKey] || "#9ca3af";
  const gradeLabel = product.nutritionGrade || "N/A";
  const gradeDescription =
    { a: "Excellent", b: "Good", c: "Average", d: "Poor", e: "Bad" }[
      gradeKey
    ] || "Unknown";

  const novaColor = novaColors[product.novaGroup] || "#9ca3af";
  const novaLabel = product.novaGroup ?? "N/A";
  const novaDescription =
    {
      1: "Unprocessed",
      2: "Processed culinary",
      3: "Processed",
      4: "Ultra-processed",
    }[product.novaGroup] || "Unknown";

  const nutrients = product.nutrients || {};
  const calories = nutrients.calories ?? 0;
  const protein = nutrients.protein ?? 0;
  const carbs = nutrients.carbs ?? 0;
  const fat = nutrients.fat ?? 0;
  const sugar = nutrients.sugar ?? 0;
  const saturatedFat = nutrients.saturatedFat ?? 0;
  const fiber = nutrients.fiber ?? 0;
  const salt = nutrients.salt ?? 0;

  const ingredientsText =
    product.ingredientsText ||
    product.ingredients ||
    "Ingredients not available for this product.";
  const allergens = Array.isArray(product.allergens)
    ? product.allergens.join(", ")
    : product.allergens || "";

  return `
    <div class="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
            <!-- Header -->
            <div class="flex items-start gap-6 mb-6">
                <div class="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-full object-contain">
                </div>
                <div class="flex-1">
                    <p class="text-sm text-emerald-600 font-semibold mb-1">${product.brand || ""}</p>
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">${product.name}</h2>
                    ${product.servingSize ? `<p class="text-sm text-gray-500 mb-3">${product.servingSize}</p>` : ""}

                    <div class="flex items-center gap-3">
                        <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg" style="background-color: ${gradeColor}20">
                            <span class="w-8 h-8 rounded flex items-center justify-center text-white font-bold" style="background-color: ${gradeColor}">
                                ${gradeLabel.toUpperCase()}
                            </span>
                            <div>
                                <p class="text-xs font-bold" style="color: ${gradeColor}">Nutri-Score</p>
                                <p class="text-[10px] text-gray-600">${gradeDescription}</p>
                            </div>
                        </div>

                        <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg" style="background-color: ${novaColor}20">
                            <span class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style="background-color: ${novaColor}">
                                ${novaLabel}
                            </span>
                            <div>
                                <p class="text-xs font-bold" style="color: ${novaColor}">NOVA</p>
                                <p class="text-[10px] text-gray-600">${novaDescription}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <button class="close-product-modal text-gray-400 hover:text-gray-600">
                    <i class="fa-solid fa-xmark text-2xl"></i>
                </button>
            </div>

            <!-- Nutrition Facts -->
            <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 mb-6 border border-emerald-200">
                <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <i class="fa-solid fa-chart-pie text-emerald-600"></i>
                    Nutrition Facts <span class="text-sm font-normal text-gray-500">(per 100g)</span>
                </h3>

                <div class="text-center mb-4 pb-4 border-b border-emerald-200">
                    <p class="text-4xl font-bold text-gray-900">${calories.toFixed(0)}</p>
                    <p class="text-sm text-gray-500">Calories</p>
                </div>

                <div class="grid grid-cols-4 gap-4">
                    <div class="text-center">
                        <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div class="bg-emerald-500 h-2 rounded-full" style="width: ${toDV("protein", protein)}%"></div>
                        </div>
                        <p class="text-lg font-bold text-emerald-600">${protein.toFixed(1)}g</p>
                        <p class="text-xs text-gray-500">Protein</p>
                    </div>
                    <div class="text-center">
                        <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div class="bg-blue-500 h-2 rounded-full" style="width: ${toDV("carbs", carbs)}%"></div>
                        </div>
                        <p class="text-lg font-bold text-blue-600">${carbs.toFixed(1)}g</p>
                        <p class="text-xs text-gray-500">Carbs</p>
                    </div>
                    <div class="text-center">
                        <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div class="bg-purple-500 h-2 rounded-full" style="width: ${toDV("fat", fat)}%"></div>
                        </div>
                        <p class="text-lg font-bold text-purple-600">${fat.toFixed(1)}g</p>
                        <p class="text-xs text-gray-500">Fat</p>
                    </div>
                    <div class="text-center">
                        <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div class="bg-orange-500 h-2 rounded-full" style="width: ${toDV("sugar", sugar)}%"></div>
                        </div>
                        <p class="text-lg font-bold text-orange-600">${sugar.toFixed(1)}g</p>
                        <p class="text-xs text-gray-500">Sugar</p>
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-emerald-200">
                    <div class="text-center">
                        <p class="text-sm font-semibold text-gray-900">${saturatedFat.toFixed(1)}g</p>
                        <p class="text-xs text-gray-500">Saturated Fat</p>
                    </div>
                    <div class="text-center">
                        <p class="text-sm font-semibold text-gray-900">${fiber.toFixed(1)}g</p>
                        <p class="text-xs text-gray-500">Fiber</p>
                    </div>
                    <div class="text-center">
                        <p class="text-sm font-semibold text-gray-900">${salt.toFixed(2)}g</p>
                        <p class="text-xs text-gray-500">Salt</p>
                    </div>
                </div>
            </div>

            <!-- Ingredients -->
            <div class="bg-gray-50 rounded-xl p-5 mb-6">
                <h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <i class="fa-solid fa-list text-gray-600"></i>
                    Ingredients
                </h3>
                <p class="text-sm text-gray-600 leading-relaxed">${ingredientsText}</p>
            </div>

            ${
              allergens
                ? `
            <div class="bg-red-50 rounded-xl p-5 mb-6 border border-red-200">
                <h3 class="font-bold text-red-700 mb-2 flex items-center gap-2">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    Allergens
                </h3>
                <p class="text-sm text-red-600">${allergens}</p>
            </div>`
                : ""
            }

            <!-- Quantity -->
            <div class="mb-4">
                <label class="block text-sm font-semibold text-gray-700 mb-2">Quantity (g)</label>
                <input type="number" id="product-quantity-input" value="${product.servingSizeGrams || 100}" min="1" step="1" class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-emerald-500 outline-none" />
            </div>

            <!-- Actions -->
            <div class="flex gap-3">
                <button class="add-product-to-log flex-1 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all" data-barcode="${product.barcode}">
                    <i class="fa-solid fa-plus mr-2"></i>Log This Food
                </button>
                <button class="close-product-modal flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
                    Close
                </button>
            </div>
        </div>
    </div>`;
}

function openProductModal(product) {
  const modal = document.getElementById("product-detail-modal");
  modal.innerHTML = productDetailModalHTML(product);
  modal.classList.remove("hidden");

  modal.querySelectorAll(".close-product-modal").forEach((btn) => {
    btn.addEventListener("click", () => modal.classList.add("hidden"));
  });

  modal.querySelector(".add-product-to-log").addEventListener("click", () => {
    const quantityInput = document.getElementById("product-quantity-input");
    const quantity = parseFloat(quantityInput.value) || 100;
    const ratio = quantity / 100;
    const nutrients = product.nutrients || {};

    addProduct({
      name: product.name,
      img: product.image,
      quantity,
      calories: (nutrients.calories ?? 0) * ratio,
      protein: (nutrients.protein ?? 0) * ratio,
      carbs: (nutrients.carbs ?? 0) * ratio,
      fat: (nutrients.fat ?? 0) * ratio,
    });

    swal.fire({
      icon: "success",
      title: "Product Logged!",
      text: `Added ${quantity}g of ${product.name} to your food log.`,
      timer: 2000,
      showConfirmButton: false,
    });

    modal.classList.add("hidden");
  });
}

// search bar
document
  .getElementById("search-product-btn")
  .addEventListener("click", async () => {
    const searchInput = document.getElementById("product-search-input");
    const searchTerm = searchInput.value.trim();
    const productsCount = document.getElementById("products-count");

    if (!searchTerm) {
      displayProducts([]);
      availableProducts = [];
      productsCount.textContent = "Search for products to see results";
      return;
    }

    availableProducts = await fetchProducts(searchTerm);
    productsCount.textContent = availableProducts.length
      ? `Showing ${availableProducts.length} products for "${searchTerm}"`
      : `No products found for "${searchTerm}"`;
    displayProducts(availableProducts);
  });

document
  .getElementById("product-search-input")
  .addEventListener("keydown", (e) => {
    if (e.key === "Enter")
      document.getElementById("search-product-btn").click();
  });

// filter by nutriscore

document
  .getElementById("nutri-score-filters")
  .addEventListener("click", (e) => {
    const filterBtn = e.target.closest(".nutri-score-filter");
    if (!filterBtn) return;

    document
      .querySelectorAll(".nutri-score-filter")
      .forEach((btn) => btn.classList.remove("ring-2", "ring-gray-900"));
    filterBtn.classList.add("ring-2", "ring-gray-900");

    const grade = filterBtn.getAttribute("data-grade");
    const filtered =
      grade === ""
        ? availableProducts
        : availableProducts.filter(
            (p) => p.nutritionGrade?.toLowerCase() === grade,
          );

    displayProducts(filtered);
  });

// search by category

document
  .getElementById("product-categories")
  .addEventListener("click", async (e) => {
    const filterBtn = e.target.closest(".product-category-btn");
    if (!filterBtn) return;

    const category = filterBtn.getAttribute("data-category-id");
    const categoryLabel = filterBtn.textContent.trim();
    const productsCount = document.getElementById("products-count");

    availableProducts = await fetchProductsByCategory(category);
    productsCount.textContent = availableProducts.length
      ? `Showing ${availableProducts.length} products in ${categoryLabel}`
      : `No products found in ${categoryLabel}`;
    displayProducts(availableProducts);
  });

// searchh by barcode

document
  .getElementById("lookup-barcode-btn")
  .addEventListener("click", async () => {
    const searchInput = document.getElementById("barcode-input");
    const productBarcode = searchInput.value.trim();

    if (!productBarcode) return;

    const product = await fetchProductByBarcode(productBarcode);
    if (!product || !product.name) {
      swal.fire({
        icon: "error",
        title: "Product Not Found",
        text: `No product found for barcode ${productBarcode}.`,
      });
      return;
    }
    openProductModal(product);
  });

document.getElementById("barcode-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") document.getElementById("lookup-barcode-btn").click();
});

document.getElementById("products-grid").addEventListener("click", (e) => {
  const card = e.target.closest(".product-card");
  if (!card) return;
  const barcode = card.getAttribute("data-barcode");
  const product = availableProducts.find(
    (p) => String(p.barcode) === String(barcode),
  );
  if (product) openProductModal(product);
});
