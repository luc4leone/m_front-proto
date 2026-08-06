export function render({ label, variant = 'green' }) {
  const ledClass = variant === 'red'
    ? 'badge-with-led__led--red'
    : 'badge-with-led__led--green';
  return `<span class="badge-with-led"><span class="badge-with-led__led ${ledClass}" aria-hidden="true"></span>${label}</span>`;
}
