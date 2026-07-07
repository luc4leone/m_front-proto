import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "..");
const PERSONS_DIR = path.join(ROOT, "persons-data");
const OUTLETS_DIR = path.join(ROOT, "outlets-data");
const OUT_DIR = path.join(ROOT, "generated");

function asArray(v) {
  return Array.isArray(v) ? v : [];
}

function normalizeText(v) {
  return String(v ?? "").trim();
}

function stableHash32(str) {
  const s = String(str ?? "");
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pickFrom(arr, seed) {
  const a = asArray(arr);
  if (a.length === 0) return "";
  const idx = seed % a.length;
  return a[idx];
}

function pickFirstContact(contactDetails, type) {
  const items = asArray(contactDetails);
  for (const it of items) {
    if (!it || typeof it !== "object") continue;
    if (
      String(it.type || "")
        .trim()
        .toLowerCase() !== type
    )
      continue;
    const value = normalizeText(it.value);
    if (value) return value;
  }
  return "";
}

function uniqStrings(arr) {
  const out = [];
  const seen = new Set();
  for (const x of asArray(arr)) {
    const v = normalizeText(x);
    if (!v) continue;
    const k = v.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(v);
  }
  return out;
}

function countInto(map, key) {
  const k = normalizeText(key);
  if (!k) return;
  map.set(k, (Number(map.get(k) || 0) || 0) + 1);
}

function topCounts(map, n) {
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "en"))
    .slice(0, n)
    .map(([key, count]) => ({ key, count }));
}

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  try {
    return JSON.parse(raw);
  } catch (err) {
    const msg = err && err.message ? String(err.message) : String(err);
    const m = msg.match(/position\s+(\d+)/i);
    const pos = m ? Number(m[1]) : null;

    let lineCol = "";
    if (Number.isFinite(pos) && pos >= 0) {
      const pre = raw.slice(0, pos);
      const lines = pre.split("\n");
      const line = lines.length;
      const col = (lines[lines.length - 1] || "").length + 1;
      lineCol = ` (line ${line} col ${col})`;
    }

    let ctx = "";
    if (Number.isFinite(pos) && pos >= 0) {
      const start = Math.max(0, pos - 120);
      const end = Math.min(raw.length, pos + 120);
      ctx = raw.slice(start, end);
    }

    const extra = ctx ? `\nContext:\n${ctx.replace(/\n/g, "\\n")}` : "";
    throw new Error(
      `Failed to parse JSON file: ${filePath}\n${msg}${lineCol}${extra}`,
    );
  }
}

async function listJsonFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".json"))
    .map((e) => path.join(dir, e.name))
    .sort((a, b) => a.localeCompare(b, "en"));
}

async function readItemsFromChunkDir(dir) {
  const files = await listJsonFiles(dir);
  const all = [];
  for (const f of files) {
    const parsed = await readJson(f);
    const items = asArray(parsed?.items);
    all.push(...items);
  }
  return all;
}

