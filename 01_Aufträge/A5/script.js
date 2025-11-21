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


const list_el = document.getElementById("list");
const filters_el = document.getElementById("filters");
const hit_count_el = document.getElementById("hitCount");
const fav_count_el = document.getElementById("favCount");
const tpl = document.getElementById("cardTemplate");
const fav_button = document.getElementById("favBtn");


const fav_key = "localeats:favs";
const favs = new Set(JSON.parse(localStorage.getItem(fav_key) || "[]"));
update_fav_count();

function toggle_fav(id) {
    if (favs.has(id)) favs.delete(id); else favs.add(id);
    localStorage.setItem(fav_key, JSON.stringify([...favs]));
    update_fav_count();
}

function update_fav_count() {
    fav_count_el.textContent = `Favoriten: ${favs.size}`;
}

function make_card(r) {
    const node = tpl.content.firstElementChild.cloneNode(true);
    node.querySelector(".title").textContent = r.name;
    node.querySelector(".sub").textContent = `${r.cuisine} · ${r.price} · ★ ${r.rating}`;
    node.querySelector(".cuisine").textContent = `${r.cuisine}`;
    node.querySelector(".rating").textContent = `Bewertung: ★ ${r.rating}`;
    const fav_btn = node.querySelector(".favBtn");

    const set_fav_ui = () => {
        const active = favs.has(r.id);
        fav_btn.setAttribute("aria-pressed", String(active));
        fav_btn.textContent = active ? "★ Favorit" : "☆ Favorit";
    };
    set_fav_ui();

    fav_btn.addEventListener("click", () => {
        toggle_fav(r.id);
        set_fav_ui();
    });

    return node;
}

function render(filter = "Alle") {
    list_el.innerHTML = "";
    let data = restaurants;

    if (filter === "Favoriten") {
        data = restaurants.filter((r) => favs.has(r.id));
    } else if (filter !== "Alle") {
        data = restaurants.filter((r) => r.cuisine === filter);
    }

    data.forEach((r) => {
        list_el.appendChild(make_card(r));
    });
    hit_count_el.textContent = `Treffer: ${data.length}`;
}

function set_active_chip(target) {
    [...filters_el.children].forEach((b) => {
        b.classList.remove("active");
    });
    target.classList.add("active");
}


filters_el.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-filter]");
    if (!btn) return;
    set_active_chip(btn);
    render(btn.dataset.filter);
});

globalThis?.addEventListener('click', (e)=>{
    // check if 'favBtn' was clicked
   const filters_el = document.getElementById("filters");   
    if(e.target && e.target.id === 'favBtn'){
       const btn = filters_el.querySelector(".chip.active");
       if (!btn) return;
       render(btn.dataset.filter);
   }
});



render();