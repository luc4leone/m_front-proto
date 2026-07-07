// progetto.js
// Entry point per il prototipo protos/progetto.html

import { render as renderSidebar, init as initSidebar } from "../../../components/sidebar.js";
import { render as renderTabs, init as initTabs } from "../../../components/tabs.js";
import { navItems, articleFormConfig, reportFormConfig, collaboratorInviteConfig, guestInviteConfig, sentReports } from "./data.js";
import { renderArticleForm, renderReportForm, renderCollaboratorInviteForm, renderGuestInviteForm, renderReportsList } from "./render.js";

// ─── Dati ─────────────────────────────────────────────────────────────────────
const sectionTabs = [
  { id: "rassegna", label: "Rassegna stampa" },
  { id: "reports", label: "Reports inviati" }
];

// ─── Stato ────────────────────────────────────────────────────────────────────
let currentView = "dashboard";
let activeTab = "rassegna";

// ─── Mount ────────────────────────────────────────────────────────────────────
// Sidebar e tabs non sono nel markup statico: vengono generati da dati JS
// per mantenere separati contenuto e presentazione.
const sidebarHost = document.querySelector("#sidebar");
sidebarHost.innerHTML = renderSidebar({ items: navItems, activeId: null });

const tabsHost = document.querySelector("#section-tabs");
if (tabsHost) {
  tabsHost.innerHTML = renderTabs({ tabs: sectionTabs, activeId: activeTab, variant: 'large-highlight' });
}

// ─── Switch tab: contenuto statico vs dinamico ────────────────────────────────
// Il tab "rassegna" ha il suo markup già nel DOM statico (#press-releases-content).
// Il tab "reports" invece è generato dinamicamente da JS nel container #tab-content.
// switchTab alterna visibilità tra i due sistemi: mostra il contenuto statico
// nascondendo quello dinamico, o viceversa svuotando/renderizzando la lista reports.
const contentHost = document.querySelector("#tab-content");
const pressReleasesContainer = document.querySelector("#press-releases-content");

function switchTab(tabId) {
  activeTab = tabId;

  if (tabId === "rassegna") {
    if (pressReleasesContainer) pressReleasesContainer.style.display = "";
    if (contentHost) contentHost.innerHTML = "";
  } else if (tabId === "reports") {
    if (pressReleasesContainer) pressReleasesContainer.style.display = "none";
    if (contentHost) contentHost.innerHTML = renderReportsList(sentReports);
  }
}

// ─── Init ─────────────────────────────────────────────────────────────────────
// Attiva i behavior dei componenti solo dopo averli renderizzati nel DOM.
// Poi imposta subito il tab di default così la pagina mostra il contenuto corretto al caricamento.
initSidebar(sidebarHost.querySelector("[data-sidebar]"), {
  onNavigate: (id) => { currentView = id; }
});

if (tabsHost) {
  initTabs(tabsHost.querySelector("[data-tabs]"), {
    onTabChange: (id) => { switchTab(id); }
  });
  switchTab(activeTab);
}

// ─── Toggle espandi/collassa press release ────────────────────────────────────
// Ogni comunicato ha un toggle che controlla la visibilità dei contenuti collassabili.
// Se il comunicato ha una sezione articoli adiacente (nextElementSibling con classe .articles),
// la espande/collassa insieme per mantenere il raggruppamento logico.
document.querySelectorAll(".press-release").forEach((pressRelease) => {
  const toggle = pressRelease.querySelector(".press-release__toggle");
  if (!toggle) return;

  const scopes = [pressRelease];
  const nextSibling = pressRelease.nextElementSibling;
  if (nextSibling && nextSibling.classList.contains("articles")) {
    scopes.push(nextSibling);
  }

  toggle.addEventListener("click", () => {
    const isExpanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", !isExpanded);

    scopes.forEach((scope) => {
      scope.querySelectorAll(".press-release__collapsible").forEach((el) => {
        el.classList.toggle("is-hidden", isExpanded);
      });
    });
  });
});

// ─── Stub di interazione per il prototipo ─────────────────────────────────────
// Nel prototipo i click su titoli comunicato e articoli mostrano un alert
// per simulare le azioni future (apertura side panel / link esterno).
document.querySelectorAll(".press-release__header h3").forEach((header) => {
  header.addEventListener("click", () => {
    alert("apre side panel comunicato");
  });
  header.style.cursor = "pointer";
});

const articleCardTitles = document.querySelectorAll(".article-card__title");
articleCardTitles.forEach((title) => {
  title.addEventListener("click", () => {
    alert("apre link in un nuovo tab nel browser");
  });
  title.style.cursor = "pointer";
});

const projectTitleHost = document.querySelector("[data-project-title]");