function outletToTestata(outlet) {
  const id = normalizeText(outlet?.id);
  const nome = normalizeText(outlet?.name);
  const note = normalizeText(outlet?.mddr_annotations);

  const telefono = pickFirstContact(outlet?.contact_details, "phone");
  const email = pickFirstContact(outlet?.contact_details, "email");

  const TESTATA_MEDIA_BY_PARENT = {
    Radio: ["Emittenti"],
    TV: ["Emittenti", "Produzioni"],
    "Carta Stampata": [
      "Quotidiani",
      "Periodici al Pubblico",
      "Periodici di Categoria",
      "Supplementi",
    ],
    Web: ["On-Line / News", "Blog"],
  };

  const FREQUENZA_PUBBLICAZIONE_OPTIONS = [
    "Aperiodico",
    "Quotidiano",
    "Settimanale",
    "Mensile",
    "Bimestrale",
    "Trimestrale",
    "Semestrale",
    "Annuale",
  ];

  const DIFFUSIONE_OPTIONS = [
    "Internazionale",
    "Nazionale",
    "Regionale",
    "Locale",
  ];

  const seedBase = stableHash32(id || nome || note);
  const parents = Object.keys(TESTATA_MEDIA_BY_PARENT);
  const parent = pickFrom(parents, seedBase);
  const children = TESTATA_MEDIA_BY_PARENT[parent] || [];
  const child = pickFrom(children, stableHash32(`${seedBase}|child`));
  const tipoMedia = {
    parent: parent || "Web",
    child: child || "On-Line / News",
  };

  const frequenzaPubblicazione =
    pickFrom(
      FREQUENZA_PUBBLICAZIONE_OPTIONS,
      stableHash32(`${seedBase}|freq`),
    ) || "Aperiodico";

  const diffusione =
    pickFrom(DIFFUSIONE_OPTIONS, stableHash32(`${seedBase}|diff`)) ||
    "Nazionale";

  return {
    id,
    nome,
    argomento: "Generalista",
    direttore: "n/d",
    editore: "n/d",
    tipoMedia,
    frequenzaPubblicazione,
    diffusione,
    tiratura: "n/d",
    datiPubblicitari: "n/d",
    redazione: {
      giornalisti: [],
      indirizzo: "",
      telRedazione: "",
    },
    email,
    telefono,
    note,
  };
}

function pickRoleFromStaffPositions(person) {
  const positions = [];
  for (const collab of asArray(person?.collaborations)) {
    const sp = collab?.staff_position;
    if (sp === null || sp === undefined) continue;
    const n = Number(sp);
    if (!Number.isFinite(n)) continue;
    positions.push(String(n));
  }
  if (!positions.length) return "n/d";
  // Choose most frequent staff_position
  const c = new Map();
  for (const p of positions) countInto(c, p);
  const best = topCounts(c, 1)[0];
  return best ? `staff_position:${best.key}` : "n/d";
}

function pickServiceFromSubjects(person) {
  const subjectIds = [];
  for (const s of asArray(person?.subjects)) {
    const n = Number(s);
    if (Number.isFinite(n)) subjectIds.push(String(n));
  }
  for (const collab of asArray(person?.collaborations)) {
    for (const s of asArray(collab?.subjects)) {
      const n = Number(s);
      if (Number.isFinite(n)) subjectIds.push(String(n));
    }
  }
  if (!subjectIds.length) return "Generalista";
  const c = new Map();
  for (const id of subjectIds) countInto(c, id);
  const best = topCounts(c, 1)[0];
  return best ? `subject:${best.key}` : "Generalista";
}

