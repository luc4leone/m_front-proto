export function render({ category, label, done = false, meta = [] }) {
  const doneClass = done ? ' todo-item--done' : '';
  const categoryAttr = category ? ` data-category="${category}"` : '';
  const metaHtml = meta.map(({ label: l, value }) =>
    `<div class="meta__item"><span class="meta__label">${l}</span><span class="meta__value">${value}</span></div>`
  ).join('');

  return `<article class="todo-item${doneClass}"${categoryAttr}>
    <div class="todo-item__row1">
      <label class="todo-item__check">
        <input type="checkbox" class="form__checkbox"${done ? ' checked' : ''} />
        <span class="todo-item__label">${label}</span>
      </label>
      <a href="#" class="action-link">modifica</a>
    </div>
    <div class="todo-item__row2">
      ${metaHtml}
    </div>
  </article>`;
}
