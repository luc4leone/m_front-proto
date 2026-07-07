function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderTable(journalists) {
  if (journalists.length === 0) {
    return `<p class="no-results">Nessun risultato.</p>`;
  }
  const rows = journalists.map(j => {
    const testate = Array.isArray(j.testate) ? j.testate.join(', ') : (j.testata || '');
    return `
    <tr>
      <td>${escapeHtml(j.nome)} ${escapeHtml(j.cognome)}</td>
      <td>${escapeHtml(testate)}</td>
      <td>${escapeHtml(j.ruolo)}</td>
      <td>${escapeHtml(j.servizio)}</td>
      <td>${escapeHtml(j.email)}</td>
      <td>${escapeHtml(j.telefono)}</td>
      <td class="cell--note">${escapeHtml((j.note || '').slice(0, 120))}</td>
    </tr>`;
  }).join('');

  return `
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Testate</th>
          <th>Ruolo</th>
          <th>Servizio</th>
          <th>Email</th>
          <th>Telefono</th>
          <th>Note</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

export function renderPagination(page, totalPages) {
  return `
    <div class="pagination">
      <button id="prev-btn"${page <= 1 ? ' disabled' : ''}>← Prec</button>
      <span>${page} / ${totalPages}</span>
      <button id="next-btn"${page >= totalPages ? ' disabled' : ''}>Succ →</button>
    </div>`;
}
