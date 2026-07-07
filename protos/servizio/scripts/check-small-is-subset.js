// scripts/check-small-is-subset.js
import fs from "node:fs";

function loadProtoData(path) {
  const raw = fs.readFileSync(path, "utf8");
  const jsonText = raw.replace(/^window\.__PROTO_DATA__\s*=\s*/, "").trim().replace(/;$/, "");
  return JSON.parse(jsonText);
}

const small = loadProtoData("../generated/data.small.js");
const full = loadProtoData("../generated/data.js");

const fullIds = new Set(full.journalists.map(j => j.id));
const missing = small.journalists.map(j => j.id).filter(id => !fullIds.has(id));

console.log("small journalists:", small.journalists.length);
console.log("full journalists:", full.journalists.length);
console.log("missing ids from full:", missing.length);
if (missing.length) console.log(missing.slice(0, 50));