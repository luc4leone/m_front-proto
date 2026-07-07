export function render({ href, label, fontSize }) {
  const style = fontSize ? ` style="--link-font-size: ${fontSize}"` : '';
  return `<a href="${href}" class="link"${style}>${label}</a>`;
}
