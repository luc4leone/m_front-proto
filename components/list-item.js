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

// badge accetta una stringa oppure { label, led, count }: led disegna il
// pallino di stato, count aggiunge il contatore evidenziato dopo la label.
function renderBadge(badge) {
  if (badge == null) return '';
  if (typeof badge === 'string') return `<span class="badge">${badge}</span>`;
  const { label, led, count } = badge;
  const countHtml = count == null ? '' : `<span class="badge__count">${count}</span>`;
  if (!led) return `<span class="badge">${label}${countHtml}</span>`;
  return `<span class="badge-with-led"><span class="badge-with-led__led badge-with-led__led--${led}" aria-hidden="true"></span>${label}${countHtml}</span>`;
}

// badge accetta anche un array, per mostrare piu' badge affiancati.
function renderBadges(badge) {
  if (badge == null) return '';
  return (Array.isArray(badge) ? badge : [badge]).map(renderBadge).join('');
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
      ${renderBadges(badge)}
    </div>
    <div class="list-item__meta">
      ${renderMeta(meta)}
    </div>
  </article>`;
}
