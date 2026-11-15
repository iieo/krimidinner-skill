#!/usr/bin/env node
// Rolls the ingredients for a new murder mystery case. The randomness comes from this script,
// not from the language model, so that it does not write the same story every time.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { randomInt } from 'node:crypto';

const DATA = join(dirname(fileURLToPath(import.meta.url)), '..', 'data');
const DEFAULT_HISTORY = join(homedir(), '.krimi-dinner', 'history.json');
const BLOCK_WINDOW = 5;
const HISTORY_MAX = 50;
const TIMEOUT_MS = 4000;
const USER_AGENT = 'krimi-dinner-skill/1.0';

const USAGE = `Usage:
  node roll.mjs --players 8 [--era "..."] [--tone "..."] [--setting "..."]
                [--seed N] [--history PATH] [--offline]
  node roll.mjs --remember PATH [--history PATH]

--remember takes a roll output or a case.json (with field "dice") and appends the run
to the history. Do this at the end of a finished game.`;

function parseArgs(argv) {
  const opts = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) throw new Error(`Unknown argument: ${a}`);
    const key = a.slice(2);
    if (key === 'offline' || key === 'help') { opts[key] = true; continue; }
    const val = argv[++i];
    if (val === undefined) throw new Error(`--${key} needs a value`);
    opts[key] = val;
  }
  return opts;
}

const load = (name) => JSON.parse(readFileSync(join(DATA, `${name}.json`), 'utf8'));
const norm = (s) => String(s).toLowerCase().normalize('NFC').trim();

// ---------- Randomness ----------

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const cryptoRandom = () => randomInt(0, 2 ** 47) / 2 ** 47;

async function fetchWithTimeout(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'application/json, text/plain' },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res;
}

async function randomOrgPool(n) {
  try {
    const url = `https://www.random.org/integers/?num=${n}&min=0&max=999999999&col=1&base=10&format=plain&rnd=new`;
    const text = await (await fetchWithTimeout(url)).text();
    const nums = text.trim().split(/\s+/).map(Number);
    if (nums.length !== n || nums.some((x) => !Number.isInteger(x))) return null;
    return nums.map((x) => x / 1e9);
  } catch {
    return null;
  }
}

function makeRng(pool) {
  let i = 0;
  const stats = { external: 0, crypto: 0 };
  const rng = () => {
    if (pool && i < pool.length) { stats.external++; return pool[i++]; }
    stats.crypto++;
    return cryptoRandom();
  };
  return { rng, stats };
}

function pick(rng, items, weight = (x) => x.weight ?? 1) {
  const ws = items.map((x) => Math.max(0, weight(x)));
  const total = ws.reduce((s, w) => s + w, 0);
  if (!items.length) throw new Error('Empty selection');
  if (total <= 0) return items[Math.floor(rng() * items.length)];
  let r = rng() * total;
  for (let i = 0; i < items.length; i++) {
    r -= ws[i];
    if (r < 0) return items[i];
  }
  return items[items.length - 1];
}

function pickDistinct(rng, items, n, weight) {
  const rest = [...items];
  const out = [];
  while (out.length < n && rest.length) {
    const x = pick(rng, rest, weight);
    out.push(x);
    rest.splice(rest.indexOf(x), 1);
  }
  return out;
}

// ---------- Inspiration ----------

