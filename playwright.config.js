// playwright.config.js
// Configurazione Playwright per il progetto demo-newsletter.
// Usa un server statico locale (serve) per servire i file HTML.
// Nessun build step — i file vengono serviti così come sono.
//
// Sviluppo locale vs CI:
//   - retries: 0 in locale (feedback veloce, nessun ritento sui fallimenti)
//   - retries: 1+ in CI (gestisce flakiness da latenza di rete)
//   Per abilitare il profilo CI: CI=true npx playwright test

import { defineConfig } from '@playwright/test';

const isCI = process.env.CI === 'true';

export default defineConfig({
  // Cartella dove vivono i test
  testDir: './tests',

  // Parallelismo: in locale 1 worker (output leggibile),
  // in CI aumenta a metà dei core disponibili
  workers: isCI ? undefined : 1,

  // Retries: 0 in locale (ogni test gira una volta sola),
  // 1 in CI (riprova in caso di flakiness da latenza/timing)
  retries: isCI ? 1 : 0,

  // Reporter: lista compatta in terminale
  reporter: 'list',

  use: {
    // URL base — tutti i test usano relative paths da qui
    baseURL: 'http://localhost:3000',

    // Cattura screenshot solo sui test falliti
    screenshot: 'only-on-failure',

    // Trace solo al primo retry — utile per debug
    trace: 'on-first-retry',

    // Headless di default (nessuna finestra del browser)
    headless: true,
  },

  // Avvia un server statico prima di eseguire i test.
  // `serve` serve la cartella corrente su porta 3000.
  webServer: {
    command: 'npx serve . -p 3000 --no-clipboard',
    port: 3000,
    reuseExistingServer: false,
    // Aspetta che il server risponda prima di avviare i test
    timeout: 10000,
  },

  // Solo Chromium per semplicità nel prototipo.
  // In produzione aggiungere firefox e webkit.
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});