if (projectTitleHost) {
  const titleEl = projectTitleHost.querySelector(".project-header__title");
  const inputEl = projectTitleHost.querySelector(".project-header__title-input");

  if (titleEl && inputEl) {
    const syncFromTitle = () => {
      inputEl.value = (titleEl.textContent || "").trim();
    };

    const commitToTitle = () => {
      const next = inputEl.value.trim();
      if (next) titleEl.textContent = next;
      syncFromTitle();
    };

    projectTitleHost.addEventListener("mouseenter", () => {
      if (document.activeElement === inputEl) return;
      syncFromTitle();
      projectTitleHost.classList.add("is-hover");
    });

    projectTitleHost.addEventListener("mouseleave", () => {
      if (document.activeElement === inputEl) return;
      projectTitleHost.classList.remove("is-hover");
    });

    projectTitleHost.addEventListener("click", () => {
      syncFromTitle();
      projectTitleHost.classList.add("is-hover");
      projectTitleHost.classList.add("is-editing");
      requestAnimationFrame(() => {
        inputEl.focus();
        inputEl.select();
      });
    });

    inputEl.addEventListener("blur", () => {
      commitToTitle();
      projectTitleHost.classList.remove("is-editing");
      projectTitleHost.classList.remove("is-hover");
    });

    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") inputEl.blur();

      if (e.key === "Escape") {
        syncFromTitle();
        inputEl.blur();
      }
    });
  }
}

// ─── Article Modal ────────────────────────────────────────────────────────────
// La modale è generata dinamicamente invece di stare nel markup statico:
// così la stessa configurazione di form può essere riutilizzata e mantenuta
// in un unico posto (render.js).
const modalHost = document.querySelector("#article-modal");
const addArticleBtns = document.querySelectorAll(".js-add-article-btn");

if (modalHost && addArticleBtns.length > 0) {
  modalHost.innerHTML = renderArticleForm(articleFormConfig);

  const overlay = modalHost.querySelector("[data-modal-overlay]");
  const closeBtn = modalHost.querySelector("[data-modal-close]");
  const cancelBtn = modalHost.querySelector("[data-modal-cancel]");
  const form = modalHost.querySelector("[data-article-form]");
  const attachLink = modalHost.querySelector(".form__label-link");

  const openModal = () => {
    overlay.classList.add("is-visible");
    const firstInput = form.querySelector("input");
    if (firstInput) firstInput.focus();
  };

  const closeModal = () => {
    overlay.classList.remove("is-visible");
    form.reset();
  };

  addArticleBtns.forEach((btn) => btn.addEventListener("click", openModal));
  closeBtn.addEventListener("click", closeModal);
  cancelBtn.addEventListener("click", closeModal);

  if (attachLink) {
    attachLink.addEventListener("click", (e) => {
      e.preventDefault();
      alert("apre Esplora risorse / Finder");
    });
  }

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("is-visible")) {
      closeModal();
    }
  });
}

// ─── Report Modal ─────────────────────────────────────────────────────────────
// Render dinamico del form "Invia report" nel suo host, come gli altri modali.
const reportModalHost = document.querySelector("#report-modal");
const sendReportBtn = document.querySelector("#send-report-btn");

if (reportModalHost && sendReportBtn) {
  reportModalHost.innerHTML = renderReportForm(reportFormConfig);

  const overlay = reportModalHost.querySelector("[data-report-modal-overlay]");
  const closeBtn = reportModalHost.querySelector("[data-report-modal-close]");
  const cancelBtn = reportModalHost.querySelector("[data-report-modal-cancel]");
  const form = reportModalHost.querySelector("[data-report-form]");

  const openModal = () => {
    overlay.classList.add("is-visible");
    const firstInput = form.querySelector("select");
    if (firstInput) firstInput.focus();
  };

  const closeModal = () => {
    overlay.classList.remove("is-visible");
    form.reset();
  };

  sendReportBtn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  cancelBtn.addEventListener("click", closeModal);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("is-visible")) {
      closeModal();
    }
  });
}

// ─── Collaborator Invite Modal ────────────────────────────────────────────────
// Render dinamico della modale "Condividi progetto". Include anche un aggiornamento
// in tempo reale del badge di stato (privato/condiviso) in base alle checkbox selezionate.
const collaboratorModalHost = document.querySelector("#collaborator-modal");
const editCollaboratorsBtn = document.querySelector("#edit-collaborators-btn");

