const gradeColors = {
  a: "bg-green-500",
  b: "bg-lime-500",
  c: "bg-yellow-500",
  d: "bg-orange-500",
  e: "bg-red-500",
};
const novaColors = {
  1: "bg-green-500",
  2: "bg-lime-500",
  3: "bg-yellow-500",
  4: "bg-red-500",
};

function productCards(element) {
  const gradeColor =
    gradeColors[element.nutritionGrade?.toLowerCase()] || "bg-gray-200";
  const novaColor = novaColors[element.novaGroup] || "bg-gray-200";
  const gradeLabel = element.nutritionGrade || "N/A";
  const novaLabel = element.novaGroup ?? "N/A";

  return `
    <div class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group" data-barcode="${element.barcode}">
        <div class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
          <img class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" src="${element.image}" alt="${element.name}" loading="lazy" />
          <div class="absolute top-2 left-2 ${gradeColor} text-white text-xs font-bold px-2 py-1 rounded uppercase">
            Nutri-Score ${gradeLabel}
          </div>
          <div class="absolute top-2 right-2 ${novaColor} text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center" title="NOVA ${novaLabel}">
            <span class="text-[10px]">${novaLabel}</span>
          </div>
        </div>
        <div class="p-4">
          <p class="text-xs text-emerald-600 font-semibold mb-1 truncate">${element.brand}</p>
          <h3 class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">${element.name}</h3>
          <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">
            <span><i class="fa-solid fa-weight-scale mr-1"></i>100g</span>
            <span><i class="fa-solid fa-fire mr-1"></i>${element.nutrients.calories.toFixed(2)} kcal/100g</span>
          </div>
          <div class="grid grid-cols-4 gap-1 text-center">
            <div class="bg-emerald-50 rounded p-1.5">
              <p class="text-xs font-bold text-emerald-700">${element.nutrients.protein.toFixed(2)}g</p>
              <p class="text-[10px] text-gray-500">Protein</p>
            </div>
            <div class="bg-blue-50 rounded p-1.5">
              <p class="text-xs font-bold text-blue-700">${element.nutrients.carbs.toFixed(2)}g</p>
              <p class="text-[10px] text-gray-500">Carbs</p>
            </div>
            <div class="bg-purple-50 rounded p-1.5">
              <p class="text-xs font-bold text-purple-700">${element.nutrients.fat.toFixed(2)}g</p>
              <p class="text-[10px] text-gray-500">Fat</p>
            </div>
            <div class="bg-orange-50 rounded p-1.5">
              <p class="text-xs font-bold text-orange-700">${element.nutrients.sugar.toFixed(2)}g</p>
              <p class="text-[10px] text-gray-500">Sugar</p>
            </div>
          </div>
        </div>
    </div>`;
}

export function displayProducts(products) {
  const grid = document.getElementById("products-grid");

  if (!products || products.length === 0) {
    grid.innerHTML = `
            <div id="products-empty" class="py-12 col-span-full">
                <div class="text-center">
                    <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fa-solid fa-box-open text-3xl text-gray-400"></i>
                    </div>
                    <p class="text-gray-500 text-lg mb-2">No products to display</p>
                    <p class="text-gray-400 text-sm">Search for a product or browse by category</p>
                </div>
            </div>
        `;
    return;
  }

  grid.innerHTML = products.map(productCards).join("");
}
