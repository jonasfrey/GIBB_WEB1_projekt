// ---- Reine Funktionen für Datenverarbeitung -------------------------

// Filter nach Cuisine-Kategorie
 const filter_by_cuisine = (data, cuisine) => {
  if (cuisine === "Alle") return data;
  return data.filter((restaurant) => restaurant.cuisine === cuisine);
};

// Suche nach Restaurant-Name (case-insensitive)
 const search_by_name = (data, term) => {
  if (!term?.trim()) return data;
  const lower_term = term.toLowerCase();
  return data.filter(({ name }) => 
    name.toLowerCase().includes(lower_term)
  );
};

// Sortierung nach Rating
 const sort_by_rating = (data, direction = "desc") => {
  return [...data].sort((a, b) => {
    return direction === "desc" 
      ? b.rating - a.rating 
      : a.rating - b.rating;
  });
};

// Kombinierte Filter-/Such-/Sortier-Funktion
 const process_data = (data, { cuisine = "Alle", search = "", sort_dir = "desc" } = {}) => {
  let result = filter_by_cuisine(data, cuisine);
  result = search_by_name(result, search);
  result = sort_by_rating(result, sort_dir);
  return result;
};

export {
    filter_by_cuisine,
    search_by_name,
    sort_by_rating,
    process_data
}