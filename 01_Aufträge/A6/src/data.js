// ---- Restaurant-Daten -----------------------------------------------
const restaurants = [
  { id: 1, name: "Trattoria Roma", cuisine: "Italienisch", price: "€€", rating: 4.7 },
  { id: 2, name: "Sakura", cuisine: "Asiatisch", price: "€€", rating: 4.5 },
  { id: 3, name: "Green Leaf", cuisine: "Vegan", price: "€", rating: 4.6 },
  { id: 4, name: "Burger Barn", cuisine: "Amerikanisch", price: "€", rating: 4.3 },
  { id: 5, name: "La Bodega", cuisine: "Mediterran", price: "€€", rating: 4.4 },
  { id: 6, name: "Saigon Kitchen", cuisine: "Vietnamesisch", price: "€", rating: 4.5 },
  { id: 7, name: "Maison Douce", cuisine: "Französisch", price: "€€€", rating: 4.8 },
  { id: 8, name: "Green Garden", cuisine: "Vegan", price: "€€", rating: 4.4 },
];

// ---- Daten laden (erweiterbar für externe Quellen) ------------------
const load_data = (source = null) => {
  // Optional: später erweitern für fetch() oder andere Datenquellen
  return source ?? restaurants;
};

// ---- Hilfsfunktion: Eindeutige Cuisines extrahieren -----------------
const get_unique_cuisines = (data) => {
  return [...new Set(data.map(({ cuisine }) => cuisine))].sort();
};

export {
    load_data,
    get_unique_cuisines
}