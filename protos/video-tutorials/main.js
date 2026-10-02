import { videos as videoData, faqs } from './data.js';
import {
  parseQuery, parseTranscript, matchesQuery, matchesFaq, toSeconds,
  renderVideoList, renderFaqList, renderPlayer, renderCount,
} from './render.js';

const searchInput = document.querySelector('[data-video-search]');
const countEl = document.querySelector('[data-video-count]');
const listEl = document.querySelector('[data-video-list]');
const playerEl = document.querySelector('[data-video-player]');
const faqCountEl = document.querySelector('[data-faq-count]');
const faqListEl = document.querySelector('[data-faq-list]');

let videos = [];
let videosById = {};
let activeId = videoData[0]?.id ?? null;
let debounceTimer;

async function loadTranscript(video) {
  try {
    const response = await fetch(video.transcript);
    if (!response.ok) throw new Error(response.statusText);
    return parseTranscript(await response.text());
  } catch (error) {
    console.warn(`Trascrizione non caricata: ${video.transcript}`, error);
    return [];
  }
}

function renderVideos() {
  const query = searchInput.value;
  const terms = parseQuery(query);
  const filtered = terms.length ? videos.filter((video) => matchesQuery(video, terms)) : videos;
  countEl.textContent = renderCount(filtered.length, videos.length, query);
  listEl.innerHTML = renderVideoList(filtered, query, activeId);
}

function renderFaqs() {
  const query = searchInput.value;
  const terms = parseQuery(query);
  const filtered = terms.length ? faqs.filter((faq) => matchesFaq(faq, terms)) : faqs;
  faqCountEl.textContent = renderCount(filtered.length, faqs.length, query, 'domande');
  faqListEl.innerHTML = renderFaqList(filtered, query, videosById);
}

function renderActivePlayer() {
  playerEl.innerHTML = renderPlayer(videosById[activeId]);
}

// Porta il video al minuto indicato e lo avvia. Se i metadati non sono
// ancora caricati, aspetta che lo siano prima di spostarsi.
function playFrom(time) {
  const videoEl = playerEl.querySelector('[data-video-element]');
  if (!videoEl) return;
  const start = () => {
    videoEl.currentTime = toSeconds(time);
    videoEl.play().catch(() => {});
  };
  if (videoEl.readyState >= 1) start();
  else videoEl.addEventListener('loadedmetadata', start, { once: true });
}

function selectVideo(id, time = null) {
  if (id !== activeId) {
    activeId = id;
    renderVideos();
    renderActivePlayer();
  }
  if (time) playFrom(time);
}

searchInput.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    renderVideos();
    renderFaqs();
  }, 120);
});

listEl.addEventListener('click', (event) => {
  const item = event.target.closest('[data-video-id]');
  if (item) selectVideo(item.dataset.videoId);
});

faqListEl.addEventListener('click', (event) => {
  const link = event.target.closest('[data-faq-video]');
  if (link) selectVideo(link.dataset.faqVideo, link.dataset.faqTime);
});

videos = await Promise.all(
  videoData.map(async (video, index) => ({
    ...video,
    position: index + 1,
    segments: await loadTranscript(video),
  }))
);
videosById = Object.fromEntries(videos.map((video) => [video.id, video]));
renderVideos();
renderFaqs();
renderActivePlayer();
