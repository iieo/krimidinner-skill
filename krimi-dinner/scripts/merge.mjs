#!/usr/bin/env node
// Merges the parts of a game into case.json and exports the player view for the blind test.
//
//   node merge.mjs <game>/source
//     reads structure.json, frame.json and roles/<id>.json, writes case.json
//   node merge.mjs <game>/source --player-view
//     also writes player-view.md: what the table can learn during the game,
//     without truth, clue graph and solution. The culprit appears with their public_* version.

import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const [sourceDir, ...flags] = process.argv.slice(2);
if (!sourceDir) {
  console.error("Usage: node merge.mjs <source-dir> [--player-view]");
  process.exit(2);
}

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const structurePath = join(sourceDir, "structure.json");
if (!existsSync(structurePath)) {
  console.error(`Missing: ${structurePath}`);
  process.exit(1);
}

const c = read(structurePath);
const framePath = join(sourceDir, "frame.json");
if (existsSync(framePath)) Object.assign(c, read(framePath));

const rolesDir = join(sourceDir, "roles");
const missing = [];
if (existsSync(rolesDir)) {
  const files = new Set(readdirSync(rolesDir));
  c.roles = c.roles.map((role) => {
    const file = `${role.id}.json`;
    if (!files.has(file)) {
      missing.push(role.id);
      return role;
    }
    const text = read(join(rolesDir, file));
    // Structure fields win, so a role author cannot shift the truth.
    return { ...text, ...role };
  });
}

writeFileSync(join(sourceDir, "case.json"), JSON.stringify(c, null, 2) + "\n");
console.log(`Wrote case.json (${c.roles.length} roles).`);
if (missing.length) console.log(`Roles without text yet: ${missing.join(", ")}`);

if (flags.includes("--player-view")) {
  writeFileSync(join(sourceDir, "player-view.md"), playerView(c));
  console.log("Wrote player-view.md.");
}

function playerView(c) {
  const culpritId = c.truth?.culprit;
  const name = (id) => c.roles.find((r) => r.id === id)?.name ?? id;
  const lines = [];
  const p = (...t) => lines.push(...t, "");

  p(`# ${c.title}`, `Schauplatz: ${c.setting ?? ""}, ${c.era ?? ""}`);
  p("## Was ist passiert", c.what_happened ?? "");
  p(`## Opfer`, `${c.victim.name} (${c.victim.age}): ${c.victim.description}`);
  if (c.intro) p(`## Einführung (liest ${name(c.intro.speaker)})`, c.intro.text);

  p(
    "## Regeln",
    "Alle sagen die Wahrheit und teilen am Tisch, was sie wissen, sobald es nicht ihr eigenes Geheimnis belastet.",
    "Nur eine Person, der Täter oder die Täterin, darf lügen. Von dieser Person siehst du unten ihre öffentliche Fassung, also das, was sie am Tisch erzählt.",
  );

  // Shuffle the order so the position in the list gives nothing away.
  const roles = [...c.roles].sort((a, b) => hash(a.id + c.title) - hash(b.id + c.title));

  p("## Personen am Tisch");
  for (const r of roles) p(`- ${r.name} (${r.age}), ${r.occupation}: ${r.tagline}`);

  p("# Was die Personen wissen und erzählen");
  for (const r of roles) {
    p(`## ${r.name}`);
    // The culprit is shown through a public version written for this purpose, so that the
    // shape of the file does not give them away.
    const isCulprit = r.id === culpritId;
    if (isCulprit && !r.public_profile) {
      console.warn(`Warning: culprit ${r.name} has no public_profile; the player view gives them away.`);
    }
    const profile = isCulprit ? r.public_profile ?? c.truth.cover_story ?? "" : r.profile ?? "";
    const dossiers = isCulprit ? r.public_dossiers ?? [] : r.dossiers ?? [];
    const rounds = isCulprit ? r.public_rounds ?? [] : r.rounds ?? [];
    p("### Profil", profile);
    if (dossiers.length) {
      p("### Weiß über andere");
      for (const d of dossiers) p(`- ${name(d.about)}: ${d.text}`);
    }
    for (const round of rounds) p(`### Runde ${round.n}`, round.text);
  }

  p(`# Ermittlungen: ${c.investigator.title} ${c.investigator.name}`);
  for (const round of c.investigator_rounds ?? []) {
    p(`## Runde ${round.n}`, round.text);
    for (const e of round.evidence ?? []) p(`> **${e.title}**`, `> ${e.content.replace(/\n/g, "\n> ")}`);
  }
  for (const prop of c.props ?? []) p(`## Requisit (Runde ${prop.round}): ${prop.title}`, prop.content);

  return lines.join("\n");
}

function hash(s) {
  let h = 2166136261;
  for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}
