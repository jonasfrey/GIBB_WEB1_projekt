import { load_data, get_unique_cuisines } from "./data.js";
import { process_data } from "./logic.js";
import { render_filter_bar, render_cards, render_count, update_sort_button } from "./render.js";

let state = {
  data: [],
  cuisine: "Alle",
  search: "",
  sort_dir: "desc"
};

const debounce = (func, delay = 300) => {
  let timeout_id;
  return (...args) => {
    clearTimeout(timeout_id);
    timeout_id = setTimeout(() => func(...args), delay);
  };
};

const render = () => {
  const filtered_data = process_data(state.data, {
    cuisine: state.cuisine,
    search: state.search,
    sort_dir: state.sort_dir
  });
  
  render_cards(filtered_data, state.search);
  render_count(filtered_data.length);
  update_sort_button(state.sort_dir);
};

const handle_cuisine_select = (cuisine) => {
  state.cuisine = cuisine;
  render();
};

const handle_search = debounce((term) => {
  state.search = term;
  render();
});

const handle_sort_toggle = () => {
  state.sort_dir = state.sort_dir === "desc" ? "asc" : "desc";
  render();
};

const init = () => {
  state.data = load_data();
  
  const cuisines = get_unique_cuisines(state.data);
  render_filter_bar(cuisines, handle_cuisine_select);
  
  const search_input = document.getElementById("searchInput");
  if (search_input) {
    search_input.addEventListener("input", (e) => {
      handle_search(e.target.value);
    });
  }
  
  const sort_btn = document.getElementById("sortBtn");
  if (sort_btn) {
    sort_btn.addEventListener("click", handle_sort_toggle);
  }
  
  render();
};

init();