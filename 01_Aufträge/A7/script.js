// Minimaler A7-Client mit fetch/timeout, AbortController, lazy reviews und SWR (localStorage)

const ROOT = './data';
const TIMEOUT = 5000;
const CACHE_KEY = 'le_restaurants_v1';

// Helfer: fetch mit Timeout + kompatibler Abort-Handling
const fetchWithTimeout = async (url, { signal: externalSignal, ...opts } = {}, timeout = TIMEOUT) => {
  const controller = new AbortController();
  if (externalSignal) externalSignal.addEventListener('abort', () => controller.abort());
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { ...opts, signal: controller.signal });
    clearTimeout(id);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
};

// SWR: zeige Cache, lade neu im Hintergrund und aktualisiere
const loadCachedThenRevalidate = async () => {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      const data = JSON.parse(cached);
      renderList(data.restaurants, data.stats, true);
    } catch {}
  }
  // revalidate
  try {
    const [restaurants, stats] = await Promise.all([
      fetchWithTimeout(`${ROOT}/restaurants.json`),
      fetchWithTimeout(`${ROOT}/stats.json`)
    ]);
    const payload = { restaurants, stats };
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
    renderList(restaurants, stats, false);
  } catch (err) {
    // ignore here; initial loader will handle errors if nothing rendered yet
    console.warn('Revalidate failed', err);
  }
};

const setStatus = (html) => {
  const el = document.getElementById('status');
  el.innerHTML = html ?? '';
};

const setBusy = (isBusy) => {
  const list = document.getElementById('list');
  list?.setAttribute('aria-busy', isBusy ? 'true' : 'false');
};

const createCard = (r) => {
  const div = document.createElement('article');
  div.className = 'card';
  div.dataset.id = r.id;
  div.innerHTML = `
    <div class="thumb"><img src="${r.imgurl}" alt="${r.name}" style="width:100%;height:100%;object-fit:cover"></div>
    <div class="card-body">
      <h3 class="title">${r.name}</h3>
      <p><small>${r.cuisine} · ${r.price} · ★ ${r.rating}</small></p>
      <div style="margin-top:8px;display:flex;gap:8px;align-items:center">
        <button class="btn btn-reviews" aria-expanded="false" id="btn-show-review">Bewertungen anzeigen</button>
        <span class="reviews-state" aria-live="polite"></span>
      </div>
      <div class="reviews" hidden></div>
    </div>
  `;
  return div;
};

const reviewControllers = new Map(); // restaurantId -> controller

// Toggle & load reviews on demand
const toggleReviews = async (card) => {
  const id = Number(card.dataset.id);
  const btn = card.querySelector('.btn-reviews');
  const reviewsEl = card.querySelector('.reviews');
  const stateEl = card.querySelector('.reviews-state');
  const btn_show_review = card.querySelector('#btn-show-review');

  const expanded = btn.getAttribute('aria-expanded') === 'true';
  if (expanded) {
    // hide
    btn.setAttribute('aria-expanded', 'false');
    reviewsEl.hidden = true;
    reviewsEl.innerHTML = '';
    stateEl.textContent = '';
    // abort possible inflight
    const existing = reviewControllers.get(id);
    existing?.abort();
    reviewControllers.delete(id);
    btn_show_review.textContent = 'Bewertungen anzeigen';
    return;
  }

  // abort previous for this card if any
  const prev = reviewControllers.get(id);
  prev?.abort();

  const controller = new AbortController();
  reviewControllers.set(id, controller);

  btn.setAttribute('aria-expanded', 'true');
  reviewsEl.hidden = false;
  stateEl.textContent = 'Lädt…';
  let nDot = 0;
  let nDotMod = 3;
  let idInterval = window.setInterval(()=>{
    nDot = (nDot + 1) % (nDotMod + 1);
    stateEl.textContent = 'Lädt' + '.'.repeat(nDot);
  }, 333); 
  btn_show_review.textContent = 'Laden abbrechen';
  try {
    const reviews = await fetchWithTimeout(`${ROOT}/reviews.json`, { signal: controller.signal }, TIMEOUT);
    // filter client-side
    const filtered = (reviews ?? []).filter(r => r.restaurantId === id);
    if (controller.signal.aborted) throw new Error('aborted');
    reviewsEl.innerHTML = filtered.length
      ? filtered.map(rv => `<p><strong>${rv.author}:</strong> ${rv.text}</p>`).join('')
      : '<p><small>Keine Bewertungen</small></p>';
    stateEl.textContent = `(${filtered.length})`;
  } catch (err) {
    if (err.name === 'AbortError') {
      stateEl.textContent = 'Abgebrochen';
      btn_show_review.textContent = 'Bewertungen anzeigen';
    } else {
      stateEl.textContent = 'Fehler beim Laden';
      btn_show_review.textContent = 'Bewertungen anzeigen';
    }
  } finally {
    btn_show_review.textContent = 'Bewertungen verbergen';
      clearInterval(idInterval);
    reviewControllers.delete(id);
  }
};

