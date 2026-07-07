import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(process.cwd(), "proto-servizio/proto");
const IN_JS = path.join(ROOT, "generated/data.small.js");
const OUT_JS = path.join(ROOT, "generated/data.small.resolved.js");

const SUBJECTS_JSON = path.join(ROOT, "filters-data/subjects.json");
const STAFF_JSON = path.join(ROOT, "filters-data/staff-positions.json");

function parseIdFromPrefixed(value, prefix) {
  const v = String(value || "").trim();
  if (!v.startsWith(prefix)) return null;
  const raw = v.slice(prefix.length);
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function buildValueById(items) {
  const m = new Map();
  for (const it of items || []) {
    const id = Number(it?.id);
    const value = String(it?.value || "").trim();
    if (Number.isFinite(id) && value) m.set(id, value);
  }
  return m;
}

function extractProtoDataObjectFromJs(jsText) {
  const marker = "window.__PROTO_DATA__";
  const i = jsText.indexOf(marker);
  if (i < 0) throw new Error("window.__PROTO_DATA__ not found");

  const eq = jsText.indexOf("=", i);
  if (eq < 0) throw new Error("assignment '=' not found");

  const semi = jsText.lastIndexOf(";");
  const jsonText = jsText
    .slice(eq + 1, semi > eq ? semi : jsText.length)
    .trim();

  return JSON.parse(jsonText);
}

const [inJsText, subjectsArr, staffArr] = await Promise.all([
  fs.readFile(IN_JS, "utf8"),
  fs.readFile(SUBJECTS_JSON, "utf8").then((t) => JSON.parse(t)),
  fs.readFile(STAFF_JSON, "utf8").then((t) => JSON.parse(t)),
]);

const data = extractProtoDataObjectFromJs(inJsText);

const subjectsById = buildValueById(subjectsArr);
const staffById = buildValueById(staffArr);

for (const j of data.journalists || []) {
  const svcId = parseIdFromPrefixed(j?.servizio, "subject:");
  if (svcId != null && subjectsById.has(svcId)) {
    j.servizioRaw = j.servizio;
    j.servizio = subjectsById.get(svcId);
  }

  const roleId = parseIdFromPrefixed(j?.ruolo, "staff_position:");
  if (roleId != null && staffById.has(roleId)) {
    j.ruoloRaw = j.ruolo;
    j.ruolo = staffById.get(roleId);
  }
}

const out = `window.__PROTO_DATA__ = ${JSON.stringify(data)};\n`;
await fs.writeFile(OUT_JS, out, "utf8");

console.log("Wrote", OUT_JS);