if (collaboratorModalHost && editCollaboratorsBtn) {
  collaboratorModalHost.innerHTML = renderCollaboratorInviteForm(collaboratorInviteConfig);

  const overlay = collaboratorModalHost.querySelector("[data-collaborator-modal-overlay]");
  const closeBtn = collaboratorModalHost.querySelector("[data-collaborator-modal-close]");
  const cancelBtn = collaboratorModalHost.querySelector("[data-collaborator-modal-cancel]");
  const form = collaboratorModalHost.querySelector("[data-collaborator-form]");
  const projectStatusEl = document.querySelector(".project-header__status");
  const projectShareEl = document.querySelector(".project-header__share");

  const openModal = () => {
    overlay.classList.add("is-visible");
    const firstCheckbox = form.querySelector("input[type=\"checkbox\"]");
    if (firstCheckbox) firstCheckbox.focus();
  };

  const closeModal = () => {
    overlay.classList.remove("is-visible");
    form.reset();
  };

  const updateProjectStatus = () => {
    if (!projectStatusEl) return;
    const checkboxes = form.querySelectorAll("input[type=\"checkbox\"]");
    const hasSelection = Array.from(checkboxes).some(cb => cb.checked);
    if (hasSelection) {
      projectStatusEl.innerHTML = `<img src="../../assets/icons/people.svg" alt="" aria-hidden="true" />progetto condiviso`;
    } else {
      projectStatusEl.innerHTML = `<img src="../../assets/icons/lock.svg" alt="" aria-hidden="true" />progetto privato`;
    }
    if (projectShareEl) {
      projectShareEl.classList.toggle("project-header__share--shared", hasSelection);
    }
  };

  form.addEventListener("change", (e) => {
    if (e.target.matches("input[type=\"checkbox\"]")) {
      updateProjectStatus();
    }
  });

  editCollaboratorsBtn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  cancelBtn.addEventListener("click", closeModal);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("is-visible")) {
      closeModal();
    }
  });
}

// ─── Guest Invite Modal ───────────────────────────────────────────────────────
// Render dinamico della modale "Invita ospite".
const guestModalHost = document.querySelector("#invite-guest-modal");
const inviteGuestBtn = document.querySelector("#invite-guest-btn");

if (guestModalHost && inviteGuestBtn) {
  guestModalHost.innerHTML = renderGuestInviteForm(guestInviteConfig);

  const overlay = guestModalHost.querySelector("[data-guest-modal-overlay]");
  const closeBtn = guestModalHost.querySelector("[data-guest-modal-close]");
  const cancelBtn = guestModalHost.querySelector("[data-guest-modal-cancel]");
  const form = guestModalHost.querySelector("[data-guest-form]");

  const openModal = () => {
    overlay.classList.add("is-visible");
    const select = form.querySelector("select");
    if (select) select.focus();
  };

  const closeModal = () => {
    overlay.classList.remove("is-visible");
    form.reset();
  };

  inviteGuestBtn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  cancelBtn.addEventListener("click", closeModal);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("is-visible")) {
      closeModal();
    }
  });
}

// ─── Rimozione articoli con aggiornamento contatore ───────────────────────────
// Permette di rimuovere singole card articolo cliccando sul link "Rimuovi".
// Aggiorna in tempo reale anche il badge contatore nella header della sezione
// per dare feedback visivo immediato sulla variazione della lista.
document.querySelectorAll(".articles").forEach((articlesSection) => {
  const articlesList = articlesSection.querySelector(".articles__list");
  const articlesBadge = articlesSection.querySelector(".articles__header .badge");
  if (!articlesList) return;

  articlesList.addEventListener("click", (e) => {
    const removeBtn = e.target.closest(".article-card__top .action-link");
    if (!removeBtn) return;

    const articleCard = removeBtn.closest(".article-card");
    if (!articleCard) return;

    articleCard.remove();

    if (articlesBadge) {
      const currentCount = parseInt(articlesBadge.textContent, 10) || 0;
      const newCount = Math.max(0, currentCount - 1);
      articlesBadge.textContent = newCount;
      articlesBadge.setAttribute("aria-label", `${newCount} articoli`);
    }
  });
});

// ─── Stats percentage toggle ──────────────────────────────────────────────────
// Ogni blocco .stats--inline ha un proprio toggle che alterna valori
// raw vs percent per le metriche con data-percent.
document.querySelectorAll(".stats--inline[data-stats-toggle]").forEach((container) => {
  const btn = container.querySelector("[data-toggle-btn]");
  if (!btn) return;

  let isPercentage = false;

  btn.addEventListener("click", () => {
    isPercentage = !isPercentage;

    container.querySelectorAll(".meta__value[data-percent]").forEach((el) => {
      const raw = el.dataset.raw;
      const percent = el.dataset.percent;
      el.textContent = isPercentage ? percent + "%" : raw;
    });

    btn.querySelector(".action-link__label").textContent = isPercentage ? "nominale" : "%";
  });
});
