# Componenti UI (proto)

## Convenzioni

- I componenti usano naming `c-*`.
- Le varianti usano `--*`.
- Quando serve riusabilità JS, si preferiscono `data-*` attributes rispetto a ID.

---

## Link

### css

- nome classe
  - `.c-link`
- nome varianti
  - `.c-link--nav`
  - `.c-link--action`

### preview

#### markup

```html
<a href="#" class="c-link c-link--nav">link di navigazione</a>
<a href="#" class="c-link c-link--action">azione (button-like)</a>
```

---

## Contatore (pill)

### css

- nome classi
  - `.c-pill`
- note
  - esiste anche la classe legacy `.pill`

### preview

#### markup

```html
<span class="c-pill">12</span>
```

## Split Button

Split button composto da:

- **main action** (left)
- **toggle** (right)
- **menu** (dropdown)

### css

- nome classi
  - `.c-split-button`
  - `.c-split-button__main`
  - `.c-split-button__toggle`
  - `.c-split-button__menu`
  - `.c-split-button__arrow`
- nome varianti
  - `.c-split-button--menu-left` (menu allineato a sinistra del main)
- note
  - per le voci del menu usare `.c-link c-link--nav`

### preview

#### markup

```html
<span class="c-split-button" data-split-button>
  <button
    type="button"
    class="c-split-button__main c-link c-link--nav"
    data-split-action="primary"
  >
    azione principale
  </button>

  <button
    type="button"
    class="c-split-button__toggle"
    data-split-toggle
    aria-haspopup="listbox"
    aria-expanded="false"
  >
    <span class="c-split-button__arrow" aria-hidden="true"></span>
  </button>

  <div
    class="dropdown-list c-split-button__menu"
    data-split-menu
    role="listbox"
    aria-hidden="true"
  >
    <div class="dropdown-results">
      <div class="dropdown-item" role="option">
        <a href="#" class="c-link c-link--nav" data-split-action="opt-1">
          opzione 1
        </a>
      </div>
    </div>
  </div>
</span>
```

#### js

- Click su toggle apre/chiude il menu.
- Click fuori chiude.
- `Escape` chiude.
- Click su un elemento con `data-split-action` emette un evento:
  - `split-button-action` con `detail: { action }`.

#### Wiring esempio

```js
document
  .getElementById("mySplit")
  .addEventListener("split-button-action", (e) => {
    const action = e.detail.action;
    // switch(action) ...
  });
```
