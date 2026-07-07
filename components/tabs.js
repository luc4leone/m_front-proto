// tabs.js
// Componente interattivo tabs

/**
 * @typedef {Object} Tab
 * @property {string} id - Identificatore univoco del tab
 * @property {string} label - Testo visualizzato sul tab
 */

/**
 * Renderizza il markup HTML per il componente tabs
 * @param {Object} config
 * @param {Tab[]} config.tabs - Array di tab da visualizzare
 * @param {string} config.activeId - ID del tab attivo
 * @param {string} [config.variant] - Variante: 'large', 'highlight', 'large-highlight'
 * @returns {string} HTML string
 */
export function render({ tabs = [], activeId = null, variant = null }) {
  const tabsHtml = tabs
    .map(
      (tab, index) => `
      <button
        type="button"
        class="tabs__tab ${tab.id === activeId ? "tabs__tab--active" : ""}"
        data-tab-id="${tab.id}"
        role="tab"
        aria-selected="${tab.id === activeId ? "true" : "false"}"
      >
        ${tab.label}
        ${tab.badge != null ? `<span class="badge">${tab.badge}</span>` : ''}
      </button>
    `
    )
    .join("");

  const variantClass = Array.isArray(variant)
    ? variant.map(v => `tabs--${v}`).join(' ')
    : variant ? `tabs--${variant}` : '';

  return `
    <nav class="tabs ${variantClass}" data-tabs role="tablist" aria-label="Navigazione sezioni">
      ${tabsHtml}
    </nav>
  `;
}

/**
 * Inizializza il comportamento interattivo dei tabs
 * @param {HTMLElement} element - L'elemento DOM già montato (il nav.tabs)
 * @param {Object} callbacks
 * @param {function(string): void} [callbacks.onTabChange] - Callback chiamato quando cambia il tab
 */
export function init(element, { onTabChange } = {}) {
  const tabs = element.querySelectorAll("[data-tab-id]");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabId = tab.dataset.tabId;

      // Rimuovi stato attivo da tutti i tab
      tabs.forEach((t) => {
        t.classList.remove("tabs__tab--active");
        t.setAttribute("aria-selected", "false");
      });

      // Aggiungi stato attivo al tab cliccato
      tab.classList.add("tabs__tab--active");
      tab.setAttribute("aria-selected", "true");

      // Chiama callback se fornito
      if (onTabChange) {
        onTabChange(tabId);
      }
    });
  });
}
