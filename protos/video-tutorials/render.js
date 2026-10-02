const SNIPPET_RADIUS = 60;

// Minuscolo e senza accenti, mantenendo la stessa lunghezza del testo
// originale: così gli indici trovati nel testo normalizzato valgono anche
// per il testo da evidenziare.
export function normalize(text) {
  let result = '';
  for (const char of text.split('')) {
    result += char.normalize('NFD').charAt(0).toLowerCase().charAt(0);
  }
  return result;
}

// Le parole lunghe perdono le vocali finali, così "filtri" trova anche
// "filtro" e "rimuovo" trova anche "rimuovere".
export function parseQuery(query) {
  return normalize(query)
    .split(/\s+/)
    .filter(Boolean)
    .map((term) => (term.length >= 5 ? term.replace(/[aeiou]+$/, '') : term));
}

// "0:17 testo…" → { time: '0:17', text: 'testo…' }
export function parseTranscript(raw) {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^(\d+:\d{2})\s+(.*)$/);
      return match ? { time: match[1], text: match[2] } : { time: '', text: line };
    });
}

export function matchesQuery(video, terms) {
  const haystack = normalize(`${video.title} ${video.segments.map((s) => s.text).join(' ')}`);
  return terms.every((term) => haystack.includes(term));
}

// I video sono su CleanShot Cloud (dominio link.mucca.design): la stessa URL
// con "+" reindirizza al file mp4. Lo usiamo in un <video> nativo, perché il
// player incorporato di CleanShot non permette di partire da un minuto preciso.
// I video caricati in videos/ hanno invece il campo file.
export function toVideoSrc(video) {
  if (video.file) return video.file;
  return `${video.url.replace(/\/$/, '')}+`;
}

// "1:15" → 75
export function toSeconds(time) {
  const [minutes, seconds] = time.split(':').map(Number);
  return minutes * 60 + seconds;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function highlight(text, terms) {
  if (!terms.length) return escapeHtml(text);
  const plain = normalize(text);
  const marks = new Array(text.length).fill(false);
  terms.forEach((term) => {
    let from = 0;
    let index;
    while ((index = plain.indexOf(term, from)) !== -1) {
      for (let i = index; i < index + term.length; i++) marks[i] = true;
      from = index + term.length;
    }
  });

  let html = '';
  let open = false;
  for (let i = 0; i < text.length; i++) {
    if (marks[i] && !open) { html += '<mark>'; open = true; }
    if (!marks[i] && open) { html += '</mark>'; open = false; }
    html += escapeHtml(text[i]);
  }
  if (open) html += '</mark>';
  return html;
}

// Sceglie il segmento della trascrizione che contiene più termini
// e ne ritaglia un estratto attorno alla prima corrispondenza.
function findExcerpt(segments, terms) {
  let best = null;
  segments.forEach((segment) => {
    const plain = normalize(segment.text);
    const hits = terms.filter((term) => plain.includes(term));
    if (hits.length && (!best || hits.length > best.hits.length)) best = { segment, plain, hits };
  });
  if (!best) return null;

  const first = Math.min(...best.hits.map((term) => best.plain.indexOf(term)));
  const { text, time } = best.segment;
  const start = Math.max(0, first - SNIPPET_RADIUS);
  const end = Math.min(text.length, first + SNIPPET_RADIUS * 2);
  const prefix = start > 0 ? '…' : '';
  const suffix = end < text.length ? '…' : '';
  return { time, html: prefix + highlight(text.slice(start, end), terms) + suffix };
}

function renderExcerpt(video, terms) {
  if (!terms.length) {
    return video.summary ? `<span class="video-list__excerpt">${escapeHtml(video.summary)}</span>` : '';
  }
  const excerpt = findExcerpt(video.segments, terms);
  if (!excerpt) return '';
  const time = excerpt.time ? `<span class="video-list__time">${excerpt.time}</span> ` : '';
  return `<span class="video-list__excerpt">${time}${excerpt.html}</span>`;
}

function renderVideoItem(video, terms, activeId) {
  const activeClass = video.id === activeId ? ' video-list__item--active' : '';
  return `
    <li>
      <button type="button" class="video-list__item${activeClass}" data-video-id="${video.id}">
        <span class="video-list__title">
          <span class="video-list__number">${video.position}</span>
          <span>${highlight(video.title, terms)}</span>
        </span>
        ${renderExcerpt(video, terms)}
      </button>
    </li>`;
}

export function matchesFaq(faq, terms) {
  const haystack = normalize(`${faq.question} ${faq.answer}`);
  return terms.every((term) => haystack.includes(term));
}

function renderFaqItem(faq, terms, video) {
  const open = terms.length ? ' open' : '';
  return `
    <li>
      <details class="faq-list__item"${open}>
        <summary class="faq-list__question">${highlight(faq.question, terms)}</summary>
        <div class="faq-list__body">
          <p class="faq-list__answer">${highlight(faq.answer, terms)}</p>
          <button type="button" class="faq-list__video" data-faq-video="${faq.videoId}" data-faq-time="${faq.time}">
            <span class="faq-list__time">${faq.time}</span>
            <span>${escapeHtml(video?.title ?? '')}</span>
          </button>
        </div>
      </details>
    </li>`;
}

export function renderFaqList(faqs, query, videosById) {
  const terms = parseQuery(query);
  if (!faqs.length) return `<p class="video-empty">Nessuna domanda contiene “${escapeHtml(query.trim())}”.</p>`;
  return `<ul class="faq-list">${faqs.map((faq) => renderFaqItem(faq, terms, videosById[faq.videoId])).join('')}</ul>`;
}

export function renderCount(count, total, query, unit = 'video') {
  if (!query.trim()) return `${total} ${unit}`;
  return count === 1 ? '1 risultato' : `${count} risultati`;
}

export function renderVideoList(videos, query, activeId) {
  const terms = parseQuery(query);
  if (!videos.length) return renderEmpty(query);
  return `<ul class="video-list">${videos.map((video) => renderVideoItem(video, terms, activeId)).join('')}</ul>`;
}

export function renderEmpty(query) {
  if (!query.trim()) return '<p class="video-empty">Nessun video disponibile.</p>';
  return `<p class="video-empty">Nessun video contiene “${escapeHtml(query.trim())}”.</p>`;
}

export function renderPlayer(video) {
  if (!video) return '<p class="video-player__placeholder">Seleziona un video dalla lista.</p>';
  return `
    <div class="video-player__frame">
      <video src="${escapeHtml(toVideoSrc(video))}" title="${escapeHtml(video.title)}"
        controls preload="metadata" playsinline data-video-element></video>
    </div>
    <div class="video-player__meta">
      <h2 class="video-player__title">${escapeHtml(video.title)}</h2>
      ${video.summary ? `<p class="video-player__summary">${escapeHtml(video.summary)}</p>` : ''}
    </div>`;
}
