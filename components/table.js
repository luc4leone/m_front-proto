// components/table.js
// Tabella data-driven con colonna selezione, header sortable e celle custom.
//
// render({ columns, rows }) → stringa HTML della tabella
// init(element, { onSort, onFilter, onRowSelect }) → attacca event listener

/**
 * @typedef {Object} Column
 * @property {string} key - Chiave colonna
 * @property {string} label - Etichetta header
 * @property {boolean} [sortable] - Se l'header è sortable
 * @property {'asc'|'desc'|null} [sortDirection] - Direzione corrente
 * @property {boolean} [checkbox] - Se la colonna è una checkbox
 * @property {function(any): string} [cellRenderer] - Funzione per renderizzare cella
 */

/**
 * Renderizza la tabella
 * @param {Object} config
 * @param {Column[]} config.columns
 * @param {Object[]} config.rows
 * @returns {string} HTML string
 */
export function render({ columns = [], rows = [] }) {
  const headerCells = columns
    .map((col) => {
      const sortClass = col.sortable
        ? ` table__header-cell--sortable${col.sortDirection ? ` table__header-cell--sort-${col.sortDirection}` : ''}`
        : '';
      const sortIcon = col.sortable
        ? `<svg class="table__sort-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="20" height="20" fill="currentColor" aria-hidden="true" focusable="false"><path d="M480-360 280-560h400L480-360Z"/></svg>`
        : '';
      const headerExtra = col.headerExtra ? col.headerExtra : '';
      if (col.checkbox) {
        return `<th class="table__header-cell table__header-cell--checkbox" scope="col">
          <input type="checkbox" class="form__checkbox" data-table-select-all aria-label="Seleziona tutti" />
        </th>`;
      }
      return `<th class="table__header-cell${sortClass}" scope="col" data-col-key="${col.key}" ${col.sortable ? 'data-sortable' : ''}>
          ${col.label}${sortIcon}${headerExtra}
        </th>`;
    })
    .join('');

  const bodyRows = rows
    .map(
      (row, rowIndex) => `
      <tr class="table__row" data-row-index="${rowIndex}">
        ${columns
          .map((col) => {
            if (col.checkbox) {
              return `<td class="table__cell table__cell--checkbox">
                <input type="checkbox" class="form__checkbox" data-row-select aria-label="Seleziona riga" />
              </td>`;
            }
            const value = row[col.key];
            const content = col.cellRenderer ? col.cellRenderer(value, row) : escapeHtml(value);
            return `<td class="table__cell">${content}</td>`;
          })
          .join('')}
      </tr>
    `
    )
    .join('');

  return `
    <table class="table" data-table>
      <thead class="table__head">
        <tr class="table__header-row">
          ${headerCells}
        </tr>
      </thead>
      <tbody class="table__body">
        ${bodyRows || `<tr><td class="table__cell table__cell--empty" colspan="${columns.length}">Nessun risultato</td></tr>`}
      </tbody>
    </table>
  `;
}

/**
 * Inizializza la tabella
 * @param {HTMLElement} element - Elemento table montato
 * @param {Object} callbacks
 * @param {function(string, 'asc'|'desc'): void} [callbacks.onSort] - Chiave e direzione
 * @param {function(number[]): void} [callbacks.onSelect] - Indici righe selezionate
 */
export function init(element, { onSort, onSelect } = {}) {
  if (onSort) {
    element.querySelectorAll('[data-sortable]').forEach((th) => {
      th.addEventListener('click', () => {
        const key = th.dataset.colKey;
        const current = th.classList.contains('table__header-cell--sort-asc')
          ? 'asc'
          : th.classList.contains('table__header-cell--sort-desc')
          ? 'desc'
          : null;
        const next = current === 'asc' ? 'desc' : 'asc';
        onSort(key, next);
      });
    });
  }

  if (onSelect) {
    const selectAll = element.querySelector('[data-table-select-all]');
    const rowChecks = element.querySelectorAll('[data-row-select]');

    const updateSelection = () => {
      const selected = [];
      rowChecks.forEach((cb, index) => {
        if (cb.checked) selected.push(index);
      });
      onSelect(selected);
    };

    if (selectAll) {
      selectAll.addEventListener('change', () => {
        rowChecks.forEach((cb) => (cb.checked = selectAll.checked));
        updateSelection();
      });
    }

    rowChecks.forEach((cb) => cb.addEventListener('change', updateSelection));
  }
}

function escapeHtml(value) {
  if (value == null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
