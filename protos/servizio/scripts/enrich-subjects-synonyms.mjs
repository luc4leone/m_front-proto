import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "..");
const SUBJECTS_PATH = path.join(ROOT, "filters-data", "subjects.json");
const THESAURUS_DAT_PATH = path.join(
  ROOT,
  "dizionario-sinonimi",
  "th_it_IT.dat",
);

function normalizeText(v) {
  return String(v ?? "").trim();
}

function normalizeKey(v) {
  return normalizeText(v).toLowerCase();
}

function stripParens(v) {
  return normalizeText(v).replace(/\([^)]*\)/g, " ").replace(/\s+/g, " ").trim();
}

function splitOnDelimiters(v) {
  const s = normalizeText(v);
  if (!s) return [];
  return s
    .split(/[\/,;:+\-–—]+/g)
    .map((x) => normalizeText(x))
    .filter(Boolean);
}

function generateVariants(value) {
  const v = normalizeText(value);
  if (!v) return [];

  const out = [];

  const noParens = stripParens(v);
  if (noParens && noParens !== v) out.push(noParens);

  const pieces = splitOnDelimiters(noParens);
  for (const p of pieces) {
    if (p && p !== v && p !== noParens) out.push(p);
  }

  const noApos = noParens.replace(/[’']/g, "");
  if (noApos && noApos !== v && noApos !== noParens) out.push(noApos);

  const spaced = noParens
    .replace(/[’']/g, " ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (spaced && spaced !== v && spaced !== noParens) out.push(spaced);

  // uniq (case-insensitive)
  const uniq = [];
  const seen = new Set();
  for (const x of out) {
    const k = normalizeKey(x);
    if (!k) continue;
    if (seen.has(k)) continue;
    seen.add(k);
    uniq.push(x);
  }
  return uniq;
}

function matchCasingLike(template, synonym) {
  const t = normalizeText(template);
  const s = normalizeText(synonym);
  if (!t || !s) return s;

  const templateFirst = t[0];
  if (templateFirst && templateFirst === templateFirst.toUpperCase()) {
    return s[0].toUpperCase() + s.slice(1);
  }
  return s;
}

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

async function writeJsonPretty(filePath, obj) {
  const out = JSON.stringify(obj, null, 2) + "\n";
  await fs.writeFile(filePath, out, "utf8");
}

function parseDatToSynMap(datText) {
  const lines = String(datText || "").split(/\r?\n/);
  const map = new Map();

  let i = 0;
  // First line: encoding marker
  if (lines[i] && lines[i].toUpperCase().includes("ISO")) {
    i += 1;
  }

  while (i < lines.length) {
    const header = lines[i];
    i += 1;
    if (!header) continue;

    const pipe = header.lastIndexOf("|");
    if (pipe === -1) continue;

    const lemma = normalizeText(header.slice(0, pipe));
    const nRaw = normalizeText(header.slice(pipe + 1));
    const n = Number(nRaw);
    if (!lemma || !Number.isFinite(n) || n < 0) continue;

    const syns = [];

    for (let k = 0; k < n && i < lines.length; k += 1, i += 1) {
      const row = normalizeText(lines[i]);
      if (!row) continue;
      const parts = row.split("|").map((x) => normalizeText(x));
      let startIdx = 0;
      if (parts[0] && parts[0].startsWith("(") && parts[0].endsWith(")")) {
        startIdx = 1;
      }
      for (let p = startIdx; p < parts.length; p += 1) {
        const term = parts[p];
        if (!term) continue;
        syns.push(term);
      }
    }

    const key = normalizeKey(lemma);
    const seen = new Set();
    const uniq = [];
    for (const s of syns) {
      const kk = normalizeKey(s);
      if (!kk) continue;
      if (kk === key) continue;
      if (seen.has(kk)) continue;
      seen.add(kk);
      uniq.push(s);
    }

    map.set(key, uniq);
  }

  return map;
}

function pickSynonymsForValue(value, synMap) {
  const v = normalizeText(value);
  if (!v) return [];

  const candidates = [];

  // Try exact
  candidates.push(v);

  // Strip parentheticals
  const noParens = stripParens(v);
  if (noParens && noParens !== v) candidates.push(noParens);

  // Split and test segments
  for (const seg of splitOnDelimiters(noParens)) candidates.push(seg);

  // Also try last token (often the head in Italian phrases)
  const tokens = noParens.split(/\s+/).filter(Boolean);
  if (tokens.length >= 2) {
    candidates.push(tokens[tokens.length - 1]);
  }

  const seenKeys = new Set();
  for (const c of candidates) {
    const k = normalizeKey(c);
    if (!k || seenKeys.has(k)) continue;
    seenKeys.add(k);
    const syns = synMap.get(k);
    if (Array.isArray(syns) && syns.length) {
      return syns;
    }
  }

  return [];
}

async function main() {
  const subjects = await readJson(SUBJECTS_PATH);
  if (!Array.isArray(subjects)) {
    throw new Error("subjects.json must be an array");
  }

  const datRaw = await fs.readFile(THESAURUS_DAT_PATH, "latin1");
  const synMap = parseDatToSynMap(datRaw);

  let updated = 0;
  let withDict = 0;
  let withVariants = 0;
  let withSelf = 0;

  for (const rec of subjects) {
    if (!rec || typeof rec !== "object") continue;
    if (Array.isArray(rec.synonyms) && rec.synonyms.length) continue;

    const value = normalizeText(rec.value);
    if (!value) continue;

    const picked = [];
    const seen = new Set();

    const dictSyns = pickSynonymsForValue(value, synMap);
    for (const s of dictSyns) {
      if (picked.length >= 2) break;
      const out = matchCasingLike(value, s);
      const k = normalizeKey(out);
      if (!k) continue;
      if (k === normalizeKey(value)) continue;
      if (seen.has(k)) continue;
      seen.add(k);
      picked.push(out);
    }

    if (picked.length) {
      withDict += 1;
    }

    if (picked.length < 2) {
      const variants = generateVariants(value);
      for (const v of variants) {
        if (picked.length >= 2) break;
        const out = matchCasingLike(value, v);
        const k = normalizeKey(out);
        if (!k) continue;
        if (k === normalizeKey(value)) continue;
        if (seen.has(k)) continue;
        seen.add(k);
        picked.push(out);
      }
      if (picked.length) {
        withVariants += 1;
      }
    }

    if (picked.length === 0) {
      // Self-synonym fallback
      picked.push(value);
      withSelf += 1;
    }

    rec.synonyms = picked;
    updated += 1;
  }

  await writeJsonPretty(SUBJECTS_PATH, subjects);

  console.log(
    JSON.stringify(
      {
        subjects: subjects.length,
        updated,
        withDict,
        withVariants,
        withSelf,
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
