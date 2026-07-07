#!/usr/bin/env node
/**
 * scripts/snapshot.js
 *
 * Genera snapshot navigabili da tag git con prefisso "proto/".
 *
 * Convenzione tag:   proto/<nome-proto>/<label>
 *   es. proto/progetto/v1, proto/progetto/hero-revamp
 *
 * Dove <nome-proto> è il nome della cartella dentro protos/.
 *
 * Workflow:
 *   1. Tagga un commit:   git tag -a proto/progetto/v1 -m "%nome-proto-v1%"
 *   2. Esegui lo script:  npm run snapshot
 *   3. Apri in locale:    npm run history
 *      oppure pubblica:   commit docs/ → GitHub Pages o Netlify
 *
 * Struttura di ogni snapshot (preserva i path relativi del proto):
 *   docs/snapshots/<slug>/
 *     protos/<nome-proto>/
 *     css/
 *     assets/
 *     components/
 *
 * Output:
 *   docs/snapshots/<slug>/       ← copia autocontenuta del prototipo
 *   docs/design-history.html     ← indice navigabile con tutti gli snapshot
 */

import { execSync } from 'child_process';
import { mkdirSync, writeFileSync, existsSync, rmSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import os from 'os';

// ─── Configurazione ────────────────────────────────────────────────────────

const ROOT     = resolve(process.cwd());
const DOCS     = join(ROOT, 'docs');
const SNAPSHOTS = join(DOCS, 'snapshots');
const TAG_PREFIX = 'proto/';

// Risorse condivise (a root) incluse in ogni snapshot.
// La cartella del singolo prototipo (protos/<nome>/) viene aggiunta dinamicamente.
const SHARED = ['css', 'assets', 'components'];


// ─── Utilities ─────────────────────────────────────────────────────────────

function run(cmd, opts = {}) {
  return execSync(cmd, { cwd: ROOT, encoding: 'utf-8', ...opts }).trim();
}

function slugify(tag) {
  return tag.replace(TAG_PREFIX, '').replace(/\//g, '-');
}

// Estrae il nome del prototipo dal tag: proto/<nome>/<label> → <nome>
function parseProtoName(tag) {
  const rest = tag.slice(TAG_PREFIX.length); // es. "progetto/v1"
  const firstSegment = rest.split('/')[0];
  return firstSegment || null;
}


// ─── Git helpers ───────────────────────────────────────────────────────────

function getProtoTags() {
  try {
    const out = run(`git tag --list "${TAG_PREFIX}*" --sort=creatordate`);
    return out ? out.split('\n').filter(Boolean) : [];
  } catch {
    return [];
  }
}

function getTagMessage(tag) {
  try {
    // Annotated tags hanno un messaggio; lightweight tags no
    const msg = run(`git tag -l --format="%(contents:subject)" "${tag}"`);
    return msg || slugify(tag);
  } catch {
    return tag;
  }
}

function getTagDate(tag) {
  try {
    const iso = run(`git log -1 --format="%ai" "${tag}"`);
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('it-IT', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  } catch {
    return '';
  }
}

function getTagHash(tag) {
  try {
    return run(`git rev-list -n 1 "${tag}"`).slice(0, 7);
  } catch {
    return '';
  }
}


// ─── Snapshot ──────────────────────────────────────────────────────────────

function findHtmlFiles(dir) {
  try {
    const files = readdirSync(dir, { withFileTypes: true });
    return files
      .filter(f => f.isFile() && f.name.endsWith('.html'))
      .map(f => f.name)
      .sort();
  } catch {
    return [];
  }
}

function createSnapshot(tag) {
  const name      = slugify(tag);
  const protoName = parseProtoName(tag);
  const destDir   = join(SNAPSHOTS, name);
  const tmpDir    = join(os.tmpdir(), `proto-snapshot-${name}-${Date.now()}`);

  process.stdout.write(`  ${tag.padEnd(36)} → snapshots/${name}/  `);

  if (!protoName) {
    console.log(`✗ tag non valido (atteso ${TAG_PREFIX}<nome>/<label>)`);
    return null;
  }

  try {
    // Crea un worktree temporaneo isolato (non tocca il working directory)
    run(`git worktree add "${tmpDir}" "${tag}" --detach`);

    // Verifica che la cartella del prototipo esista in quel commit
    const protoSrc = join(tmpDir, 'protos', protoName);
    if (!existsSync(protoSrc)) {
      console.log(`✗ protos/${protoName}/ non trovato nel commit`);
      return null;
    }

    // Pulisce e ricrea la destinazione
    if (existsSync(destDir)) rmSync(destDir, { recursive: true });
    mkdirSync(destDir, { recursive: true });

    // Copia la cartella del prototipo preservando il path protos/<nome>/
    // così i link relativi ../../css ecc. continuano a risolvere.
    const protoDest = join(destDir, 'protos', protoName);
    mkdirSync(join(destDir, 'protos'), { recursive: true });
    run(`cp -r "${protoSrc}" "${protoDest}"`);

    // Copia le risorse condivise dalla root
    let copied = 1;
    for (const item of SHARED) {
      const src = join(tmpDir, item);
      if (existsSync(src)) {
        run(`cp -r "${src}" "${destDir}/"`);
        copied++;
      }
    }

    // Trova tutti i file HTML nella cartella del prototipo
    const htmlFiles = findHtmlFiles(protoDest);

    console.log(`✓ (${copied} elementi, ${htmlFiles.length} pagine)`);

    return {
      tag,
      name,
      protoName,
      message: getTagMessage(tag),
      date:    getTagDate(tag),
      hash:    getTagHash(tag),
      htmlFiles,
    };

  } catch (err) {
    console.log(`✗ ${err.message}`);
    return null;

  } finally {
    // Rimuove sempre il worktree temporaneo
    try { run(`git worktree remove "${tmpDir}" --force`); } catch {}
  }
}


// ─── Design history HTML ───────────────────────────────────────────────────

function generateIndex(snapshots) {
  const projectName = (() => {
    try {
      const pkg = JSON.parse(run('cat package.json'));
      return pkg.name || 'Progetto';
    } catch { return 'Progetto'; }
  })();

  const count = snapshots.length;

  const cards = snapshots.map(({ tag, name, protoName, message, date, hash, htmlFiles }) => {
    const links = htmlFiles.map(file => {
      const href = `snapshots/${name}/protos/${protoName}/${file}`;
      const label = file === 'index.html' ? 'Prototipo' : file.replace('.html', '');
      const btnClass = file === 'index.html' ? 'btn-primary' : 'btn-secondary';
      return `<a class="${btnClass}" href="${href}" target="_blank">${label}</a>`;
    }).join('');

    return `
    <article class="card">
      <div class="card__body">
        <h2 class="card__title">${message}</h2>
        <div class="card__meta">
          <span class="tag">${tag}</span>
          ${hash ? `<span class="hash">${hash}</span>` : ''}
          ${date ? `<span class="date">${date}</span>` : ''}
        </div>
      </div>
      <div class="card__actions">
        ${links}
      </div>
    </article>`;
  }).join('\n');

  const emptyState = `
    <div class="empty">
      <p>Nessun prototipo trovato.</p>
      <p>Crea un tag per iniziare:</p>
      <pre><code>git tag -a proto/nome/v1 -m "Descrizione del prototipo"
npm run snapshot</code></pre>
    </div>`;

  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Design History — ${projectName}</title>
  <style>
    /* Reset minimale */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    a { color: inherit; text-decoration: none; }

    /* Token inline — stessa palette del progetto */
    :root {
      --color-primary:        #3b5bdb;
      --color-primary-hover:  #364fc7;
      --color-primary-subtle: #e7edff;
      --color-background:     #f8f9fa;
      --color-surface:        #ffffff;
      --color-text:           #1a1a2e;
      --color-text-muted:     #6b7280;
      --color-border:         #dee2e6;
      --font:    'Inter', system-ui, sans-serif;
      --mono:    'JetBrains Mono', monospace;
      --radius:  8px;
      --shadow:  0 4px 12px rgba(0,0,0,.08);
    }

    body {
      font-family: var(--font);
      background: var(--color-background);
      color: var(--color-text);
      line-height: 1.6;
      padding: 48px 40px;
      min-height: 100vh;
    }

    /* Header */
    .header {
      margin-bottom: 48px;
      padding-bottom: 24px;
      border-bottom: 2px solid var(--color-border);
    }
    .header__title {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 6px;
    }
    .header__sub {
      color: var(--color-text-muted);
      font-size: .9375rem;
    }

    /* Grid */
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    /* Card */
    .card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      transition: box-shadow 150ms ease;
    }
    .card:hover { box-shadow: var(--shadow); }

    .card__body { display: flex; flex-direction: column; gap: 8px; flex: 1; }

    .card__title {
      font-size: 1rem;
      font-weight: 600;
      line-height: 1.4;
    }

    .card__meta {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      align-items: center;
    }

    .tag {
      font-family: var(--mono);
      font-size: .7rem;
      background: var(--color-primary-subtle);
      color: var(--color-primary);
      padding: 2px 7px;
      border-radius: 4px;
    }

    .hash {
      font-family: var(--mono);
      font-size: .7rem;
      color: var(--color-text-muted);
    }

    .date {
      font-size: .8125rem;
      color: var(--color-text-muted);
      margin-left: auto;
    }

    /* Actions */
    .card__actions {
      display: flex;
      gap: 8px;
    }

    .btn-primary, .btn-secondary {
      flex: 1;
      text-align: center;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: .875rem;
      font-weight: 500;
      transition: background 150ms ease, color 150ms ease;
    }

    .btn-primary {
      background: var(--color-primary);
      color: #fff;
    }
    .btn-primary:hover { background: var(--color-primary-hover); }

    .btn-secondary {
      background: transparent;
      color: var(--color-primary);
      border: 1px solid var(--color-primary);
    }
    .btn-secondary:hover {
      background: var(--color-primary-subtle);
    }

    /* Empty state */
    .empty {
      color: var(--color-text-muted);
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .empty pre {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      padding: 14px 16px;
      font-family: var(--mono);
      font-size: .8125rem;
      line-height: 1.8;
      width: fit-content;
    }
  </style>
</head>
<body>
  <header class="header">
    <h1 class="header__title">Design History</h1>
    <p class="header__sub">${projectName} &mdash; ${count} prototipo${count !== 1 ? 'i' : ''}</p>
  </header>

  ${count > 0 ? `<div class="grid">${cards}</div>` : emptyState}
</body>
</html>`;
}


// ─── Main ──────────────────────────────────────────────────────────────────

console.log('\nSnapshot prototipi\n' + '─'.repeat(60));

const tags = getProtoTags();

if (tags.length === 0) {
  console.log('\nNessun tag proto/* trovato.\n');
  console.log('Crea il primo tag con:');
  console.log('  git tag -a proto/<nome>/v1 -m "Descrizione del prototipo"\n');
  process.exit(0);
}

console.log(`\nTrovati ${tags.length} tag:\n`);
mkdirSync(SNAPSHOTS, { recursive: true });

const snapshots = tags
  .map(createSnapshot)
  .filter(Boolean); // rimuove eventuali snapshot falliti

const indexPath = join(DOCS, 'design-history.html');
writeFileSync(indexPath, generateIndex(snapshots));

console.log(`\n${'─'.repeat(60)}`);
console.log(`✓ ${snapshots.length} snapshot in docs/snapshots/`);
console.log(`✓ Indice generato in docs/design-history.html`);
console.log(`\nPer aprire in locale:\n  npm run history\n`);
