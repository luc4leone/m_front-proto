// progetto.js
// Entry point per il prototipo protos/progetto.html

import { render as renderSidebar, init as initSidebar } from "../../../components/sidebar.js";
import { render as renderTabs, init as initTabs } from "../../../components/tabs.js";
import { navItems, articleFormConfig, reportFormConfig, collaboratorInviteConfig, guestInviteConfig } from "./data.js";
import { renderArticleForm, renderReportForm, renderCollaboratorInviteForm, renderGuestInviteForm } from "./render.js";

// ─── Dati ─────────────────────────────────────────────────────────────────────
const sectionTabs = [
  { id: "rassegna", label: "Rassegna stampa" },
  { id: "reports", label: "Reports inviati" }
];

// ─── Stato ────────────────────────────────────────────────────────────────────
let currentView = "dashboard";
let activeTab = "rassegna";

// ─── Mount ────────────────────────────────────────────────────────────────────
const sidebarHost = document.querySelector("#sidebar");
sidebarHost.innerHTML = renderSidebar({ items: navItems, activeId: null });

const tabsHost = document.querySelector("#section-tabs");
if (tabsHost) {
  tabsHost.innerHTML = renderTabs({ tabs: sectionTabs, activeId: activeTab });
}

// ─── Init ─────────────────────────────────────────────────────────────────────
initSidebar(sidebarHost.querySelector("[data-sidebar]"), {
  onNavigate: (id) => { currentView = id; }
});

if (tabsHost) {
  initTabs(tabsHost.querySelector("[data-tabs]"), {
    onTabChange: (id) => { activeTab = id; }
  });
}

const pressReleaseToggle = document.querySelector(".press-release__toggle");

if (pressReleaseToggle) {
  const collapsibleElements = document.querySelectorAll(".press-release__collapsible");

  pressReleaseToggle.addEventListener("click", () => {
    const isExpanded = pressReleaseToggle.getAttribute("aria-expanded") === "true";
    pressReleaseToggle.setAttribute("aria-expanded", !isExpanded);

    collapsibleElements.forEach((el) => {
      el.classList.toggle("is-hidden", isExpanded);
    });
  });
}

const pressReleaseHeader = document.querySelector(".press-release__header h3");
if (pressReleaseHeader) {
  pressReleaseHeader.addEventListener("click", () => {
    alert("apre side panel comunicato");
  });
  pressReleaseHeader.style.cursor = "pointer";
}

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
const modalHost = document.querySelector("#article-modal");
const addArticleBtn = document.querySelector("#add-article-btn");

if (modalHost && addArticleBtn) {
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

  addArticleBtn.addEventListener("click", openModal);
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
const collaboratorModalHost = document.querySelector("#collaborator-modal");
const editCollaboratorsBtn = document.querySelector("#edit-collaborators-btn");

if (collaboratorModalHost && editCollaboratorsBtn) {
  collaboratorModalHost.innerHTML = renderCollaboratorInviteForm(collaboratorInviteConfig);

  const overlay = collaboratorModalHost.querySelector("[data-collaborator-modal-overlay]");
  const closeBtn = collaboratorModalHost.querySelector("[data-collaborator-modal-close]");
  const cancelBtn = collaboratorModalHost.querySelector("[data-collaborator-modal-cancel]");
  const form = collaboratorModalHost.querySelector("[data-collaborator-form]");
  const projectStatusEl = document.querySelector(".project-header__status");

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

// ─── Remove Article Cards ─────────────────────────────────────────────────────
const articlesList = document.querySelector(".articles__list");
const articlesBadge = document.querySelector(".articles__header .badge");

if (articlesList) {
  articlesList.addEventListener("click", (e) => {
    const removeBtn = e.target.closest(".article-card__top .action-link");
    if (removeBtn) {
      const articleCard = removeBtn.closest(".article-card");
      if (articleCard) {
        articleCard.remove();

        if (articlesBadge) {
          const currentCount = parseInt(articlesBadge.textContent, 10) || 0;
          const newCount = Math.max(0, currentCount - 1);
          articlesBadge.textContent = newCount;
          articlesBadge.setAttribute("aria-label", `${newCount} articoli`);
        }
      }
    }
  });
}
