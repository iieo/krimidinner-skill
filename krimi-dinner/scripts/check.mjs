#!/usr/bin/env node
// Checks case.json against references/schema.md.
// Usage: node check.mjs <case.json> [--structure]
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const ASPECTS = ["motive", "means", "opportunity", "clears"];
const INCRIMINATING = ["motive", "means", "opportunity"];
const KINDS = ["true", "red_herring", "secret"];

export function check(c, { structure = false } = {}) {
  const errors = [];
  const warnings = [];
  let broken = false;
  const E = (m) => errors.push(m);
  const W = (m) => warnings.push(m);
  const B = (m) => { broken = true; E(m); };

  const isText = (v) => typeof v === "string" && v.trim().length > 0;
  const isInt = (v) => Number.isInteger(v);
  const isList = Array.isArray;

  // Prose fields may be empty in --structure mode.
  const textField = (obj, field, path, prose = false) => {
    if (!obj || !isText(obj[field])) {
      if (prose && structure) return;
      B(`${path}.${field} is missing or empty.`);
    }
  };

  if (!c || typeof c !== "object") {
    B("The file does not contain a JSON object.");
    return { errors, warnings, broken, report: [] };
  }

  for (const f of ["title", "subtitle"]) textField(c, f, "case");
  textField(c, "what_happened", "case", true);
  textField(c, "solution", "case", true);
  if (!isInt(c.players) || c.players < 2) B("case.players must be an integer of at least 2.");
  if (!isInt(c.round_count) || c.round_count < 1) B("case.round_count must be an integer of at least 1.");
  const N = isInt(c.round_count) ? c.round_count : 0;

  if (!structure || c.intro) {
    if (!c.intro || typeof c.intro !== "object") B("case.intro is missing.");
    else {
      textField(c.intro, "speaker", "intro");
      textField(c.intro, "text", "intro", true);
    }
  }

  if (!c.victim) B("case.victim is missing.");
  else {
    textField(c.victim, "name", "victim");
    textField(c.victim, "description", "victim");
    if (!isInt(c.victim.age)) B("victim.age must be a number.");
  }
  if (!c.investigator) B("case.investigator is missing.");
  else for (const f of ["name", "title", "description"]) textField(c.investigator, f, "investigator");

  const roles = isList(c.roles) ? c.roles : [];
  if (!isList(c.roles)) B("case.roles is missing or not a list.");
  const ids = new Map();
  for (const [i, r] of roles.entries()) {
    const p = `roles[${i}]${r?.name ? ` (${r.name})` : ""}`;
    if (!r || typeof r !== "object") { B(`${p} is not an object.`); continue; }
    for (const f of ["id", "name", "occupation", "tagline", "secret", "motive", "goal"]) textField(r, f, p);
    for (const f of ["profile", "costume", "how_to_play", "booklet_intro"]) textField(r, f, p, true);
    if (!isInt(r.age)) B(`${p}.age must be a number.`);
    if (typeof r.is_culprit !== "boolean") B(`${p}.is_culprit must be true or false.`);
    if (typeof r.may_lie !== "boolean") B(`${p}.may_lie must be true or false.`);
    if (r.id) {
      if (ids.has(r.id)) E(`Role id "${r.id}" is used more than once.`);
      ids.set(r.id, r);
    }
  }
  const name = (id) => (id === "investigator" ? `${c.investigator?.title ?? ""} ${c.investigator?.name ?? "Investigator"}`.trim() : ids.get(id)?.name ?? id);
  const knownRole = (id, where) => {
    if (!ids.has(id)) { E(`${where} refers to unknown role id "${id}".`); return false; }
    return true;
  };

  if (isInt(c.players) && roles.length !== c.players)
    E(`There are ${roles.length} roles, but players is ${c.players}.`);

  if (c.intro?.speaker) knownRole(c.intro.speaker, "intro.speaker");

  // Round texts and dossiers
  for (const r of roles) {
    if (!r?.id) continue;
    const p = `Role ${r.name ?? r.id}`;
    if (!isList(r.rounds)) { if (!structure) B(`${p}: rounds is missing.`); }
    else if (!structure || r.rounds.length) {
      for (let n = 1; n <= N; n++) {
        const e = r.rounds.filter((x) => x?.n === n);
        if (!e.length) E(`${p}: round ${n} is missing from the clue booklet.`);
        else if (e.length > 1) E(`${p}: round ${n} appears more than once.`);
        else if (!isText(e[0].text)) E(`${p}: round ${n} has no text.`);
      }
      for (const x of r.rounds) if (!(isInt(x?.n) && x.n >= 1 && x.n <= N)) E(`${p}: round "${x?.n}" is outside 1 to ${N}.`);
    }
    if (!isList(r.dossiers)) { if (!structure) B(`${p}: dossiers is missing.`); }
    else if (!structure || r.dossiers.length) {
      const about = new Set();
      for (const s of r.dossiers) {
        if (!s?.about || !isText(s.text)) { E(`${p}: dossier without "about" or without text.`); continue; }
        if (s.about === r.id) E(`${p}: dossier about itself.`);
        else if (knownRole(s.about, `${p}, dossier`)) about.add(s.about);
      }
      if (about.size < 2) E(`${p}: needs dossiers about at least two other roles, has ${about.size}.`);
    }
  }

  // Culprit and lying rule
  const t = c.truth;
  if (!t || typeof t !== "object") B("case.truth is missing.");
  else {
    for (const f of ["culprit", "means", "motive", "time_of_death", "cover_story"]) textField(t, f, "truth");
    if (!isList(t.accomplices)) B("truth.accomplices must be a list (may be empty).");
    else for (const h of t.accomplices) knownRole(h, "truth.accomplices");
    if (!isList(t.timeline) || !t.timeline.length) B("truth.timeline is missing or empty.");
    else for (const [i, z] of t.timeline.entries()) {
      const p = `truth.timeline[${i}]`;
      for (const f of ["time", "place", "what"]) textField(z, f, p);
      for (const f of ["who", "seen_by"]) {
        if (!isList(z?.[f])) B(`${p}.${f} must be a list.`);
        else for (const id of z[f]) if (id !== "victim") knownRole(id, `${p}.${f}`);
      }
    }
  }
  const culpritId = t?.culprit;
  const culpritRoles = roles.filter((r) => r?.is_culprit === true);
  if (culpritRoles.length !== 1) E(`Exactly one role must have is_culprit: true, found ${culpritRoles.length}.`);
  if (culpritId) {
    if (knownRole(culpritId, "truth.culprit") && culpritRoles.length === 1 && culpritRoles[0].id !== culpritId)
      E(`truth.culprit is "${culpritId}", but is_culprit: true is set on "${culpritRoles[0].id}".`);
  }
  for (const r of roles) {
    if (!r?.id) continue;
    if (r.may_lie === true && r.id !== culpritId) E(`${r.name}: may_lie is true, but only the culprit may lie.`);
    if (r.id === culpritId && r.may_lie !== true) E(`${r.name} is the culprit, may_lie must be true.`);
  }

  // Investigator rounds
  if (!isList(c.investigator_rounds)) { if (!structure) B("case.investigator_rounds is missing."); }
  else if (!structure || c.investigator_rounds.length) {
    for (let n = 1; n <= N; n++) {
      const e = c.investigator_rounds.filter((x) => x?.n === n);
      if (e.length !== 1) E(`investigator_rounds: round ${n} ${e.length ? "appears more than once" : "is missing"}.`);
      else {
        if (!isText(e[0].text)) E(`investigator_rounds: round ${n} has no text.`);
        for (const [i, b] of (e[0].evidence ?? []).entries())
          if (!isText(b?.title) || !isText(b?.content)) E(`investigator_rounds round ${n}, evidence[${i}]: title or content is missing.`);
      }
    }
    for (const e of c.investigator_rounds) if (!(isInt(e?.n) && e.n >= 1 && e.n <= N)) E(`investigator_rounds: round "${e?.n}" is outside 1 to ${N}.`);
  }

  // Clues
  const allClues = isList(c.clues) ? c.clues.filter((h) => h && typeof h === "object") : [];
  if (!isList(c.clues) || !c.clues.length) B("case.clues is missing or empty.");
  const clueIds = new Map();
  for (const [i, h] of allClues.entries()) {
    const p = `Clue ${h.id ?? `[${i}]`}`;
    if (!isText(h.id)) B(`clues[${i}].id is missing.`);
    else if (clueIds.has(h.id)) E(`Clue id "${h.id}" is used more than once.`);
    else clueIds.set(h.id, h);
    if (!(isInt(h.round) && h.round >= 1 && h.round <= N)) E(`${p}: round "${h.round}" is outside 1 to ${N}.`);
    if (h.source !== "investigator") knownRole(h.source, `${p}.source`);
    if (!isText(h.text)) E(`${p}: text is missing.`);
    if (!KINDS.includes(h.kind)) E(`${p}: kind "${h.kind}" is not one of ${KINDS.join(", ")}.`);
    if (!isList(h.points)) E(`${p}: points must be a list (may be empty for a neutral fact).`);
    else for (const z of h.points) {
      knownRole(z?.to, `${p}.points`);
      if (!ASPECTS.includes(z?.aspect)) E(`${p}: aspect "${z?.aspect}" is not one of ${ASPECTS.join(", ")}.`);
    }
    if (h.refuted_by !== undefined && !isList(h.refuted_by)) E(`${p}: refuted_by must be a list.`);
  }
  const clues = allClues.filter((h) => isInt(h.round) && h.round >= 1 && h.round <= N);
  for (const h of allClues) {
    const rb = isList(h.refuted_by) ? h.refuted_by : [];
    for (const id of rb) if (!clueIds.has(id)) E(`Clue ${h.id}: refuted_by names unknown clue "${id}".`);
    if (h.kind === "red_herring") {
      if (!rb.length) E(`Red herring ${h.id} is not refuted by any clue.`);
      else if (!rb.some((id) => clueIds.get(id)?.round >= h.round))
        E(`Red herring ${h.id} (round ${h.round}) is only refuted by clues from earlier rounds.`);
    }
  }

  // Matrix: cumulative per role, round and aspect (all kinds), plus true clues against the culprit
  const tally = (id, upTo, trueOnly = false) => {
    const t = { motive: 0, means: 0, opportunity: 0, clears: 0 };
    for (const h of clues) {
      if (!(h.round <= upTo) || (trueOnly && h.kind !== "true")) continue;
      for (const z of h.points ?? []) if (z?.to === id && t[z.aspect] !== undefined) t[z.aspect]++;
    }
    return t;
  };

  if (culpritId && ids.has(culpritId) && N) {
    const cn = name(culpritId);
    for (const a of INCRIMINATING) {
      const real = clues.filter((h) => h.kind === "true" && h.points?.some((z) => z?.to === culpritId && z.aspect === a));
      const sources = new Set(real.map((h) => h.source));
      if (real.length < 3) E(`Three-clue rule: only ${real.length} true clues for ${a} of ${cn}.`);
      if (sources.size < 2) E(`Three-clue rule: clues for ${a} of ${cn} come from only ${sources.size} source.`);
    }
    const solvableAt = (() => {
      for (let n = 1; n <= N; n++) {
        const t = tally(culpritId, n, true);
        if (INCRIMINATING.every((a) => t[a] >= 3)) return n;
      }
      return null;
    })();
    if (solvableAt !== null && solvableAt < N)
      E(`The case is already solved after round ${solvableAt} (all three aspects against ${cn} covered three times). The decisive clue must come in round ${N}.`);
    if (!clues.some((h) => h.round === N && h.kind === "true" && h.points?.some((z) => z?.to === culpritId && INCRIMINATING.includes(z.aspect))))
      E(`The last round (${N}) has no true clue against ${cn}.`);
    if (N > 1) {
      const t1 = tally(culpritId, 1);
      const covered = INCRIMINATING.filter((a) => t1[a] > 0);
      if (covered.length >= 2) W(`Round 1 already covers ${covered.length} aspects against ${cn} (${covered.join(", ")}). That may give it away too early.`);
    }
    for (const h of clues) {
      if (!(h.round < N)) continue;
      const a = new Set((h.points ?? []).filter((z) => z?.to === culpritId && INCRIMINATING.includes(z.aspect)).map((z) => z.aspect));
      const others = (h.points ?? []).some((z) => z?.to !== culpritId && INCRIMINATING.includes(z?.aspect));
      if (a.size === 3) E(`Clue ${h.id} (round ${h.round}) alone covers all three aspects against ${cn}.`);
      else if (a.size === 2 && !others) W(`Clue ${h.id} (round ${h.round}) alone covers two aspects against ${cn} and points at nobody else.`);
    }
  }

  for (const r of roles) {
    if (!r?.id) continue;
    const t = tally(r.id, N);
    if (!INCRIMINATING.some((a) => t[a] > 0)) E(`${r.name} is not incriminated by any clue. Every role must be a suspect.`);
    if (r.id !== culpritId && INCRIMINATING.every((a) => t[a] > 0) && t.clears === 0)
      E(`${r.name} is innocent, ends up incriminated on motive, means and opportunity, and is never cleared.`);
    if (!clues.some((h) => h.source === r.id)) E(`${r.name} is not the source of any clue.`);
    if (r.id === culpritId && t.clears > 0) W(`The culprit ${r.name} has ${t.clears} clearing clues. Check that they get refuted later.`);
  }

  if (isList(c.props)) for (const [i, q] of c.props.entries()) {
    if (!isText(q?.title) || !isText(q?.content)) E(`props[${i}]: title or content is missing.`);
    if (!(isInt(q?.round) && q.round >= 1 && q.round <= N)) E(`props[${i}]: round "${q?.round}" is outside 1 to ${N}.`);
  }

  // Text checks
  for (const r of roles) {
    if (!isText(r?.profile)) continue;
    const n = r.profile.trim().split(/\s+/).length;
    if (n < 250 || n > 450) W(`${r.name}: profile has ${n} words (target 250 to 450).`);
  }
  const dashFields = [];
  const allTexts = [];
  const walk = (v, path) => {
    if (typeof v === "string") {
      allTexts.push([path, v]);
      if (/[—–]/.test(v)) dashFields.push(path);
    } else if (isList(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`));
    else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) if (k !== "dice") walk(x, path ? `${path}.${k}` : k);
  };
  walk(c, "");
  if (dashFields.length) W(`Dashes (— or –) in ${dashFields.length} fields: ${dashFields.join(", ")}`);

  if (!structure && isText(c.solution)) {
    for (const r of roles) {
      if (!r?.name) continue;
      const parts = r.name.split(/\s+/).filter((t) => t.length > 2 && !/^(Dr\.|von|van|der|zu|Prof\.)$/.test(t));
      if (!parts.some((t) => c.solution.includes(t))) W(`The solution does not mention ${r.name}. Every character should be cleared or convicted concretely.`);
    }
  }

  // Misspelled names
  const nameParts = new Set();
  for (const n of [c.victim?.name, c.investigator?.name, ...roles.map((r) => r?.name)])
    if (typeof n === "string") for (const t of n.split(/\s+/)) nameParts.add(t.replace(/[.,]/g, ""));
  const long = [...nameParts].filter((t) => t.length >= 5);
  const suspicious = new Map();
  for (const [path, text] of allTexts) {
    for (const word of text.match(/\p{Lu}[\p{L}]+/gu) ?? []) {
      if (nameParts.has(word)) continue;
      for (const t of long) {
        if (word === `${t}s` || word === `${t}'s` || Math.abs(word.length - t.length) > 1) continue;
        if (levenshtein(word, t) === 1 && !(word.endsWith("s") && levenshtein(word.slice(0, -1), t) === 0)) {
          const k = `${word} (meant ${t}?)`;
          if (!suspicious.has(k)) suspicious.set(k, path);
        }
      }
    }
  }
  for (const [k, path] of suspicious) W(`Possible typo in a name: ${k} in ${path}`);

  // Report tables
  const report = [];
  if (N && roles.length) {
    const head = ["Role", ...Array.from({ length: N }, (_, i) => `R${i + 1}`)];
    const cell = (t) => `${t.motive}/${t.means}/${t.opportunity}/${t.clears}`;
    const rows = roles.filter((r) => r?.id).map((r) => [
      `${r.name}${r.id === culpritId ? " (culprit)" : ""}`,
      ...Array.from({ length: N }, (_, i) => cell(tally(r.id, i + 1))),
    ]);
    report.push("Suspicion matrix (cumulative, motive/means/opportunity/clears, all clue kinds):", table(head, rows), "");
    if (culpritId && ids.has(culpritId)) {
      const z = [[`${name(culpritId)} true only`, ...Array.from({ length: N }, (_, i) => cell(tally(culpritId, i + 1, true)))]];
      report.push(table(head, z), "");
    }
    const sources = [...roles.filter((r) => r?.id).map((r) => [r.id, r.name]), ["investigator", name("investigator")]];
    const sr = sources.map(([id, n]) => [n, ...Array.from({ length: N }, (_, i) => {
      const k = clues.filter((h) => h.source === id && h.round === i + 1).length;
      return k ? String(k) : "-";
    })]);
    report.push('Clue sources per round (number of clues, "-" means this role provides nothing that round):', table(head.map((k, i) => (i ? k : "Source")), sr));
    for (const [id, n] of sources) if (id !== "investigator") {
      const empty = Array.from({ length: N }, (_, i) => i + 1).filter((r) => !clues.some((h) => h.source === id && h.round === r));
      if (empty.length) W(`${n} provides no clue in round ${empty.join(", ")}.`);
    }
  }

  return { errors, warnings, broken, report };
}

