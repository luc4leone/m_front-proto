import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "generated");

const DEFAULT_TARGET = 2000;
const DEFAULT_SEED = "small-v1";

function asArray(v) {
  return Array.isArray(v) ? v : [];
}

function normalizeId(v) {
  return String(v ?? "").trim();
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

function hashSortKey(seed, ...parts) {
  return stableHash32([seed, ...parts.map((x) => String(x ?? ""))].join("|"));
}

function uniqById(items, getId) {
  const out = [];
  const seen = new Set();
  for (const it of asArray(items)) {
    const id = normalizeId(getId(it));
    if (!id) continue;
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(it);
  }
  return out;
}

function pickStrataKey(j) {
  const svc = normalizeText(j?.servizio).toLowerCase();
  const role = normalizeText(j?.ruolo).toLowerCase();
  const testata = normalizeText(j?.testata).toLowerCase();
  const bucketSvc = svc ? svc : "svc:nd";
  const bucketRole = role ? role : "role:nd";
  const bucketTestata = testata ? `t:${testata.slice(0, 18)}` : "t:nd";
  return `${bucketSvc}|${bucketRole}|${bucketTestata}`;
}

function stratifiedSample(items, { target, seed }) {
  const cleaned = uniqById(items, (j) => j?.id);

  const strata = new Map();
  for (const j of cleaned) {
    const id = normalizeId(j?.id);
    if (!id) continue;
    const k = pickStrataKey(j);
    const arr = strata.get(k) || [];
    arr.push(j);
    strata.set(k, arr);
  }

  // shuffle each stratum deterministically
  for (const [k, arr] of strata.entries()) {
    arr.sort((a, b) => {
      const ha = hashSortKey(seed, k, normalizeId(a?.id));
      const hb = hashSortKey(seed, k, normalizeId(b?.id));
      return ha - hb;
    });
  }

  // Round-robin pick across strata, starting from deterministic stratum order
  const keys = Array.from(strata.keys()).sort((a, b) => {
    const ha = hashSortKey(seed, "stratum", a);
    const hb = hashSortKey(seed, "stratum", b);
    return ha - hb;
  });

  const picked = [];
  const pickedIds = new Set();
  let idx = 0;
  while (picked.length < target && keys.length) {
    const k = keys[idx % keys.length];
    const arr = strata.get(k) || [];
    const next = arr.shift();
    if (!next) {
      // remove exhausted stratum
      const pos = keys.indexOf(k);
      if (pos !== -1) keys.splice(pos, 1);
      if (!keys.length) break;
      continue;
    }

    const id = normalizeId(next?.id);
    if (!id || pickedIds.has(id)) {
      idx++;
      continue;
    }
    pickedIds.add(id);
    picked.push(next);
    idx++;
  }

  return picked;
}

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

async function main() {
  const argv = process.argv.slice(2);
  const targetIdx = argv.indexOf("--target");
  const seedIdx = argv.indexOf("--seed");
  const target = targetIdx !== -1 ? Number(argv[targetIdx + 1]) : DEFAULT_TARGET;
  const seed = seedIdx !== -1 ? String(argv[seedIdx + 1] || "") : DEFAULT_SEED;

  if (!Number.isFinite(target) || target <= 0) {
    throw new Error("Invalid --target value");
  }

  const journalistsPath = path.join(OUT_DIR, "journalists.json");
  const testatePath = path.join(OUT_DIR, "testate.json");

  const journalistsAll = asArray(await readJson(journalistsPath));
  const testateAll = asArray(await readJson(testatePath));

  const sampledJournalists = stratifiedSample(journalistsAll, {
    target,
    seed,
  });

  const allowedJournalistIds = new Set(
    sampledJournalists.map((j) => normalizeId(j?.id)).filter(Boolean),
  );

  const allowedOutletIds = new Set();
  for (const j of sampledJournalists) {
    for (const oid of asArray(j?.outletIds)) {
      const id = normalizeId(oid);
      if (id) allowedOutletIds.add(id);
    }
  }

  const sampledTestate = testateAll
    .filter((t) => allowedOutletIds.has(normalizeId(t?.id)))
    .map((t) => {
      const copy = { ...t };
      if (copy?.redazione && typeof copy.redazione === "object") {
        const g = asArray(copy.redazione.giornalisti)
          .map((jid) => normalizeId(jid))
          .filter((jid) => allowedJournalistIds.has(jid));
        copy.redazione = {
          ...copy.redazione,
          giornalisti: Array.from(new Set(g)),
        };
      }
      return copy;
    });

  const data = {
    journalists: sampledJournalists,
    testate: sampledTestate,
  };

  const outJs = `window.__PROTO_DATA__ = ${JSON.stringify(data, null, 0)};\n`;
  await fs.writeFile(path.join(OUT_DIR, "data.small.js"), outJs, "utf8");

  const report = {
    seed,
    target,
    input: {
      journalists: journalistsAll.length,
      testate: testateAll.length,
    },
    output: {
      journalists: sampledJournalists.length,
      testate: sampledTestate.length,
    },
    notes: {
      strategy: "stratified round-robin over (servizio, ruolo, testata bucket) with deterministic ordering",
    },
  };

  await fs.writeFile(
    path.join(OUT_DIR, "report.small.json"),
    JSON.stringify(report, null, 2),
    "utf8",
  );

  process.stdout.write(
    `Generated small dataset:\n- ${path.join(OUT_DIR, "data.small.js")}\n- ${path.join(
      OUT_DIR,
      "report.small.json",
    )}\n`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
