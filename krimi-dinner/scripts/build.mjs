#!/usr/bin/env node
// Builds all PDFs of a case with Typst.
// Usage: node build.mjs <case.json> <output-dir>
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadCase, check } from "./check.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const templates = resolve(here, "../templates");

const [file, outDir] = process.argv.slice(2);
if (!file || !outDir) {
  console.error("Usage: node build.mjs <case.json> <output-dir>");
  process.exit(2);
}

const c = loadCase(file);
const { errors, broken } = check(c);
if (broken) {
  console.error("case.json is incomplete, nothing can be built:");
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
if (errors.length) console.warn(`Warning: check.mjs reports ${errors.length} errors. Building the PDFs anyway.\n`);

const names = { victim: c.victim.name, investigator: `${c.investigator.title} ${c.investigator.name}` };
for (const r of c.roles) names[r.id] = r.name;

const dossiers = {};
for (const r of c.roles) {
  dossiers[r.id] = r.dossiers.flatMap((d) => {
    const o = c.roles.find((x) => x.id === d.about);
    return o ? [{ name: o.name, age: o.age, occupation: o.occupation, text: d.text }] : [];
  });
}

// Menu suggestion for the guide: arrival, intro, one course per round, solution.
function menu(n) {
  const courses = {
    1: ["Hauptgang"],
    2: ["Vorspeise", "Hauptgang"],
    3: ["Vorspeise", "Hauptgang", "Käse"],
    4: ["Vorspeise", "Suppe", "Hauptgang", "Käse"],
  }[n] ?? ["Vorspeise", "Suppe", ...Array(n - 4).fill("Zwischengang"), "Hauptgang", "Käse"];
  return ["Aperitif", "Brot und Kleinigkeiten", ...courses, "Dessert und Kaffee"];
}

const data = {
  case: c,
  names,
  dossiers,
  menu: menu(c.round_count),
  "has-props": Array.isArray(c.props) && c.props.length > 0,
};

const tmp = mkdtempSync(join(tmpdir(), "krimi-"));
const dataPath = join(tmp, "data.json");
writeFileSync(dataPath, JSON.stringify(data));
mkdirSync(outDir, { recursive: true });

const safe = (s) => s.replace(/[\/\\:*?"<>|]/g, "-").trim();
const jobs = [
  ["guide.typ", "01 Spielanleitung.pdf", {}],
  ...c.roles.map((r) => ["role.typ", `02 Rolle - ${safe(r.name)}.pdf`, { role: r.id }]),
  ...c.roles.map((r) => ["clues.typ", `03 Hinweise - ${safe(r.name)}.pdf`, { role: r.id }]),
  ["investigator.typ", `03 Hinweise - ${safe(names.investigator)}.pdf`, {}],
  ["solution.typ", "04 Auflösung.pdf", {}],
];
if (data["has-props"]) jobs.push(["props.typ", "05 Requisiten.pdf", {}]);

let ok = true;
try {
  for (const [template, target, inputs] of jobs) {
    const args = ["compile", "--root", "/", "--input", `data=${dataPath}`];
    for (const [k, v] of Object.entries(inputs)) args.push("--input", `${k}=${v}`);
    args.push(join(templates, template), join(resolve(outDir), target));
    try {
      const r = spawnSync("typst", args, { encoding: "utf8" });
      if (r.error) throw r.error;
      if (r.status !== 0) throw Object.assign(new Error(r.stderr), { stderr: r.stderr });
      console.log(`  ✓ ${target}`);
      if (r.stderr.trim()) console.warn(r.stderr.trim().replace(/^/gm, "    "));
    } catch (e) {
      ok = false;
      console.error(`  ✗ ${target}\n${e.stderr?.toString() ?? e.message}`);
    }
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
console.log(ok ? `\nDone: ${resolve(outDir)}` : "\nSome PDFs could not be built.");
process.exit(ok ? 0 : 1);
