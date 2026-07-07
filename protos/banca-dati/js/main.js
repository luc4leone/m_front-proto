import protoData from "./data.js";
import { renderTable, renderPagination } from "./render.js";

const PAGE_SIZE = 50;
const state = { query: '', page: 1 };
const journalists = Array.isArray(protoData.journalists) ? protoData.journalists : [];

const app = document.querySelector("#app");

app.innerHTML = `
  <div class="layout">
    <div class="toolbar">
      <input type="search" id="search-input" placeholder="Cerca nome, cognome, testata…" autocomplete="off" />
      <span id="count"></span>
    </div>
    <div id="results"></div>
  </div>`;

const searchInput = document.getElementById('search-input');
const countEl = document.getElementById('count');
const resultsEl = document.getElementById('results');

function getFiltered() {
  const q = state.query.trim().toLowerCase();
  if (!q) return journalists;
  return journalists.filter(j =>
    (j.nome || '').toLowerCase().includes(q) ||
    (j.cognome || '').toLowerCase().includes(q) ||
    (j.testata || '').toLowerCase().includes(q) ||
    (j.ruolo || '').toLowerCase().includes(q) ||
    (j.servizio || '').toLowerCase().includes(q)
  );
}

function update() {
  const filtered = getFiltered();
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(state.page, totalPages);
  const slice = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  countEl.textContent = `${filtered.length} risultati`;
  resultsEl.innerHTML = renderTable(slice) + renderPagination(page, totalPages);

  document.getElementById('prev-btn')?.addEventListener('click', () => {
    if (state.page > 1) { state.page--; update(); }
  });

  document.getElementById('next-btn')?.addEventListener('click', () => {
    if (state.page < totalPages) { state.page++; update(); }
  });
}

searchInput.addEventListener('input', e => {
  state.query = e.target.value;
  state.page = 1;
  update();
});

update();
