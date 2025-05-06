"use server";

export async function fetchAds() {
  try {
    const response = await fetch("https://fakestoreapi.com/ads"); // Example API
    if (!response.ok) throw new Error("Failed to fetch products");

    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}
