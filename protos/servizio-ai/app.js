// Motore "AI" deterministico: nessuna chiamata di rete, solo matching
// a dizionario contro il vocabolario noto (data.js) + un piccolo set di
// parole-operatore per capire come il nuovo turno modifica lo stato.
//
// Lo stato dei filtri è l'unica fonte di verità, condivisa tra la vista
// Chat e la vista Filtri manuali: qualunque modifica in una si riflette
// immediatamente nell'altra.

const state = {
  argomento: [],
  città: [],
  ruolo: { includi: [], escludi: [] },
};

let lastChatSyncSnapshot = snapshotState();
const messages = [];

const EXCLUDE_WORDS = ["togli", "rimuovi", "escludi", "senza", "elimina"];
const ADD_WORDS = ["aggiungi", "anche", "inoltre", "pure"];
const RESTRICT_WORDS = ["solo", "soltanto", "unicamente"];

const SUGGESTIONS_BY_STEP = [
  "giornalisti che scrivono di cultura a Torino",
  "aggiungi anche Arte",
  "togli i freelance",
];

function normalize(str) {
  return String(str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function hasWord(text, word) {
  const w = normalize(word).trim();
  if (!w) return false;
  const re = new RegExp(`(^|[^a-zà-ù])${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-zà-ù]|$)`, "i");
  return re.test(text);
}

function detectOperator(text) {
  if (EXCLUDE_WORDS.some((w) => hasWord(text, w))) return "exclude";
  if (RESTRICT_WORDS.some((w) => hasWord(text, w))) return "restrict";
  if (ADD_WORDS.some((w) => hasWord(text, w))) return "add";
  return "add"; // default: prima richiesta o frase neutra → si aggiunge allo stato (che parte vuoto)
}

function extractEntities(text) {
  const found = { argomenti: [], città: [], ruoli: [] };

  for (const a of ARGOMENTI) {
    if (hasWord(text, a)) found.argomenti.push(a);
  }
  for (const [syn, canon] of Object.entries(ARGOMENTO_SINONIMI)) {
    if (hasWord(text, syn) && !found.argomenti.includes(canon)) found.argomenti.push(canon);
  }

  for (const c of CITTA) {
    if (hasWord(text, c)) found.città.push(c);
  }

  for (const r of RUOLI) {
    if (hasWord(text, r)) found.ruoli.push(r);
  }
  for (const [syn, canon] of Object.entries(RUOLO_SINONIMI)) {
    if (hasWord(text, syn) && !found.ruoli.includes(canon)) found.ruoli.push(canon);
  }

  return found;
}

function union(a, b) {
  const out = [...a];
  for (const x of b) if (!out.includes(x)) out.push(x);
  return out;
}

function applyTurn(text) {
  const t = normalize(text);
  const op = detectOperator(t);
  const entities = extractEntities(t);
  const isEmpty = !entities.argomenti.length && !entities.città.length && !entities.ruoli.length;
  if (isEmpty) return { op, entities, applied: false };

  if (entities.argomenti.length) {
    if (op === "exclude") {
      state.argomento = state.argomento.filter((x) => !entities.argomenti.includes(x));
    } else if (op === "restrict") {
      state.argomento = [...entities.argomenti];
    } else {
      state.argomento = union(state.argomento, entities.argomenti);
    }
  }

  if (entities.città.length) {
    if (op === "exclude") {
      state.città = state.città.filter((x) => !entities.città.includes(x));
    } else if (op === "restrict") {
      state.città = [...entities.città];
    } else {
      state.città = union(state.città, entities.città);
    }
  }

  if (entities.ruoli.length) {
    if (op === "exclude") {
      state.ruolo.escludi = union(state.ruolo.escludi, entities.ruoli);
      state.ruolo.includi = state.ruolo.includi.filter((x) => !entities.ruoli.includes(x));
    } else if (op === "restrict") {
      state.ruolo.includi = [...entities.ruoli];
      state.ruolo.escludi = state.ruolo.escludi.filter((x) => !entities.ruoli.includes(x));
    } else {
      state.ruolo.includi = union(state.ruolo.includi, entities.ruoli);
      state.ruolo.escludi = state.ruolo.escludi.filter((x) => !entities.ruoli.includes(x));
    }
  }

  return { op, entities, applied: true };
}

function matchesFilters(rec) {
  if (state.argomento.length && !rec.argomenti.some((a) => state.argomento.includes(a))) return false;
  if (state.città.length && !state.città.includes(rec.città)) return false;
  if (state.ruolo.escludi.length && state.ruolo.escludi.includes(rec.ruolo)) return false;
  if (state.ruolo.includi.length && !state.ruolo.includi.includes(rec.ruolo)) return false;
  return true;
}

function filteredJournalists() {
  return JOURNALISTS.filter(matchesFilters);
}

function hasActiveFilters() {
  return !!(state.argomento.length || state.città.length || state.ruolo.includi.length || state.ruolo.escludi.length);
}

function snapshotState() {
  return JSON.stringify(state);
}

// ---------- Rendering ----------

const els = {};

function qs(id) {
  return document.getElementById(id);
}

function escapeHtml(str) {
  return String(str || "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[c]);
}

function chipHtml(label, kind) {
  return `<span class="chip chip--${kind}">${escapeHtml(label)}</span>`;
}

function renderResults() {
  const list = filteredJournalists();
  els.resultsCount.textContent = String(list.length);
  els.resultsTotal.textContent = String(JOURNALISTS.length);

  if (!list.length) {
    els.cardsGrid.innerHTML = `<div class="empty-state">Nessun giornalista corrisponde ai filtri attivi. Prova a togliere un filtro.</div>`;
    return;
  }

  els.cardsGrid.innerHTML = list
    .map((j) => {
      const tags = j.argomenti.map((a) => chipHtml(a, "tag")).join("");
      return `
        <article class="card">
          <div class="card__top">
            <h3 class="card__name">${escapeHtml(j.nome)} <strong>${escapeHtml(j.cognome)}</strong></h3>
            <span class="card__ruolo">${escapeHtml(j.ruolo)}</span>
          </div>
          <p class="card__testata">${escapeHtml(j.testata)} · ${escapeHtml(j.città)}</p>
          <div class="card__tags">${tags}</div>
          <p class="card__email">${escapeHtml(journalistEmail(j))}</p>
        </article>
      `;
    })
    .join("");
}

function renderFilterBar() {
  const groups = [];

  if (state.argomento.length) {
    groups.push(
      `<span class="filterbar__label">Argomento</span>` +
        state.argomento.map((v) => chipHtml(v, "argomento")).join("")
    );
  }
  if (state.città.length) {
    groups.push(
      `<span class="filterbar__label">Città</span>` +
        state.città.map((v) => chipHtml(v, "citta")).join("")
    );
  }
  if (state.ruolo.includi.length) {
    groups.push(
      `<span class="filterbar__label">Ruolo</span>` +
        state.ruolo.includi.map((v) => chipHtml(v, "ruolo")).join("")
    );
  }
  if (state.ruolo.escludi.length) {
    groups.push(
      `<span class="filterbar__label">Ruolo escluso</span>` +
        state.ruolo.escludi.map((v) => chipHtml("≠ " + v, "ruolo-escluso")).join("")
    );
  }

  els.filterBar.innerHTML = groups.length
    ? groups.join('<span class="filterbar__sep"></span>')
    : `<span class="filterbar__empty">Nessun filtro attivo — mostra tutta la banca dati</span>`;
}

function describeTurnHtml(result) {
  const { op, entities, applied } = result;
  if (!applied) {
    return `<p>Non ho capito la richiesta. Prova a nominare un argomento (es. ${chipHtml("Cultura", "argomento")}), una città (es. ${chipHtml("Torino", "citta")}) o un ruolo (es. «togli i freelance»).</p>`;
  }

  const parts = [];
  if (entities.argomenti.length) {
    const verb = op === "exclude" ? "Tolto argomento" : op === "restrict" ? "Impostato argomento" : "Aggiunto argomento";
    parts.push(`${escapeHtml(verb)}: ${entities.argomenti.map((v) => chipHtml(v, "argomento")).join(" ")}`);
  }
  if (entities.città.length) {
    const verb = op === "exclude" ? "Tolta città" : op === "restrict" ? "Impostata città" : "Aggiunta città";
    parts.push(`${escapeHtml(verb)}: ${entities.città.map((v) => chipHtml(v, "citta")).join(" ")}`);
  }
  if (entities.ruoli.length) {
    const verb = op === "exclude" ? "Escluso ruolo" : op === "restrict" ? "Ristretto a ruolo" : "Incluso ruolo";
    parts.push(`${escapeHtml(verb)}: ${entities.ruoli.map((v) => chipHtml(v, op === "exclude" ? "ruolo-escluso" : "ruolo")).join(" ")}`);
  }

  const count = filteredJournalists().length;
  return `<p>${parts.join(" · ")}.</p><p class="msg__count">Ora ci sono <strong>${count}</strong> giornalist${count === 1 ? "a" : "i"}.</p>`;
}

function renderMessages() {
  els.chatMessages.innerHTML = messages
    .map((m) => {
      if (m.role === "system") {
        return `<div class="msg msg--system">${escapeHtml(m.text)}</div>`;
      }
      if (m.role === "user") {
        return `<div class="msg msg--user"><p>${escapeHtml(m.text)}</p></div>`;
      }
      return `<div class="msg msg--assistant">${m.html}</div>`;
    })
    .join("");
  els.chatMessages.scrollTop = els.chatMessages.scrollHeight;
}

function renderSuggestions() {
  const step = messages.filter((m) => m.role === "user").length;
  const next = SUGGESTIONS_BY_STEP[step];
  if (!next) {
    els.suggestions.innerHTML = "";
    els.suggestions.hidden = true;
    return;
  }
  els.suggestions.hidden = false;
  els.suggestions.innerHTML = `<button type="button" class="suggestion" data-suggestion="${escapeHtml(next)}">${escapeHtml(next)}</button>`;
}

function renderManualFilters() {
  els.manualFilters.innerHTML = `
    ${manualGroupHtml("Argomento", "argomento", ARGOMENTI, state.argomento)}
    ${manualGroupHtml("Città", "citta", CITTA, state.città)}
    ${manualGroupHtml("Ruolo incluso", "ruolo-includi", RUOLI, state.ruolo.includi)}
    ${manualGroupHtml("Ruolo escluso", "ruolo-escludi", RUOLI, state.ruolo.escludi)}
  `;
}

function manualGroupHtml(label, groupKey, options, activeValues) {
  const chips = activeValues.length
    ? activeValues
        .map(
          (v) =>
            `<span class="chip chip--removable" data-group="${groupKey}" data-value="${escapeHtml(v)}">${escapeHtml(v)} <button type="button" class="chip__remove" data-group="${groupKey}" data-value="${escapeHtml(v)}" aria-label="Rimuovi ${escapeHtml(v)}">×</button></span>`
        )
        .join("")
    : `<span class="manual-group__empty">nessuno</span>`;

  const available = options.filter((o) => !activeValues.includes(o));
  const select = available.length
    ? `<select class="manual-group__select" data-group="${groupKey}">
        <option value="">+ aggiungi…</option>
        ${available.map((o) => `<option value="${escapeHtml(o)}">${escapeHtml(o)}</option>`).join("")}
      </select>`
    : "";

  return `
    <div class="manual-group">
      <div class="manual-group__label">${escapeHtml(label)}</div>
      <div class="manual-group__chips">${chips}</div>
      ${select}
    </div>
  `;
}

function renderAll() {
  renderResults();
  renderFilterBar();
  renderMessages();
  renderSuggestions();
  renderManualFilters();
}

// ---------- Sync chat <-> manuale ----------

function diffLabel() {
  const before = JSON.parse(lastChatSyncSnapshot);
  const parts = [];

  const diffArr = (a, b, label) => {
    const added = b.filter((x) => !a.includes(x));
    const removed = a.filter((x) => !b.includes(x));
    if (added.length) parts.push(`+${label} ${added.join(", ")}`);
    if (removed.length) parts.push(`-${label} ${removed.join(", ")}`);
  };

  diffArr(before.argomento, state.argomento, "argomento:");
  diffArr(before.città, state.città, "città:");
  diffArr(before.ruolo.includi, state.ruolo.includi, "ruolo:");
  diffArr(before.ruolo.escludi, state.ruolo.escludi, "ruolo escluso:");

  return parts.join(" · ");
}

function syncChatOnReturn() {
  if (snapshotState() === lastChatSyncSnapshot) return;
  const diff = diffLabel();
  if (diff) {
    messages.push({ role: "system", text: `Filtri modificati manualmente — ${diff}` });
  }
  lastChatSyncSnapshot = snapshotState();
  renderMessages();
}

// ---------- Eventi ----------

function setActiveTab(tab) {
  els.tabChat.classList.toggle("is-active", tab === "chat");
  els.tabManual.classList.toggle("is-active", tab === "manual");
  els.tabChat.setAttribute("aria-selected", String(tab === "chat"));
  els.tabManual.setAttribute("aria-selected", String(tab === "manual"));
  els.paneChat.hidden = tab !== "chat";
  els.paneManual.hidden = tab !== "manual";
  if (tab === "chat") syncChatOnReturn();
}

function sendTurn(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) return;
  messages.push({ role: "user", text: trimmed });
  const result = applyTurn(trimmed);
  messages.push({ role: "assistant", html: describeTurnHtml(result) });
  lastChatSyncSnapshot = snapshotState();
  renderAll();
}

function removeChip(group, value) {
  if (group === "argomento") state.argomento = state.argomento.filter((v) => v !== value);
  else if (group === "citta") state.città = state.città.filter((v) => v !== value);
  else if (group === "ruolo-includi") state.ruolo.includi = state.ruolo.includi.filter((v) => v !== value);
  else if (group === "ruolo-escludi") state.ruolo.escludi = state.ruolo.escludi.filter((v) => v !== value);
  renderAll();
}

function addChip(group, value) {
  if (!value) return;
  if (group === "argomento" && !state.argomento.includes(value)) state.argomento.push(value);
  else if (group === "citta" && !state.città.includes(value)) state.città.push(value);
  else if (group === "ruolo-includi" && !state.ruolo.includi.includes(value)) state.ruolo.includi.push(value);
  else if (group === "ruolo-escludi" && !state.ruolo.escludi.includes(value)) state.ruolo.escludi.push(value);
  renderAll();
}

const WELCOME_HTML = `<p>Descrivimi chi vuoi raggiungere — argomento, città, ruolo — e costruisco i filtri mentre scrivi.</p>`;

function resetAll() {
  state.argomento = [];
  state.città = [];
  state.ruolo = { includi: [], escludi: [] };
  messages.length = 0;
  messages.push({ role: "assistant", html: WELCOME_HTML });
  lastChatSyncSnapshot = snapshotState();
  renderAll();
}

function init() {
  els.tabChat = qs("tabChat");
  els.tabManual = qs("tabManual");
  els.paneChat = qs("paneChat");
  els.paneManual = qs("paneManual");
  els.chatMessages = qs("chatMessages");
  els.chatInput = qs("chatInput");
  els.chatForm = qs("chatForm");
  els.suggestions = qs("suggestions");
  els.manualFilters = qs("manualFilters");
  els.filterBar = qs("filterBar");
  els.cardsGrid = qs("cardsGrid");
  els.resultsCount = qs("resultsCount");
  els.resultsTotal = qs("resultsTotal");
  els.resetLink = qs("resetLink");

  els.tabChat.addEventListener("click", () => setActiveTab("chat"));
  els.tabManual.addEventListener("click", () => setActiveTab("manual"));

  els.chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    sendTurn(els.chatInput.value);
    els.chatInput.value = "";
    els.chatInput.focus();
  });

  els.suggestions.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-suggestion]");
    if (!btn) return;
    sendTurn(btn.dataset.suggestion);
  });

  els.manualFilters.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip__remove");
    if (!btn) return;
    removeChip(btn.dataset.group, btn.dataset.value);
  });

  els.manualFilters.addEventListener("change", (e) => {
    const select = e.target.closest(".manual-group__select");
    if (!select) return;
    addChip(select.dataset.group, select.value);
  });

  els.resetLink.addEventListener("click", (e) => {
    e.preventDefault();
    resetAll();
  });

  messages.push({ role: "assistant", html: WELCOME_HTML });

  renderAll();
}

document.addEventListener("DOMContentLoaded", init);
