// ---- DOM-Manipulation und Template-Erzeugung ------------------------

// Kategorie-Filter-Bar rendern
export const render_filter_bar = (categories, on_select) => {
  const filters_el = document.getElementById("filters");
  if (!filters_el) return;

  filters_el.innerHTML = "";
  
  // "Alle" immer als erste Kategorie
  const all_categories = ["Alle", ...categories];
  
  all_categories.forEach((category, index) => {
    const button = document.createElement("button");
    button.className = "chip";
    button.dataset.filter = category;
    button.textContent = category;
    button.setAttribute("aria-pressed", index === 0 ? "true" : "false");
    
    if (index === 0) button.classList.add("active");
    
    button.addEventListener("click", () => {
      // Alle Buttons deaktivieren
      [...filters_el.children].forEach((btn) => {
        btn.classList.remove("active");
        btn.setAttribute("aria-pressed", "false");
      });
      
      // Aktuellen Button aktivieren
      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");
      
      on_select(category);
    });
    
    filters_el.appendChild(button);
  });
};

// Restaurant-Karten rendern
export const render_cards = (restaurants) => {
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
    const card = create_card(restaurant);
    list_el.appendChild(card);
  });
};

// Einzelne Restaurant-Karte erstellen
const create_card = ({ id, name, cuisine, price, rating }) => {
  const article = document.createElement("article");
  article.className = "card";
  
  let urlmap = {
    "Italienisch": "https://plus.unsplash.com/premium_photo-1664391750931-c1ee3adfe39f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=763",
    "Asiatisch": "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    "Vegan": "https://images.unsplash.com/photo-1540914124281-342587941389?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074",
    "Amerikanisch": "https://images.unsplash.com/photo-1602030638412-bb8dcc0bc8b0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1171",
    "Mediterran": "https://images.unsplash.com/photo-1653611540493-b3a896319fbf?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1171",
    "Vietnamesisch": "https://images.unsplash.com/photo-1583316175701-0bc5f25a0a44?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    "Französisch": "https://images.unsplash.com/photo-1608855238293-a8853e7f7c98?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",

  }
  let fallbackurl = "https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170"
  let url = urlmap[cuisine] || fallbackurl;
  article.innerHTML = `
    <div class="thumb" aria-hidden="true">
      <img src="${url}" 
           alt="" 
           style="width: 100%; height: 100%; object-fit: cover;" />
    </div>
    <div class="card-body">
      <h3 class="title">${name}</h3>
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

// Trefferzahl anzeigen
export const render_count = (count) => {
  const hit_count_el = document.getElementById("hitCount");
  if (!hit_count_el) return;
  
  hit_count_el.textContent = `Treffer: ${count}`;
};

// Sortier-Button aktualisieren
export const update_sort_button = (direction) => {
  const sort_btn = document.getElementById("sortBtn");
  if (!sort_btn) return;
  
  sort_btn.textContent = `Bewertung ${direction === "desc" ? "▼" : "▲"}`;
  sort_btn.setAttribute("aria-label", 
    `Sortierung: ${direction === "desc" ? "Absteigend" : "Aufsteigend"}`
  );
};