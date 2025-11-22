const filter_by_cuisine = (data, cuisine) => {
  if (cuisine === "Alle") return data;
  return data.filter(restaurant => restaurant.cuisine === cuisine);
};

const search_by_name = (data, term) => {
  if (!term?.trim()) return data;
  const search_term = term.toLowerCase();
  return data.filter(restaurant => 
    restaurant.name.toLowerCase().includes(search_term)
  );
};

const sort_by_rating = (data, direction = "desc") => {
  const sorted_data = [...data];
  return sorted_data.sort((a, b) => {
    return direction === "desc" 
      ? b.rating - a.rating 
      : a.rating - b.rating;
  });
};

const process_data = (data, filters = {}) => {
  const cuisine_filter = filters.cuisine || "Alle";
  const search_term = filters.search || "";
  const sort_direction = filters.sort_dir || "desc";
  
  let result = filter_by_cuisine(data, cuisine_filter);
  result = search_by_name(result, search_term);
  result = sort_by_rating(result, sort_direction);
  
  return result;
};

export {
  filter_by_cuisine,
  search_by_name,
  sort_by_rating,
  process_data
}