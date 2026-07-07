// components/sidebar.js
// Sidebar di navigazione verticale.
//
// render({ items, activeId }) → stringa HTML dell'intero <nav>
// setActive(element, id)      → aggiorna lo stato attivo senza re-render
// init(element, { onNavigate }) → attacca gli event listener

export function render({ items, activeId }) {
  return `
    <nav class="sidebar" data-sidebar>
      ${items.map(item => renderItem(item, activeId)).join("")}
    </nav>
  `;
}

function renderItem(item, activeId) {
  if (item.type === "spacer") {
    return `<div class="sidebar__spacer" aria-hidden="true"></div>`;
  }

  if (item.type === "separator") {
    return `<hr class="sidebar__separator" aria-hidden="true" />`;
  }

  if (item.type === "toggle") {
    const iconLightKey = getIconKeyFromUrl(item.icon);
    const iconDarkKey = getIconKeyFromUrl(item.iconDark);
    return `
      <button
        class="sidebar__item sidebar__item--toggle"
        data-id="${item.id}"
        data-type="toggle"
        data-icon-light="${iconLightKey || ""}"
        data-icon-dark="${iconDarkKey || ""}"
        aria-label="Cambia tema"
      >
        <span class="sidebar__icon" aria-hidden="true">${renderIconByKey(iconLightKey)}</span>
      </button>
    `;
  }

  const isActive = item.id === activeId;
  return `
    <a
      class="sidebar__item${isActive ? " sidebar__item--active" : ""}"
      href="${item.href}"
      data-id="${item.id}"
      data-type="nav"
      ${isActive ? 'aria-current="page"' : ""}
    >
      <span class="sidebar__icon" aria-hidden="true">${renderIconFromUrl(item.icon)}</span>
      <span class="sidebar__label">${item.label}</span>
    </a>
  `;
}

export function setActive(element, id) {
  element.querySelectorAll('[data-type="nav"]').forEach(item => {
    const isActive = item.dataset.id === id;
    item.classList.toggle("sidebar__item--active", isActive);
    if (isActive) {
      item.setAttribute("aria-current", "page");
    } else {
      item.removeAttribute("aria-current");
    }
  });
}

export function init(element, { onNavigate } = {}) {
  element.querySelectorAll('[data-type="nav"]').forEach(item => {
    item.addEventListener("click", e => {
      e.preventDefault();
      setActive(element, item.dataset.id);
      if (onNavigate) onNavigate(item.dataset.id);
    });
  });

  const toggleBtn = element.querySelector('[data-type="toggle"]');
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const html = document.documentElement;
      const isDark = html.dataset.theme === "dark";
      const next = isDark ? "light" : "dark";
      html.dataset.theme = next;
      const icon = toggleBtn.querySelector(".sidebar__icon");
      const nextIconKey = next === "dark" ? toggleBtn.dataset.iconDark : toggleBtn.dataset.iconLight;
      icon.innerHTML = renderIconByKey(nextIconKey);
    });
  }
}

function getIconKeyFromUrl(url) {
  if (!url) return null;
  const filename = String(url).split("/").pop();
  if (!filename) return null;
  return filename.endsWith(".svg") ? filename.slice(0, -4) : filename;
}

function renderIconFromUrl(url) {
  return renderIconByKey(getIconKeyFromUrl(url));
}

function renderIconByKey(key) {
  return ICONS[key] || "";
}

const ICONS = {
  "M_": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 31 20" aria-hidden="true" focusable="false"><path d="M0 16.875L0.9375 0H6.82031L10.2305 14.4375H9.80859L13.2422 0H19.125L20.0625 16.875H16.5352L15.7852 2.57812H15.8203L12.2461 16.875H7.81641L4.24219 2.57812H4.27734L3.52734 16.875H0ZM21.0703 19.9102V16.875H30.2578V19.9102H21.0703Z" fill="currentColor"/></svg>',
  "filter": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" aria-hidden="true" focusable="false"><path d="M440-160q-17 0-28.5-11.5T400-200v-240L168-736q-15-20-4.5-42t36.5-22h560q26 0 36.5 22t-4.5 42L560-440v240q0 17-11.5 28.5T520-160h-80Zm40-308 198-252H282l198 252Zm0 0Z" fill="currentColor"/></svg>',
  "notification": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" aria-hidden="true" focusable="false"><path d="M200-200q-17 0-28.5-11.5T160-240q0-17 11.5-28.5T200-280h40v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h40q17 0 28.5 11.5T800-240q0 17-11.5 28.5T760-200H200Zm280-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" fill="currentColor"/></svg>',
  "account": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" aria-hidden="true" focusable="false"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-240v-32q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v32q0 33-23.5 56.5T720-160H240q-33 0-56.5-23.5T160-240Zm80 0h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" fill="currentColor"/></svg>',
  "light_mode": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" aria-hidden="true" focusable="false"><path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM80-440q-17 0-28.5-11.5T40-480q0-17 11.5-28.5T80-520h80q17 0 28.5 11.5T200-480q0 17-11.5 28.5T160-440H80Zm720 0q-17 0-28.5-11.5T760-480q0-17 11.5-28.5T800-520h80q17 0 28.5 11.5T920-480q0 17-11.5 28.5T880-440h-80ZM480-760q-17 0-28.5-11.5T440-800v-80q0-17 11.5-28.5T480-920q17 0 28.5 11.5T520-880v80q0 17-11.5 28.5T480-760Zm0 720q-17 0-28.5-11.5T440-80v-80q0-17 11.5-28.5T480-200q17 0 28.5 11.5T520-160v80q0 17-11.5 28.5T480-40ZM226-678l-43-42q-12-11-11.5-28t11.5-29q12-12 29-12t28 12l42 43q11 12 11 28t-11 28q-11 12-27.5 11.5T226-678Zm494 495-42-43q-11-12-11-28.5t11-27.5q11-12 27.5-11.5T734-282l43 42q12 11 11.5 28T777-183q-12 12-29 12t-28-12Zm-42-495q-12-11-11.5-27.5T678-734l42-43q11-12 28-11.5t29 11.5q12 12 12 29t-12 28l-43 42q-12 11-28 11t-28-11ZM183-183q-12-12-12-29t12-28l43-42q12-11 28.5-11t27.5 11q12 11 11.5 27.5T282-226l-42 43q-11 12-28 11.5T183-183Zm297-297Z" fill="currentColor"/></svg>',
  "dark_mode": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" aria-hidden="true" focusable="false"><path d="M480-120q-151 0-255.5-104.5T120-480q0-138 90-239.5T440-838q13-2 23 3.5t16 14.5q6 9 6.5 21t-7.5 23q-17 26-25.5 55t-8.5 61q0 90 63 153t153 63q31 0 61.5-9t54.5-25q11-7 22.5-6.5T819-479q10 5 15.5 15t3.5 24q-14 138-117.5 229T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z" fill="currentColor"/></svg>'
};
