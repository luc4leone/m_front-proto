// newsletter-form.test.js
// Test Playwright per il form di iscrizione alla newsletter.
// Scritti PRIMA dell'implementazione (TDD) — devono tutti fallire.
//
// Specifica di riferimento: plan-newsletter-form.md
// Ogni describe corrisponde a una sezione della specifica.
//
// Convenzione selettori (in ordine di preferenza):
//   1. getByRole()  — accessibile, robusto ai refactoring
//   2. getByLabel() — per gli input
//   3. getByText()  — per elementi identificati dal contenuto
//   4. locator()    — solo se le opzioni sopra non bastano

import { test, expect } from '@playwright/test';

// Helper: naviga alla pagina e aspetta che il form sia montato da main.js.
// Il form è renderizzato dinamicamente — senza questo wait i test
// potrebbero girare prima che il JS abbia finito di costruire il DOM.
async function gotoForm(page) {
  await page.goto('/');
  await page.waitForSelector('#app form', { timeout: 3000 });
}