function personToJournalist(person, outletsById) {
  const id = normalizeText(person?.id);
  const nome = normalizeText(person?.name);
  const cognome = normalizeText(person?.surname);

  const telefono = pickFirstContact(person?.contact_details, "phone");
  const email = pickFirstContact(person?.contact_details, "email");

  const outletIds = [];
  for (const collab of asArray(person?.collaborations)) {
    for (const o of asArray(collab?.outlets)) {
      const oid = normalizeText(o?.id);
      if (!oid) continue;
      outletIds.push(oid);
    }
  }
  const outletIdsUniq = uniqStrings(outletIds);

  const testate = outletIdsUniq
    .map((oid) => outletsById.get(oid))
    .map((t) => normalizeText(t?.nome))
    .filter(Boolean);

  const noteParts = [];
  for (const collab of asArray(person?.collaborations)) {
    const a = normalizeText(collab?.mddr_annotations);
    if (a) noteParts.push(a);
    for (const o of asArray(collab?.outlets)) {
      const oa = normalizeText(o?.mddr_annotations);
      if (oa) noteParts.push(oa);
    }
  }

  return {
    id,
    nome,
    cognome,
    ruolo: pickRoleFromStaffPositions(person),
    servizio: pickServiceFromSubjects(person),
    telefono,
    email,
    outletIds: outletIdsUniq,
    testate,
    testata: testate.length ? testate[0] : "",
    note: uniqStrings(noteParts).join("\n"),
  };
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function main() {
  const persons = await readItemsFromChunkDir(PERSONS_DIR);
  const outletsRaw = await readItemsFromChunkDir(OUTLETS_DIR);

  const testateById = new Map();
  for (const o of outletsRaw) {
    const t = outletToTestata(o);
    if (!t.id) continue;
    if (!testateById.has(t.id)) testateById.set(t.id, t);
  }

  const journalists = [];
  const missingId = [];
  const missingName = [];
  const removedMissingName = [];
  const staffPositionCounts = new Map();
  const subjectCounts = new Map();

  for (const p of persons) {
    const j = personToJournalist(p, testateById);
    if (!j.id) {
      missingId.push(p);
      continue;
    }

    if (!j.nome || !j.cognome) {
      missingName.push(j.id);
      removedMissingName.push(j.id);
      continue;
    }

    {
      const roleKey = String(j.ruolo || "");
      if (roleKey.startsWith("staff_position:")) {
        countInto(staffPositionCounts, roleKey.slice("staff_position:".length));
      }
      const svcKey = String(j.servizio || "");
      if (svcKey.startsWith("subject:")) {
        countInto(subjectCounts, svcKey.slice("subject:".length));
      }
    }
    journalists.push(j);
  }

  const missingOutlets = [];
  for (const j of journalists) {
    for (const oid of asArray(j.outletIds)) {
      const t = testateById.get(String(oid));
      if (!t) {
        missingOutlets.push({ journalistId: j.id, outletId: String(oid) });
        continue;
      }
      if (!t.redazione.giornalisti.includes(j.id)) {
        t.redazione.giornalisti.push(j.id);
      }
    }
  }

  const testate = Array.from(testateById.values());

  journalists.sort((a, b) => {
    const ca = normalizeText(a.cognome).toLowerCase();
    const cb = normalizeText(b.cognome).toLowerCase();
    const na = normalizeText(a.nome).toLowerCase();
    const nb = normalizeText(b.nome).toLowerCase();
    return ca.localeCompare(cb, "it") || na.localeCompare(nb, "it");
  });

  testate.sort((a, b) =>
    normalizeText(a.nome).localeCompare(normalizeText(b.nome), "it", {
      sensitivity: "base",
    }),
  );

  const report = {
    stats: {
      personsRead: persons.length,
      outletsRead: outletsRaw.length,
      journalistsWritten: journalists.length,
      testateWritten: testate.length,
      personsMissingId: missingId.length,
      journalistsMissingName: missingName.length,
      journalistsRemovedMissingName: removedMissingName.length,
      journalistOutletRefsMissing: missingOutlets.length,
    },
    samples: {
      missingOutlets: missingOutlets.slice(0, 50),
      missingName: missingName.slice(0, 50),
      removedMissingName: removedMissingName.slice(0, 50),
      topStaffPositions: topCounts(staffPositionCounts, 30),
      topSubjects: topCounts(subjectCounts, 50),
    },
  };

  await ensureDir(OUT_DIR);

  await fs.writeFile(
    path.join(OUT_DIR, "journalists.json"),
    JSON.stringify(journalists, null, 2),
    "utf8",
  );

  await fs.writeFile(
    path.join(OUT_DIR, "testate.json"),
    JSON.stringify(testate, null, 2),
    "utf8",
  );

  const dataJs = `window.__PROTO_DATA__ = ${JSON.stringify(
    { journalists, testate },
    null,
    0,
  )};\n`;

  await fs.writeFile(path.join(OUT_DIR, "data.js"), dataJs, "utf8");

  await fs.writeFile(
    path.join(OUT_DIR, "report.json"),
    JSON.stringify(report, null, 2),
    "utf8",
  );

  process.stdout.write(
    `Generated:\n- ${path.join(OUT_DIR, "journalists.json")}\n- ${path.join(
      OUT_DIR,
      "testate.json",
    )}\n- ${path.join(OUT_DIR, "data.js")}\n- ${path.join(
      OUT_DIR,
      "report.json",
    )}\n`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
