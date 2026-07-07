export const articleFormConfig = {
  title: "Aggiungi articolo",
  requiredNote: "* campo obbligatorio",
  fields: [
    {
      id: "link",
      label: "Link o ",
      labelLink: { text: "allega pdf", href: "#" },
      type: "text",
      required: true,
      placeholder: "https://corriere.com/draghi-vince"
    },
    {
      id: "testata",
      label: "Testata",
      type: "text",
      required: false,
      placeholder: "Corriere della sera"
    },
    {
      id: "titolo",
      label: "Titolo",
      type: "text",
      required: false,
      placeholder: "Draghi vince ancora!"
    },
    {
      id: "data-pubblicazione",
      label: "Data di pubblicazione",
      type: "text",
      required: false,
      placeholder: "19/5/2026"
    }
  ],
  actions: {
    cancel: "annulla",
    submit: "aggiungi"
  }
};

export const reportFormConfig = {
  title: "Invia report",
  senderName: "maria bianchi",
  senderEmail: "m.bianchi@comunicareplus.it",
  recipients: [
    { value: "", label: "Seleziona destinatario" },
    { value: "elviro@cliente.it", label: "Dottor Elviro (elviro@cliente.it)" },
    { value: "mario@cliente.it", label: "Mario Rossi (mario@cliente.it)" }
  ],
  subject: "[Progetto Draghi] - Report attività ufficio stampa 22-7-2025",
  linkText: "copia link a questo report",
  linkUrl: "http://mddr.com/345098",
  message: `Gentile Dottor Elviro,

siamo lieti di condividere con Lei i risultati dell'attività di comunicazione svolta.

Visualizza il report completo http://mddr.com/345098

Nel documento troverà l'analisi dettagliata delle pubblicazioni ottenute e i dati di reach.

Restiamo a disposizione per qualsiasi chiarimento o approfondimento.

Cordiali saluti,
Maria Bianchi
Account Manager Comunicare+ Agency
Tel. 02 1234567 | m.bianchi@comunicareplus.it`,
  saveAsTemplate: "salva come template",
  actions: {
    cancel: "annulla",
    submit: "invia report"
  }
};

export const collaboratorInviteConfig = {
  title: "Invita collaboratore",
  collaborators: [
    { id: "iris-rossi", name: "Iris Rossi" },
    { id: "margherita-bianchi", name: "Margherita Bianchi" }
  ],
  actions: {
    cancel: "annulla",
    submit: "condividi"
  }
};

export const guestInviteConfig = {
  title: "Invita ospite",
  senderName: "maria bianchi",
  senderEmail: "m.bianchi@comunicareplus.it",
  guests: [
    { value: "", label: "Seleziona email ospite" },
    { value: "ilaria@ospite.it", label: "Ilaria (ilaria@ospite.it)" },
    { value: "marco@ospite.it", label: "Marco (marco@ospite.it)" }
  ],
  subject: "Invito a visualizzare Progetto Draghi",
  actions: {
    cancel: "annulla",
    submit: "invita"
  }
};

export const navItems = [
  {
    "id": "dashboard",
    "label": "dashboard",
    "icon": "/assets/icons/M_.svg",
    "href": "#dashboard",
    "type": "nav"
  },
  {
    "id": "banca-dati",
    "label": "banca dati",
    "icon": "/assets/icons/filter.svg",
    "href": "#banca-dati",
    "type": "nav"
  },
  {
    "id": "sep-1",
    "type": "separator"
  },
  {
    "id": "spacer",
    "type": "spacer"
  },
  {
    "id": "sep-2",
    "type": "separator"
  },
  {
    "id": "notifiche",
    "label": "notifiche",
    "icon": "/assets/icons/notification.svg",
    "href": "#notifiche",
    "type": "nav"
  },
  {
    "id": "account",
    "label": "account",
    "icon": "/assets/icons/account.svg",
    "href": "#account",
    "type": "nav"
  },
  {
    "id": "sep-3",
    "type": "separator"
  },
  {
    "id": "theme",
    "label": "",
    "icon": "/assets/icons/light_mode.svg",
    "href": "",
    "type": "toggle",
    "iconDark": "/assets/icons/dark_mode.svg"
  }
];
