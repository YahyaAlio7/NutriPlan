export async function fetchProducts(productName) {
  const response = await fetch(
    `https://nutriplan-api.vercel.app/api/products/search?q=${encodeURIComponent(productName)}&page=1&limit=24`,
  );
  if (!response.ok) {
    console.error("Product search failed:", response.status);
    return [];
  }
  const productData = await response.json();
  return productData.results;
}

export async function fetchAllCategories() {
  const response = await fetch(
    `https://nutriplan-api.vercel.app/api/products/categories`,
  );
  if (!response.ok) {
    console.error("Fetching product categories failed:", response.status);
    return [];
  }
  const categories = await response.json();
  return categories.results;
}

export async function fetchProductsByCategory(category) {
  const response = await fetch(
    `https://nutriplan-api.vercel.app/api/products/category/${encodeURIComponent(category)}`,
  );
  if (!response.ok) {
    console.error("Fetching products by category failed:", response.status);
    return [];
  }
  const products = await response.json();
  return products.results;
}

export async function fetchProductByBarcode(barcode) {
  const response = await fetch(
    `https://nutriplan-api.vercel.app/api/products/barcode/${encodeURIComponent(barcode)}`,
  );
  if (!response.ok) {
    console.error("Fetching product by barcode failed:", response.status);
    return null;
  }
  const product = await response.json();
  return product.result;
}