function levenshtein(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

function table(head, rows) {
  const widths = head.map((k, i) => Math.max(k.length, ...rows.map((z) => z[i].length)));
  const line = (z) => "  " + z.map((x, i) => x.padEnd(widths[i])).join("  ");
  return [line(head), "  " + widths.map((b) => "-".repeat(b)).join("  "), ...rows.map(line)].join("\n");
}

export function loadCase(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const structure = args.includes("--structure");
  const file = args.find((a) => !a.startsWith("--"));
  if (!file) {
    console.error("Usage: node check.mjs <case.json> [--structure]");
    process.exit(2);
  }
  let c;
  try {
    c = loadCase(file);
  } catch (e) {
    console.error(`Cannot read ${file}: ${e.message}`);
    process.exit(1);
  }
  const { errors, warnings, report } = check(c, { structure });
  console.log(`Checking ${file}${structure ? " (structure only)" : ""}\n`);
  if (report.length) console.log(report.join("\n") + "\n");
  console.log(errors.length ? `ERRORS (${errors.length}):` : "No errors.");
  for (const f of errors) console.log(`  ✗ ${f}`);
  console.log(warnings.length ? `\nWARNINGS (${warnings.length}):` : "\nNo warnings.");
  for (const w of warnings) console.log(`  ! ${w}`);
  process.exit(errors.length ? 1 : 0);
}