const renderList = (restaurants = [], stats = {}, fromCache = false) => {
  const list = document.getElementById('list');
  if (!list) return;
  list.innerHTML = '';
  if (!restaurants.length) {
    list.innerHTML = '<div class="loading">Keine Daten vorhanden</div>';
  } else {
    restaurants.forEach(r => {
      const card = createCard(r);
      list.appendChild(card);
    });
    // attach review handlers
    list.querySelectorAll('.card').forEach(card => {
      const btn = card.querySelector('.btn-reviews');
      btn.addEventListener('click', () => toggleReviews(card));
    });
  }
  document.getElementById('hitCount').textContent = `Treffer: ${restaurants.length}`;
  setBusy(false);
  setStatus(fromCache ? '<div class="loading">Cache angezeigt, aktualisiere im Hintergrund…</div>' : '');
};

// Initial load with AbortController + timeout + clear error/retry
const initialLoad = async () => {
  setStatus('<div class="loading">Laden…</div>');
  setBusy(true);

  // If cache exists show immediately and revalidate in background
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) try {
    const parsed = JSON.parse(cached);
    renderList(parsed.restaurants, parsed.stats, true);
  } catch {}

  const controller = new AbortController();
  // global timeout
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const [restaurants, stats] = await Promise.all([
      fetchWithTimeout(`${ROOT}/restaurants.json`, { signal: controller.signal }, TIMEOUT),
      fetchWithTimeout(`${ROOT}/stats.json`, { signal: controller.signal }, TIMEOUT)
    ]);
    clearTimeout(timeoutId);
    // cache + render
    localStorage.setItem(CACHE_KEY, JSON.stringify({ restaurants, stats }));
    renderList(restaurants, stats, false);
    setStatus('');
  } catch (err) {
    clearTimeout(timeoutId);
    setBusy(false);
    const isAbort = err.name === 'AbortError';
    setStatus(`<div class="error">
      ${isAbort ? 'Anfrage abgebrochen (Timeout).' : 'Fehler beim Laden der Daten.'}
      <div><button id="retryBtn" class="btn">Erneut laden</button></div>
    </div>`);
    document.getElementById('retryBtn')?.addEventListener('click', () => initialLoad());
    console.error(err);
  }
};

// kleine Tests für fetchWithTimeout und Cache-Logik (Konsole)
const runMiniTests = async () => {
  console.log('Test: fetchWithTimeout (erwartet Erfolg)');
  try {
    const t = await fetchWithTimeout(`${ROOT}/stats.json`, {}, 2000);
    console.log('fetchWithTimeout OK', t);
  } catch (e) {
    console.warn('fetchWithTimeout fehlgeschlagen', e);
  }

  console.log('Test: Cache-Set/Get');
  const key = '__test_cache__';
  localStorage.setItem(key, JSON.stringify({ ok: true }));
  const v = JSON.parse(localStorage.getItem(key) ?? 'null');
  console.log(v?.ok === true ? 'Cache OK' : 'Cache FEHLER');
  localStorage.removeItem(key);
};

document.addEventListener('DOMContentLoaded', () => {
  initialLoad();
  runMiniTests();
  // zusätzlich: background revalidate (SWR)
  loadCachedThenRevalidate();
});