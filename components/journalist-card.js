// journalist-card.js
//
// render(config) → stringa HTML di una card giornalista
// init(element, { onOpen, onSelect, onRemove }) → attacca event listener

export function render({
  id = "",
  firstName = "",
  lastName = "",
  role = "",
  rows = [],       // [{ label, value }]
  note = "",
  selected = false,
  showCheckbox = true,
  showRemove = false,
}) {
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const checkboxId = id ? `journalist-card-select-${id}` : "";

  const checkboxHtml = showCheckbox
    ? `<input
         class="journalist-card__select"
         type="checkbox"
         ${checkboxId ? `id="${checkboxId}" ` : ""}
         ${id ? `data-id="${id}" ` : ""}
         ${selected ? "checked" : ""}
       />`
    : "";

  const removeHtml = showRemove
    ? `<button type="button" class="journalist-card__remove" ${id ? `data-remove-id="${id}" ` : ""}aria-label="rimuovi da lista">×</button>`
    : "";

  const rowsHtml = rows
    .map(
      ({ label, value }) => `
      <div class="journalist-card__row">
        <span class="journalist-card__label">${label}</span>
        <span class="journalist-card__value">${value || '<span style="color:var(--grey-500)">n/d</span>'}</span>
      </div>`,
    )
    .join("");

  const noteHtml = note !== undefined
    ? `<div class="journalist-card__row">
        <span class="journalist-card__label">Note</span>
        <span class="journalist-card__value journalist-card__note">${note || '<em style="color:var(--grey-500)">nessuna nota</em>'}</span>
      </div>`
    : "";

  return `
    <div
      class="journalist-card${selected ? " is-selected" : ""}"
      ${id ? `data-id="${id}"` : ""}
    >
      ${removeHtml}
      <div class="journalist-card__top">
        <div class="journalist-card__name-row">
          ${checkboxHtml}
          <a href="#" class="journalist-card__name-link" aria-label="apri scheda" title="${fullName}">
            <h3 class="journalist-card__name">
              <span class="journalist-card__first-name">${firstName}</span>
              <span class="journalist-card__last-name">${lastName}</span>
            </h3>
          </a>
          ${role ? `<p class="journalist-card__role">${role}</p>` : ""}
        </div>
      </div>
      ${rowsHtml}
      ${noteHtml}
    </div>
  `;
}

export function init(element, { onOpen, onSelect, onRemove } = {}) {
  element.addEventListener("click", (e) => {
    const nameLink = e.target.closest(".journalist-card__name-link");
    if (nameLink && onOpen) {
      e.preventDefault();
      onOpen(element.dataset.id, element);
      return;
    }

    const removeBtn = e.target.closest(".journalist-card__remove");
    if (removeBtn && onRemove) {
      e.preventDefault();
      onRemove(removeBtn.dataset.removeId || element.dataset.id, element);
      return;
    }
  });

  const checkbox = element.querySelector(".journalist-card__select");
  if (checkbox && onSelect) {
    checkbox.addEventListener("change", () => {
      element.classList.toggle("is-selected", checkbox.checked);
      onSelect(element.dataset.id, checkbox.checked, element);
    });
  }
}
