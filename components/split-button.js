// split-button.js
//
// render({ mainLabel, mainHref, items, menuLeft }) → stringa HTML
// init(element, { onMain, onItem })               → attacca event listener

export function render({
  mainLabel = "Azione",
  mainHref = "#",
  items = [],         // [{ label, value }]
  menuLeft = false,
} = {}) {
  const menuClass = `split-button__menu${menuLeft ? " split-button--menu-left-inner" : ""}`;
  const itemsHtml = items
    .map(
      ({ label, value }) =>
        `<button type="button" class="split-button__menu-item" data-value="${value}">${label}</button>`,
    )
    .join("");

  return `
    <div class="split-button${menuLeft ? " split-button--menu-left" : ""}" data-split-button>
      <a href="${mainHref}" class="split-button__main" data-main>${mainLabel}</a>
      <button
        type="button"
        class="split-button__toggle"
        aria-haspopup="menu"
        aria-expanded="false"
        aria-label="altre azioni"
        data-toggle
      >
        <span class="split-button__arrow" aria-hidden="true"></span>
      </button>
      <div class="${menuClass}" role="menu" data-menu>
        ${itemsHtml}
      </div>
    </div>
  `;
}

export function init(element, { onMain, onItem } = {}) {
  const toggle = element.querySelector("[data-toggle]");
  const menu = element.querySelector("[data-menu]");
  const main = element.querySelector("[data-main]");

  if (!toggle || !menu) return;

  const open = () => {
    menu.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
  };

  const close = () => {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  const isOpen = () => menu.classList.contains("is-open");

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    isOpen() ? close() : open();
  });

  menu.addEventListener("click", (e) => {
    const item = e.target.closest(".split-button__menu-item");
    if (!item) return;
    e.preventDefault();
    if (onItem) onItem(item.dataset.value, item);
    close();
  });

  if (main && onMain) {
    main.addEventListener("click", (e) => {
      e.preventDefault();
      onMain(main);
    });
  }

  document.addEventListener("click", (e) => {
    if (!element.contains(e.target)) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) {
      close();
      toggle.focus();
    }
  });
}
