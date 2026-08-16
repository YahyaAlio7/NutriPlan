import { fetchAllCategories } from "./api/productsdb.js";

const categoryStyles = {
  snacks: {
    icon: "fa-cookie",
    bg: "bg-blue-100",
    text: "text-blue-600",
    hoverBg: "hover:bg-blue-200",
  },
  beverages: {
    icon: "fa-mug-hot",
    bg: "bg-blue-100",
    text: "text-blue-600",
    hoverBg: "hover:bg-blue-200",
  },
  dairies: {
    icon: "fa-glass-water",
    bg: "bg-yellow-100",
    text: "text-yellow-600",
    hoverBg: "hover:bg-yellow-200",
  },
  cheeses: {
    icon: "fa-cheese",
    bg: "bg-yellow-100",
    text: "text-yellow-600",
    hoverBg: "hover:bg-yellow-200",
  },
  yogurts: {
    icon: "fa-jar",
    bg: "bg-orange-100",
    text: "text-orange-800",
    hoverBg: "hover:bg-orange-200",
  },
  chocolates: {
    icon: "fa-cookie-bite",
    bg: "bg-orange-100",
    text: "text-orange-800",
    hoverBg: "hover:bg-orange-200",
  },
  biscuits: {
    icon: "fa-cookie",
    bg: "bg-lime-100",
    text: "text-lime-600",
    hoverBg: "hover:bg-lime-200",
  },
  "ice-creams": {
    icon: "fa-ice-cream",
    bg: "bg-lime-100",
    text: "text-lime-600",
    hoverBg: "hover:bg-lime-200",
  },
  "breakfast-cereals": {
    icon: "fa-wheat-awn",
    bg: "bg-lime-100",
    text: "text-lime-600",
    hoverBg: "hover:bg-lime-200",
  },
  breads: {
    icon: "fa-bread-slice",
    bg: "bg-orange-100",
    text: "text-orange-600",
    hoverBg: "hover:bg-orange-200",
  },
  waters: {
    icon: "fa-droplet",
    bg: "bg-red-100",
    text: "text-red-600",
    hoverBg: "hover:bg-red-200",
  },
  sodas: {
    icon: "fa-wine-bottle",
    bg: "bg-red-100",
    text: "text-red-600",
    hoverBg: "hover:bg-red-200",
  },
  coffees: {
    icon: "fa-mug-saucer",
    bg: "bg-red-100",
    text: "text-red-600",
    hoverBg: "hover:bg-red-200",
  },
  teas: {
    icon: "fa-mug-hot",
    bg: "bg-green-100",
    text: "text-green-600",
    hoverBg: "hover:bg-green-200",
  },
  fruits: {
    icon: "fa-apple-whole",
    bg: "bg-red-100",
    text: "text-red-600",
    hoverBg: "hover:bg-red-200",
  },
  vegetables: {
    icon: "fa-carrot",
    bg: "bg-orange-100",
    text: "text-orange-600",
    hoverBg: "hover:bg-orange-200",
  },
  meats: {
    icon: "fa-drumstick-bite",
    bg: "bg-red-100",
    text: "text-red-800",
    hoverBg: "hover:bg-red-200",
  },
  fishes: {
    icon: "fa-fish",
    bg: "bg-blue-100",
    text: "text-blue-800",
    hoverBg: "hover:bg-blue-200",
  },
  "plant-based-foods": {
    icon: "fa-seedling",
    bg: "bg-green-100",
    text: "text-green-800",
    hoverBg: "hover:bg-green-200",
  },
  "chips-and-fries": {
    icon: "fa-bacon",
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    hoverBg: "hover:bg-yellow-200",
  },
  sauces: {
    icon: "fa-bottle-droplet",
    bg: "bg-red-100",
    text: "text-red-600",
    hoverBg: "hover:bg-red-200",
  },
  spreads: {
    icon: "fa-jar",
    bg: "bg-red-100",
    text: "text-red-600",
    hoverBg: "hover:bg-red-200",
  },
  pastas: {
    icon: "fa-bowl-food",
    bg: "bg-yellow-100",
    text: "text-yellow-600",
    hoverBg: "hover:bg-yellow-200",
  },
  desserts: {
    icon: "fa-cake-candles",
    bg: "bg-lime-100",
    text: "text-lime-600",
    hoverBg: "hover:bg-lime-200",
  },
};

const defaultStyle = {
  icon: "fa-box",
  bg: "bg-lime-100",
  text: "text-lime-700",
  hoverBg: "hover:bg-lime-200",
};

export async function displayProductsCategories() {
  const categoriesRow = document.getElementById("product-categories");
  const categories = await fetchAllCategories();

  categoriesRow.innerHTML = categories
    .map((category) => {
      const { icon, bg, text, hoverBg } =
        categoryStyles[category.id] || defaultStyle;
      return `
            <button
              class="product-category-btn px-4 py-2 ${bg} ${text} rounded-lg text-sm font-medium whitespace-nowrap ${hoverBg} transition-all"
              data-category-id="${category.id}"
            >
              <i class="fa-solid ${icon} mr-1.5"></i> ${category.name}
            </button>
        `;
    })
    .join("");
}
