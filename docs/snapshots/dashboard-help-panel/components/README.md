# Components

Questa cartella contiene i componenti UI riusabili del progetto.
Ogni componente è pensato per essere portabile: si può copiare in un altro
progetto portando con sé struttura HTML, comportamento JS e stili CSS.

---

## Due tipi di componenti

### Componenti semplici

Non hanno comportamento interattivo proprio. Se vengono usati all'interno
di altri componenti, espongono una funzione `render(config)` nel proprio
file `.js` per permettere la composizione senza copia-incolla del markup.

- `render(config)` — riceve dati, restituisce stringa HTML. Nessun side effect.

Esempi: badge, link, avatar, tag, spinner.

```javascript
// components/link.js
export function render({ href, label, fontSize }) {
  const style = fontSize ? ` style="--link-font-size: ${fontSize}"` : '';
  return `<a href="${href}" class="link"${style}>${label}</a>`;
}
```

Uso da un altro componente:
```javascript
import { render as renderLink } from './link.js';

renderLink({ href: '#', label: 'vedi tutte', fontSize: 'var(--fs-14)' })
// → '<a href="#" class="link" style="--link-font-size: var(--fs-14)">vedi tutte</a>'
```

---

### Componenti interattivi

Hanno comportamento proprio (toggle, apertura/chiusura, focus trap, ecc.)
che richiede JavaScript. Espongono due funzioni: `render()` e `init()`.

- `render(config)` — riceve dati, restituisce stringa HTML. Nessun side effect.
- `init(element)` — riceve un elemento DOM già montato, attacca gli event listener.

Questa separazione garantisce che il componente sia testabile (si può testare
`render()` senza browser) e che l'HTML sia sempre generato prima che il JS
cerchi di attaccarsi ad esso.

**Esempio: dropdown custom**

```javascript
// components/dropdown.js
export function render({ label, options }) {
  return `
    <div class="dropdown" data-dropdown>
      <button class="dropdown__trigger" aria-haspopup="listbox" aria-expanded="false">
        ${label}
        <span class="dropdown__arrow" aria-hidden="true">▾</span>
      </button>
      <ul class="dropdown__menu" role="listbox">
        ${options.map(o => `
          <li class="dropdown__option" role="option" data-value="${o.value}">
            ${o.label}
          </li>
        `).join("")}
      </ul>
    </div>
  `;
}

export function init(element) {
  const trigger = element.querySelector(".dropdown__trigger");

  trigger.addEventListener("click", () => {
    const isOpen = element.classList.toggle("dropdown--open");
    trigger.setAttribute("aria-expanded", isOpen);
  });

  document.addEventListener("click", (e) => {
    if (!element.contains(e.target)) {
      element.classList.remove("dropdown--open");
      trigger.setAttribute("aria-expanded", false);
    }
  });

  element.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      element.classList.remove("dropdown--open");
      trigger.setAttribute("aria-expanded", false);
      trigger.focus();
    }
  });
}
```

Uso in `js/main.js`:
```javascript
import { render, init } from "../components/dropdown.js";

const wrapper = document.querySelector("#dropdown-wrapper");
wrapper.innerHTML = render({ label: "Seleziona...", options: [...] });
init(wrapper.querySelector("[data-dropdown]"));
```

---

## Struttura consigliata per componenti complessi

Se un componente cresce (ha molte varianti, stili estesi, logica articolata),
crea una sottocartella dedicata:

```
components/
└── dropdown/
    ├── dropdown.js    ← render() + init()
    ├── dropdown.css   ← stili del componente
    └── README.md      ← varianti, props, esempi (opzionale)
```

Per componenti semplici, un singolo file JS è sufficiente.
Gli stili di tutti i componenti semplici vivono nei rispettivi file `.css` in `components/`.