function firstSentence(text) {
  const t = String(text || '').replace(/\s+/g, ' ').trim();
  const m = t.match(/^(.{20,}?[.!?])\s+(?=[A-ZÄÖÜ„"])/);
  const sentence = m ? m[1] : t;
  return sentence.length > 320 ? `${sentence.slice(0, 317)}...` : sentence;
}

async function wikipediaInspiration(count) {
  const out = [];
  const titles = new Set();
  const take = (title, extract, url) => {
    if (!title || !extract || titles.has(title) || out.length >= count) return;
    titles.add(title);
    out.push({ title, sentence: firstSentence(extract), url: url ?? null });
  };
  // One request for several articles is gentler on the Wikimedia rate limit.
  try {
    const url = 'https://de.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0'
      + `&grnlimit=${count + 2}&prop=extracts|info|pageprops&ppprop=disambiguation&inprop=url`
      + '&exintro=1&explaintext=1&exsentences=2&exlimit=max&format=json&formatversion=2';
    const data = await (await fetchWithTimeout(url)).json();
    for (const p of data?.query?.pages ?? []) {
      if (p.pageprops && 'disambiguation' in p.pageprops) continue;
      take(p.title, p.extract, p.fullurl);
    }
  } catch {}
  for (let i = 0; out.length < count && i < count + 1; i++) {
    try {
      const s = await (await fetchWithTimeout('https://de.wikipedia.org/api/rest_v1/page/random/summary')).json();
      if (s?.type !== 'disambiguation') take(s?.title, s?.extract, s?.content_urls?.desktop?.page);
    } catch {
      break;
    }
  }
  return out;
}

// ---------- History ----------

function readHistory(path) {
  if (!existsSync(path)) return [];
  try {
    const h = JSON.parse(readFileSync(path, 'utf8'));
    return Array.isArray(h) ? h : Array.isArray(h.runs) ? h.runs : [];
  } catch {
    return [];
  }
}

function remember(source, historyPath) {
  const data = JSON.parse(readFileSync(source, 'utf8'));
  const d = data.dice && Object.keys(data.dice).length ? data.dice : data;
  if (!d.setting || !d.means) throw new Error(`${source} contains no roll output`);
  const name = (x) => (x && typeof x === 'object' ? x.name : x) ?? null;
  const names = new Set();
  for (const r of data.roles ?? []) if (r.name) names.add(r.name);
  if (data.victim?.name) names.add(data.victim.name);
  if (data.investigator?.name) names.add(data.investigator.name);
  if (!names.size && d.names) {
    for (const n of [d.names.victim, d.names.investigator]) if (n?.full) names.add(n.full);
  }
  const entry = {
    date: new Date().toISOString(),
    title: data.title ?? null,
    era: name(d.era),
    setting: name(d.setting),
    occasion: name(d.occasion),
    milieu: name(d.milieu),
    victim_archetype: name(d.victim_archetype),
    means: name(d.means),
    motives: [name(d.motives?.culprit), name(d.motives?.red_herring)].filter(Boolean),
    twist: name(d.twist),
    tone: name(d.tone),
    names: [...names],
  };
  const runs = [...readHistory(historyPath), entry].slice(-HISTORY_MAX);
  mkdirSync(dirname(historyPath), { recursive: true });
  writeFileSync(historyPath, `${JSON.stringify({ runs }, null, 2)}\n`);
  return { remembered: true, file: historyPath, runs_in_history: runs.length, entry };
}

// ---------- Selection ----------

function fitsEra(item, era) {
  if (era.from == null) return true;
  if (item.from != null && item.from > era.to) return false;
  if (item.to != null && item.to < era.from) return false;
  return true;
}

function find(items, input) {
  const q = norm(input);
  return (
    items.find((x) => norm(x.name) === q) ??
    items.find((x) => norm(x.name).includes(q)) ??
    items.find((x) => q.includes(norm(x.name))) ??
    null
  );
}

const NAME_ERAS = [
  ['antiquity', -1000, 600],
  ['before-1800', 600, 1800],
  ['1800-1890', 1800, 1890],
  ['1890-1930', 1890, 1930],
  ['1930-1970', 1930, 1970],
  ['1970-2000', 1970, 2000],
  ['2000-today', 2000, 3000],
];

function customEra(input, notes) {
  const m = String(input).match(/(\d{1,4})\s*(v\.\s*Chr)?/);
  if (!m) {
    notes.push(`Era "${input}" is custom and has no year. Settings are not filtered by time, names come from the present and may need adjusting.`);
    return { name: input, time: input, from: null, to: null, name_eras: ['1970-2000', '2000-today'], surname_lists: ['german', 'austrian', 'swiss'], custom: true };
  }
  let year = Number(m[1]);
  if (m[2]) year = -year;
  const decade = /\d{3}0er/.test(input);
  // Adult characters were born roughly 20 to 70 years before the game year.
  const nameEras = NAME_ERAS.filter(([, from, to]) => from < year - 15 && to > year - 70).map(([k]) => k);
  const surnameLists = year < 600 ? ['antiquity'] : year > 2030 ? ['german', 'international'] : ['german', 'austrian', 'swiss'];
  return { name: input, time: String(input), from: year, to: decade ? year + 9 : year, name_eras: nameEras.length ? nameEras : ['2000-today'], surname_lists: surnameLists, custom: true };
}

function choose({ rng, list, given, field, era, blocked = new Set(), demote = new Set(), notes, givenFields, excluded }) {
  if (given) {
    givenFields.push(field);
    const hit = find(list, given);
    if (hit) {
      if (era && !fitsEra(hit, era)) notes.push(`${field} "${hit.name}" does not fit the era according to the table, but was given.`);
      return hit;
    }
    return { name: given, custom: true };
  }
  let candidates = era ? list.filter((x) => fitsEra(x, era)) : list;
  if (!candidates.length) candidates = list;
  const fresh = candidates.filter((x) => !blocked.has(x.name));
  if (fresh.length) {
    for (const x of candidates) if (blocked.has(x.name)) excluded.push(`${field}: ${x.name}`);
    candidates = fresh;
  }
  return pick(rng, candidates, (x) => (x.weight ?? 1) * (demote.has(x.name) ? 0.3 : 1));
}

function drawNames({ rng, names, era, count, victimGender, blockedSurnames, notes }) {
  const forbidden = new Set(names.blocked.map(norm));
  const ok = (n) => !forbidden.has(norm(n));
  const usedFirst = new Set();
  const usedLast = new Set();
  const listWeight = (k) => (k === 'german' || k === 'antiquity' ? 3 : 1);
  const eras = era.name_eras.filter((k) => names.first_names[k]);
  let exhausted = false;

  const one = (fixedGender) => {
    for (let attempt = 0; attempt < 200; attempt++) {
      const ne = eras[Math.floor(rng() * eras.length)];
      const table = names.first_names[ne];
      let g = fixedGender;
      if (!g) {
        const r = rng();
        g = table.neutral && r < 0.08 ? 'neutral' : r < 0.54 ? 'female' : 'male';
      }
      const firsts = (table[g] ?? table.female).filter((v) => ok(v) && !usedFirst.has(v));
      const lists = era.surname_lists.filter((k) => names.surnames[k]);
      const list = pick(rng, lists, listWeight);
      let lasts = names.surnames[list].filter((n) => ok(n) && !usedLast.has(n) && !blockedSurnames.has(norm(n)));
      if (!lasts.length) {
        lasts = lists.flatMap((k) => names.surnames[k]).filter((n) => ok(n) && !usedLast.has(n));
      }
      if (!firsts.length || !lasts.length) { exhausted = true; continue; }
      const first = firsts[Math.floor(rng() * firsts.length)];
      const last = lasts[Math.floor(rng() * lasts.length)];
      const full = `${first} ${last}`;
      if (!ok(full) || first === last) continue;
      usedFirst.add(first);
      usedLast.add(last);
      return { full, first, last, gender: { female: 'f', male: 'm', neutral: 'x' }[g], name_era: ne };
    }
    return null;
  };

  const victim = one(victimGender);
  const investigator = one(null);
  const pool = [];
  for (let i = 0; i < count; i++) {
    const n = one(null);
    if (!n) break;
    pool.push(n);
  }
  if (pool.length < count || exhausted) notes.push(`Name list for this era only yields ${pool.length} of ${count} pool names without duplicates.`);
  return { victim, investigator, pool };
}

// ---------- Main ----------

async function roll(opts) {
  const players = Number(opts.players);
  if (!Number.isInteger(players) || players < 3 || players > 30) throw new Error('--players must be an integer between 3 and 30');
  const seed = opts.seed != null ? Number(opts.seed) : null;
  if (seed != null && !Number.isFinite(seed)) throw new Error('--seed must be a number');
  const historyPath = resolve(opts.history ?? DEFAULT_HISTORY);
  const offline = Boolean(opts.offline);

  const [pool, inspiration] = await Promise.all([
    seed == null && !offline ? randomOrgPool(Math.min(500, 30 + (players * 3 + 2) * 5)) : Promise.resolve(null),
    offline ? Promise.resolve(null) : wikipediaInspiration(2).catch(() => []),
  ]);

  let rng;
  let stats = null;
  if (seed != null) rng = mulberry32(seed);
  else ({ rng, stats } = makeRng(pool));

  const T = Object.fromEntries(
    ['eras', 'settings', 'occasions', 'milieus', 'victim_archetypes', 'means', 'motive_families', 'twists', 'tones', 'seed_words', 'names'].map((n) => [n, load(n)]),
  );

  const runs = readHistory(historyPath).slice(-BLOCK_WINDOW);
  const recent = (field) => new Set(runs.map((l) => l[field]).filter(Boolean));
  const blockedSurnames = new Set(runs.flatMap((l) => l.names ?? []).flatMap((n) => String(n).split(/\s+/).slice(1)).map(norm));

  const notes = [];
  const givenFields = [];
  const excluded = [];
  const ctx = { rng, notes, givenFields, excluded };

  let era;
  if (opts.era) {
    givenFields.push('era');
    era = find(T.eras, opts.era) ?? customEra(opts.era, notes);
  } else {
    era = pick(rng, T.eras, (x) => (x.weight ?? 1) * (recent('era').has(x.name) ? 0.3 : 1));
  }

  const setting = choose({ ...ctx, list: T.settings, given: opts.setting, field: 'setting', era, blocked: recent('setting') });
  const occasion = choose({ ...ctx, list: T.occasions, field: 'occasion', era, demote: recent('occasion') });
  const milieu = choose({ ...ctx, list: T.milieus, field: 'milieu', era, demote: recent('milieu') });
  const victim_archetype = choose({ ...ctx, list: T.victim_archetypes, field: 'victim_archetype', era, blocked: recent('victim_archetype') });
  const means = choose({ ...ctx, list: T.means, field: 'means', era, blocked: recent('means') });
  const [culpritMotive, herringMotive] = pickDistinct(rng, T.motive_families, 2);
  const twist = choose({ ...ctx, list: T.twists, field: 'twist', blocked: recent('twist') });
  const tone = choose({ ...ctx, list: T.tones, given: opts.tone, field: 'tone', era, demote: recent('tone') });
  const seed_words = pickDistinct(rng, T.seed_words, 3, () => 1);

  const names = drawNames({
    rng,
    names: T.names,
    era,
    count: players * 3,
    victimGender: { f: 'female', m: 'male' }[victim_archetype.gender] ?? null,
    blockedSurnames,
    notes,
  });

  const random_source = seed != null
    ? `seed ${seed} (mulberry32, reproducible)`
    : stats.external && !stats.crypto ? 'random.org'
    : stats.external ? `random.org (${stats.external} values), then crypto (${stats.crypto} values)`
    : offline ? 'crypto (offline)' : 'crypto (random.org unreachable)';

  const without = (x, ...keys) => Object.fromEntries(Object.entries(x).filter(([k]) => !keys.includes(k)));

  return {
    version: 1,
    created: new Date().toISOString(),
    players,
    seed,
    random_source,
    inspiration_source: offline ? 'none (offline)' : inspiration?.length ? 'de.wikipedia.org (random articles)' : 'none (Wikipedia unreachable)',
    given: givenFields,
    era: without(era, 'weight'),
    setting: without(setting, 'weight'),
    occasion: without(occasion, 'weight'),
    milieu: without(milieu, 'weight'),
    victim_archetype: without(victim_archetype, 'weight'),
    means: without(means, 'weight'),
    motives: { culprit: without(culpritMotive, 'weight'), red_herring: without(herringMotive, 'weight') },
    twist: without(twist, 'weight'),
    tone: without(tone, 'weight'),
    seed_words,
    inspiration: inspiration ?? [],
    names,
    history: { file: historyPath, runs_considered: runs.length, excluded },
    notes,
  };
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) { console.log(USAGE); return; }
  if (opts.remember) {
    const result = remember(resolve(opts.remember), resolve(opts.history ?? DEFAULT_HISTORY));
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  if (!opts.players) throw new Error('--players is missing\n\n' + USAGE);
  console.log(JSON.stringify(await roll(opts), null, 2));
}

main().catch((e) => {
  console.error(`Error: ${e.message}`);
  process.exit(1);
});
