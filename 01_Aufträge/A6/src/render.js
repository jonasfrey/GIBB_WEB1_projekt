export const render_filter_bar = (categories, on_select) => {
  const filters_el = document.getElementById("filters");
  if (!filters_el) return;

  filters_el.innerHTML = "";
  
  const all_categories = ["Alle", ...categories];
  
  all_categories.forEach((category, index) => {
    const button = document.createElement("button");
    button.className = "chip";
    button.dataset.filter = category;
    button.textContent = category;
    button.setAttribute("aria-pressed", index === 0 ? "true" : "false");
    
    if (index === 0) button.classList.add("active");
    
    button.addEventListener("click", () => {
      [...filters_el.children].forEach((btn) => {
        btn.classList.remove("active");
        btn.setAttribute("aria-pressed", "false");
      });
      
      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");
      
      on_select(category);
    });
    
    filters_el.appendChild(button);
  });
};

export const render_cards = (restaurants, search_term = "") => {
  const list_el = document.getElementById("list");
  if (!list_el) return;

  list_el.innerHTML = "";

  if (restaurants.length === 0) {
    list_el.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--col_muted);">
        <p style="font-size: 18px;">Keine Restaurants gefunden</p>
        <p>Versuche andere Filter oder Suchbegriffe</p>
      </div>
    `;
    return;
  }

  restaurants.forEach((restaurant) => {
    const card = create_card(restaurant, search_term);
    list_el.appendChild(card);
  });
};

const create_card = (restaurant, search_term = "") => {
  const { id, name, cuisine, price, rating, imgurl } = restaurant;
  const article = document.createElement("article");
  article.className = "card";


  const highlighted_name = highlight_search_text(name, search_term);
  
  article.innerHTML = `
    <div class="thumb" aria-hidden="true">
      <img src="${imgurl}" 
           alt="" 
           style="width: 100%; height: 100%; object-fit: cover;" />
    </div>
    <div class="card-body">
      <h3 class="title">${highlighted_name}</h3>
      <p class="sub">${cuisine} · ${price} · ★ ${rating}</p>
      <div class="rows">
        <p class="row cuisine">${cuisine}</p>
        <p class="row rating">Bewertung: ★ ${rating}</p>
      </div>
      <div class="actions">
        <button class="favBtn" data-id="${id}" aria-pressed="false">☆ Favorit</button>
        <a class="details" href="#${id}" target="_blank" rel="noopener">Details</a>
      </div>
    </div>
  `;
  
  return article;
};

const highlight_search_text = (text, search_term) => {
  if (!search_term || !text) return text;
  
  const lower_text = text.toLowerCase();
  const lower_search = search_term.toLowerCase();
  const start_index = lower_text.indexOf(lower_search);
  
  if (start_index === -1) return text;
  
  const end_index = start_index + search_term.length;
  const before = text.substring(0, start_index);
  const match = text.substring(start_index, end_index);
  const after = text.substring(end_index);
  
  return `${before}<mark>${match}</mark>${after}`;
};

export const render_count = (count) => {
  const hit_count_el = document.getElementById("hitCount");
  if (!hit_count_el) return;
  
  hit_count_el.textContent = `Treffer: ${count}`;
};

export const update_sort_button = (direction) => {
  const sort_btn = document.getElementById("sortBtn");
  if (!sort_btn) return;
  
  sort_btn.textContent = `Bewertung ${direction === "desc" ? "▼" : "▲"}`;
  sort_btn.setAttribute("aria-label", 
    `Sortierung: ${direction === "desc" ? "Absteigend" : "Aufsteigend"}`
  );
};