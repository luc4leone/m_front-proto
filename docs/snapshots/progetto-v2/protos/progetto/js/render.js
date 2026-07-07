export function renderReportForm(config) {
  const recipientOptions = config.recipients.map(r =>
    `<option value="${r.value}">${r.label}</option>`
  ).join('');

  return `
    <div class="modal__overlay" data-report-modal-overlay>
      <div class="modal modal--wide" role="dialog" aria-modal="true" aria-labelledby="report-modal-title">
        <div class="modal__header">
          <h2 class="modal__title" id="report-modal-title">${config.title}</h2>
          <button type="button" class="modal__close" data-report-modal-close aria-label="Chiudi">
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <form class="form form--report" data-report-form>
          <div class="form__fields">
            <div class="form__field">
              <label class="form__label" for="sender-name">Nome mittente</label>
              <input
                type="text"
                id="sender-name"
                name="senderName"
                class="form__input form__input--readonly"
                value="${config.senderName}"
                readonly
                tabindex="-1"
              />
            </div>

            <div class="form__field">
              <label class="form__label" for="sender-email">Email mittente</label>
              <input
                type="email"
                id="sender-email"
                name="senderEmail"
                class="form__input form__input--readonly"
                value="${config.senderEmail}"
                readonly
                tabindex="-1"
              />
            </div>

            <div class="form__field">
              <label class="form__label" for="recipient">Email destinatario</label>
              <div class="form__select-wrapper">
                <select
                  id="recipient"
                  name="recipient"
                  class="form__select"
                >
                  ${recipientOptions}
                </select>
              </div>
            </div>

            <div class="form__field">
              <label class="form__label" for="subject">Oggetto email</label>
              <input
                type="text"
                id="subject"
                name="subject"
                class="form__input"
                value="${config.subject}"
              />
            </div>

            <div class="form__field form__field--link">
              <button type="button" class="action-link">
                <span class="action-link__icon" aria-hidden="true">
                  <img src="../../assets/icons/content_copy.svg" alt="" />
                </span>
                <span class="action-link__label">${config.linkText}</span>
              </button>
            </div>

            <div class="form__field">
              <textarea
                id="message"
                name="message"
                class="form__textarea"
                rows="12"
              >${config.message}</textarea>
            </div>

            <div class="form__field form__field--checkbox">
              <label class="form__checkbox-label">
                <input
                  type="checkbox"
                  name="saveTemplate"
                  class="form__checkbox"
                />
                <span class="form__checkbox-text">${config.saveAsTemplate}</span>
              </label>
            </div>
          </div>

          <div class="form__actions">
            <button type="button" class="action-link" data-report-modal-cancel>
              ${config.actions.cancel}
            </button>
            <button type="submit" class="action-link action-link--primary">
              ${config.actions.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

export function renderGuestInviteForm(config) {
  const guestOptions = config.guests.map(g =>
    `<option value="${g.value}">${g.label}</option>`
  ).join('');

  return `
    <div class="modal__overlay" data-guest-modal-overlay>
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="guest-modal-title">
        <div class="modal__header">
          <h2 class="modal__title" id="guest-modal-title">${config.title}</h2>
          <button type="button" class="modal__close" data-guest-modal-close aria-label="Chiudi">
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <form class="form" data-guest-form>
          <div class="form__fields">
            <div class="form__field">
              <label class="form__label" for="guest-sender-name">Nome mittente</label>
              <input
                type="text"
                id="guest-sender-name"
                name="senderName"
                class="form__input form__input--readonly"
                value="${config.senderName}"
                readonly
                tabindex="-1"
              />
            </div>

            <div class="form__field">
              <label class="form__label" for="guest-sender-email">Email mittente</label>
              <input
                type="email"
                id="guest-sender-email"
                name="senderEmail"
                class="form__input form__input--readonly"
                value="${config.senderEmail}"
                readonly
                tabindex="-1"
              />
            </div>

            <div class="form__field">
              <label class="form__label" for="guest-email">Email ospite</label>
              <div class="form__select-wrapper">
                <select
                  id="guest-email"
                  name="guestEmail"
                  class="form__select"
                >
                  ${guestOptions}
                </select>
              </div>
            </div>

            <div class="form__field">
              <label class="form__label" for="guest-subject">Oggetto email</label>
              <input
                type="text"
                id="guest-subject"
                name="subject"
                class="form__input form__input--prefilled"
                value="${config.subject}"
              />
            </div>
          </div>
          <div class="form__actions">
            <button type="button" class="action-link" data-guest-modal-cancel>
              ${config.actions.cancel}
            </button>
            <button type="submit" class="action-link action-link--primary">
              ${config.actions.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

export function renderCollaboratorInviteForm(config) {
  const collaboratorsHtml = config.collaborators.map(c => `
    <div class="form__field form__field--checkbox">
      <label class="form__checkbox-label">
        <input
          type="checkbox"
          name="collaborators"
          value="${c.id}"
          class="form__checkbox"
        />
        <span class="form__checkbox-text">${c.name}</span>
      </label>
    </div>
  `).join('');

  return `
    <div class="modal__overlay" data-collaborator-modal-overlay>
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="collaborator-modal-title">
        <div class="modal__header">
          <h2 class="modal__title" id="collaborator-modal-title">${config.title}</h2>
          <button type="button" class="modal__close" data-collaborator-modal-close aria-label="Chiudi">
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <form class="form" data-collaborator-form>
          <div class="form__fields">
            ${collaboratorsHtml}
          </div>
          <div class="form__actions">
            <button type="button" class="action-link" data-collaborator-modal-cancel>
              ${config.actions.cancel}
            </button>
            <button type="submit" class="action-link action-link--primary">
              ${config.actions.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

export function renderReportsList(reports) {
  const reportsHtml = reports.map(report => `
    <article class="report-card" data-report-id="${report.id}">
      <h3 class="report-card__title">${report.title}</h3>
      <dl class="meta report-card__meta">
        <div class="meta__item">
          <dt class="meta__label">Spedito il</dt>
          <dd class="meta__value">${report.sentDate}</dd>
        </div>
      </dl>
    </article>
  `).join('');

  return `
    <section class="reports-list" aria-label="Reports inviati">
      ${reportsHtml}
    </section>
  `;
}

export function renderArticleForm(config) {
  const fieldsHtml = config.fields.map(field => {
    const labelHtml = field.labelLink
      ? `${field.label}<a href="${field.labelLink.href}" class="form__label-link">${field.labelLink.text}</a>`
      : field.label;
    return `
    <div class="form__field">
      <label class="form__label" for="${field.id}">
        ${labelHtml}${field.required ? ' <span class="form__required">*</span>' : ''}
      </label>
      <input
        type="${field.type}"
        id="${field.id}"
        name="${field.id}"
        class="form__input"
        ${field.required ? 'required' : ''}
        ${field.placeholder ? `placeholder="${field.placeholder}"` : ''}
      />
    </div>
  `}).join('');

  return `
    <div class="modal__overlay" data-modal-overlay>
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal__header">
          <div>
            <h2 class="modal__title" id="modal-title">${config.title}</h2>
            <p class="modal__subtitle">${config.requiredNote}</p>
          </div>
          <button type="button" class="modal__close" data-modal-close aria-label="Chiudi">
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <form class="form" data-article-form>
          <div class="form__fields">
            ${fieldsHtml}
          </div>
          <div class="form__actions">
            <button type="button" class="action-link" data-modal-cancel>
              ${config.actions.cancel}
            </button>
            <button type="submit" class="action-link action-link--primary">
              ${config.actions.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}
