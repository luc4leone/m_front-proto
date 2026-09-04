import { render as renderLink } from './link.js';

function renderMetaItem({ label, value, inverted = false }) {
  const modifier = inverted ? ' meta__item--inverted' : '';
  return `<div class="meta__item${modifier}">
      <span class="meta__label">${label}</span>
      <span class="meta__value">${value}</span>
    </div>`;
}

function renderMeta(items) {
  return items.map(item =>
    item.group
      ? `<div class="meta__group">${item.group.map(renderMetaItem).join('')}</div>`
      : renderMetaItem(item)
  ).join('');
}

// badge accetta una stringa oppure { label, led } per il pallino di stato.
function renderBadge(badge) {
  if (badge == null) return '';
  if (typeof badge === 'string') return `<span class="badge">${badge}</span>`;
  const { label, led } = badge;
  if (!led) return `<span class="badge">${label}</span>`;
  return `<span class="badge-with-led"><span class="badge-with-led__led badge-with-led__led--${led}" aria-hidden="true"></span>${label}</span>`;
}

export function render({ category, title, links = [], meta = [], badge = null, chips = [] }) {
  const titleLink = renderLink({ href: title.href, label: title.label, fontSize: 'var(--fs-18)' });
  const secondaryLinks = links.map(l =>
    renderLink({ href: l.href, label: l.label, fontSize: 'var(--fs-14)' })
  ).join('');
  const chipsHtml = chips.map(c => `<span class="badge">${c}</span>`).join('');

  return `<article class="list-item"${category ? ` data-category="${category}"` : ''}>
    <div class="list-item__header">
      ${titleLink}
      ${chipsHtml}
      ${secondaryLinks}
      ${renderBadge(badge)}
    </div>
    <div class="list-item__meta">
      ${renderMeta(meta)}
    </div>
  </article>`;
}
