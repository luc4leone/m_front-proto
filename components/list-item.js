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
      ${badge != null ? `<span class="badge">${badge}</span>` : ''}
    </div>
    <div class="list-item__meta">
      ${renderMeta(meta)}
    </div>
  </article>`;
}
