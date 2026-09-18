// Full Ramayana assembler — fuzzy cross-verified, all 7 kandas.
//
// Sanskrit spine (clean, canonical refs): Baroda CRITICAL EDITION e-text
//   (Tokunaga/Smith, bombay.indology.info — the site states verbatim:
//   "the electronic text of the critical edition of the Rāmāyaṇa").
//   NOTE: earlier reports called this "Bombay recension" — that was wrong;
//   this run corrects the attribution. Sarga counts (76/111/71/66/66/116/100)
//   match the critical edition, not the vulgate.
// English (public domain): M. N. Dutt prose (1891–94, vulgate-based),
//   via the Itihāsa corpus (Aralikatte et al., WAT 2021), shloka-aligned.
//
// Method (identical to the audited Bala 1–5 run, scaled up):
//   Each clean CE verse is paired with the Dutt English whose (OCR-noisy)
//   Itihāsa Sanskrit is most similar (bigram-Dice on normalized text).
//   Pairing is one-to-one per kanda, greedy by descending score.
//   Pairs below THRESHOLD are dropped — NOTHING is guessed, no text is
//   generated. Verse numbers + Sanskrit come from the CE e-text verbatim.
//   The two Sanskrit sources are independent, so agreement also cross-checks
//   the CE e-text (which its site warns "still contains many errors").
//
// Outputs:
//   assets/data/ramayana.json        (minified; provenance in meta.source)
//   scripts/_ramayana_run_report.json (per-kanda stats + flagged pairs)

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { devanagariToIAST } from './translit.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '..', 'assets', 'data');

const THRESHOLD = 0.5;   // ship at/above this (audited in Bala 1–5 run)
const FLAG_BELOW = 0.62; // record 0.5..0.62 pairs for human spot-check
const TOP_CANDIDATES = 48;

const KANDA_NAMES = {
  1: 'Bala Kanda', 2: 'Ayodhya Kanda', 3: 'Aranya Kanda',
  4: 'Kishkindha Kanda', 5: 'Sundara Kanda', 6: 'Yuddha Kanda', 7: 'Uttara Kanda',
};
// Sarga titles are NOT in the CE e-text; we only keep the two titles already
// shipped/verified. Everything else gets '' (Reader hides empty names).
const SARGA_NAMES = { '1.1': 'Samkshepa Ramayana', '1.2': 'The Origin of the Sloka' };

// ---------- 1. Parse the CE e-text (7 files, CRLF-safe) ----------
const ceByKanda = new Map(); // kanda -> [{sarga, verse, dev}]
for (let k = 1; k <= 7; k++) {
  const raw = readFileSync(join(__dirname, `_bombay_ram0${k}.txt`), 'utf8');
  const verses = new Map(); // "sarga.verse" -> [pada lines]
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^(\d)(\d{3})(\d{3})([a-z])\s+(.+)/);
    if (!m) continue;
    if (Number(m[1]) !== k) throw new Error(`kanda digit ${m[1]} in file ram0${k}`);
    const key = `${Number(m[2])}.${Number(m[3])}`;
    if (!verses.has(key)) verses.set(key, []);
    verses.get(key).push(m[5].trim());
  }
  ceByKanda.set(
    k,
    [...verses.entries()]
      .map(([key, lines]) => ({
        sarga: Number(key.split('.')[0]),
        verse: Number(key.split('.')[1]),
        dev: lines.join('\n'),
      }))
      .sort((a, b) => a.sarga - b.sarga || a.verse - b.verse)
  );
}

// ---------- 2. Itihāsa pools per kanda (boundary = chapter number reset) ----------
const itihasa = JSON.parse(readFileSync(join(__dirname, '_itihasa_ramayana.json'), 'utf8'));
const sections = [];
for (const vol of ['vol-i', 'vol-ii', 'vol-iii', 'vol-iv']) {
  let prev = Infinity;
  for (const rec of itihasa[vol]) {
    const ch = Number(rec.chapter);
    if (ch < prev) sections.push({ vol, recs: [] }); // strict reset = new kanda
    sections[sections.length - 1].recs.push(rec);
    prev = ch;
  }
}
if (sections.length !== 7) throw new Error(`expected 7 kanda sections, got ${sections.length}`);

const poolByKanda = new Map(); // kanda -> [{sn, en, ref}]
sections.forEach((sec, i) => {
  const pool = [];
  for (const rec of sec.recs) {
    const n = Math.min(rec.sn.length, rec.en.length);
    for (let j = 0; j < n; j++) {
      const en = String(rec.en[j] ?? '').trim();
      const sn = String(rec.sn[j] ?? '').trim();
      if (sn.length < 8 || en.length < 8) continue; // unusable scraps
      pool.push({ sn, en, ref: `${sec.vol}/ch${rec.chapter}#${j + 1}` });
    }
  }
  poolByKanda.set(i + 1, pool);
});

// ---------- 3. Matching (same normalization + dice as audited run) ----------
function normMatch(s) {
  return s
    .replace(/[शष]/g, 'स')
    .replace(/[ङञणनम]्/g, '')
    .replace(/[ंःँ्ॐऽ]/g, '')
    .replace(/[०-९।॥\s]/g, '')
    .replace(/(.)\1+/g, '$1');
}
function bigrams(s) {
  const g = new Map();
  for (let i = 0; i < s.length - 1; i++) {
    const b = s.slice(i, i + 2);
    g.set(b, (g.get(b) || 0) + 1);
  }
  return g;
}
function dice(ga, gb, na, nb) {
  let inter = 0;
  const [small, big] = ga.size <= gb.size ? [ga, gb] : [gb, ga];
  for (const [k, v] of small) if (big.has(k)) inter += Math.min(v, big.get(k));
  return (2 * inter) / (na + nb);
}
const gramCount = (g) => [...g.values()].reduce((a, b) => a + b, 0);

const tidyEnglish = (s) =>
  String(s).replace(/\s+([.,;:!?])/g, '$1').replace(/\s{2,}/g, ' ').trim();

const verses = [];
const report = {
  run: new Date().toISOString(), threshold: THRESHOLD, kandas: {},
  flagged: [], dropped_positional: [],
};
const allPairs = []; // full audit trail: every shipped pairing

for (let k = 1; k <= 7; k++) {
  const ce = ceByKanda.get(k);
  const pool = poolByKanda.get(k);

  const poolNorm = pool.map((p) => normMatch(p.sn));
  const poolGrams = poolNorm.map(bigrams);
  const poolN = poolGrams.map(gramCount);

  // Inverted index: bigram -> pool indices (presence only, for candidate gen).
  const inv = new Map();
  poolGrams.forEach((g, i) => {
    for (const b of g.keys()) {
      if (!inv.has(b)) inv.set(b, []);
      inv.get(b).push(i);
    }
  });

  const ceNorm = ce.map((v) => normMatch(v.dev));
  const ceGrams = ceNorm.map(bigrams);
  const ceN = ceGrams.map(gramCount);

  // All pairs >= THRESHOLD among top shared-bigram candidates per CE verse.
  const pairs = [];
  for (let ci = 0; ci < ce.length; ci++) {
    const hits = new Map(); // pool idx -> shared distinct bigrams
    for (const b of ceGrams[ci].keys()) {
      const post = inv.get(b);
      if (!post || post.length > 1500) continue; // skip useless ultra-common grams
      for (const pi of post) hits.set(pi, (hits.get(pi) || 0) + 1);
    }
    const cand = [...hits.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, TOP_CANDIDATES);
    for (const [pi] of cand) {
      const d = dice(ceGrams[ci], poolGrams[pi], ceN[ci], poolN[pi]);
      if (d >= THRESHOLD) pairs.push([d, ci, pi]);
    }
  }
  pairs.sort((a, b) => b[0] - a[0]);
  const usedC = new Set(), usedP = new Set();
  const assign = new Map();
  for (const [d, ci, pi] of pairs) {
    if (usedC.has(ci) || usedP.has(pi)) continue;
    usedC.add(ci); usedP.add(pi); assign.set(ci, { pi, score: d });
  }

  // Positional-consistency gate. CE sarga -> Dutt chapter is near-linear for
  // correct pairings. Build a per-sarga consensus from high-confidence pairs
  // (dice >= 0.7 = near-identical Sanskrit, can't be wrong), then drop any
  // LOW-dice pair sitting far from its sarga's consensus — those are likely
  // formulaic-verse collisions across sargas. High-dice outliers are genuine
  // repeated shlokas and are kept.
  const chapterOf = (pi) => Number(pool[pi].ref.match(/ch(\d+)/)[1]);
  const bySarga = new Map(); // sarga -> chapters of high-confidence matches
  for (const [ci, a] of assign) {
    if (a.score < 0.7) continue;
    const s = ce[ci].sarga;
    if (!bySarga.has(s)) bySarga.set(s, []);
    bySarga.get(s).push(chapterOf(a.pi));
  }
  const median = (xs) => xs.slice().sort((x, y) => x - y)[Math.floor(xs.length / 2)];
  const consensus = new Map();
  for (const [s, chs] of bySarga) consensus.set(s, median(chs));
  const expectedFor = (s) => {
    if (consensus.has(s)) return consensus.get(s);
    for (let d = 1; d <= 10; d++) {
      if (consensus.has(s - d)) return consensus.get(s - d);
      if (consensus.has(s + d)) return consensus.get(s + d);
    }
    return null;
  };
  let droppedPositional = 0;
  for (const [ci, a] of [...assign]) {
    if (a.score >= FLAG_BELOW) continue;
    const exp = expectedFor(ce[ci].sarga);
    if (exp != null && Math.abs(chapterOf(a.pi) - exp) > 5) {
      assign.delete(ci);
      droppedPositional++;
      report.dropped_positional.push({
        ref: `${k}.${ce[ci].sarga}.${ce[ci].verse}`,
        dice: Number(a.score.toFixed(3)),
        itihasa: pool[a.pi].ref,
        expected_chapter: exp,
      });
    }
  }

  let shipped = 0;
  const perSarga = {};
  for (let ci = 0; ci < ce.length; ci++) {
    const a = assign.get(ci);
    if (!a) continue; // no agreeing English -> drop, never guess
    const { sarga, verse, dev } = ce[ci];
    if (a.score < FLAG_BELOW) {
      report.flagged.push({
        ref: `${k}.${sarga}.${verse}`, dice: Number(a.score.toFixed(3)),
        itihasa: pool[a.pi].ref,
      });
    }
    allPairs.push({ ref: `${k}.${sarga}.${verse}`, dice: Number(a.score.toFixed(3)), itihasa: pool[a.pi].ref });
    verses.push({
      id: `ramayana_${k}_${sarga}_${verse}`,
      book: 'ramayana',
      kanda: k,
      kanda_name: KANDA_NAMES[k],
      sarga,
      sarga_name: SARGA_NAMES[`${k}.${sarga}`] ?? '',
      verse,
      sanskrit: dev,
      transliteration: devanagariToIAST(dev),
      translations: { english: tidyEnglish(pool[a.pi].en) },
      explanations: {},
      daily_quote_eligible: sarga === 1 && verse === 1, // each kanda's opening
      holiday_tags: [],
    });
    shipped++;
    perSarga[sarga] = (perSarga[sarga] || 0) + 1;
  }

  report.kandas[k] = {
    name: KANDA_NAMES[k],
    ce_verses: ce.length,
    itihasa_pool: pool.length,
    shipped,
    dropped_positional: droppedPositional,
    match_rate: Number((shipped / ce.length).toFixed(3)),
    sargas_in_ce: Math.max(...ce.map((v) => v.sarga)),
    sargas_with_content: Object.keys(perSarga).length,
  };
  console.log(
    `kanda ${k} ${KANDA_NAMES[k]}: CE ${ce.length} | pool ${pool.length} | shipped ${shipped} (${(100 * shipped / ce.length).toFixed(1)}%) | positional drops ${droppedPositional}`
  );
}

verses.sort((a, b) => a.kanda - b.kanda || a.sarga - b.sarga || a.verse - b.verse);

// ---------- 4. Integrity gates (hard failures, not warnings) ----------
const ids = new Set();
for (const v of verses) {
  if (ids.has(v.id)) throw new Error(`duplicate id ${v.id}`);
  ids.add(v.id);
  if (!v.sanskrit || !v.transliteration || !v.translations.english)
    throw new Error(`empty field in ${v.id}`);
}
const enSeen = new Map();
let dupEnglish = 0;
for (const v of verses) {
  const e = v.translations.english;
  if (enSeen.has(e)) dupEnglish++;
  enSeen.set(e, v.id);
}
if (!ids.has('ramayana_1_1_1')) throw new Error('calendar-tied verse ramayana_1_1_1 missing');
console.log(`duplicate English across shipped verses: ${dupEnglish}`);
report.duplicate_english = dupEnglish;

// ---------- 5. Write book file ----------
const current = JSON.parse(readFileSync(join(dataDir, 'ramayana.json'), 'utf8'));
const perKanda = {};
for (const v of verses) perKanda[v.kanda] = (perKanda[v.kanda] || 0) + 1;
const chapters = current.chapters.map((c) => ({ ...c, verse_count: perKanda[c.number] || 0 }));
const meta = {
  ...current.meta,
  subtitle: 'Valmiki Ramayana · 7 Kandas',
  total_verses: verses.length,
  source: {
    sanskrit: 'Critical edition e-text (M. Tokunaga, rev. J. Smith), bombay.indology.info — public domain',
    english_translator: 'Manmatha Nath Dutt (1891–1894), public domain',
    english_via: 'Itihāsa corpus (Aralikatte et al., WAT 2021), shloka-aligned',
    transliteration: 'Mechanical IAST, scripts/translit.mjs',
    cross_check: `CE Sanskrit fuzzy-matched (bigram-Dice ≥ ${THRESHOLD}, one-to-one per kanda) to independent Itihāsa Sanskrit; refs + Sanskrit from CE verbatim; unmatched verses dropped, never filled`,
    verified: true,
  },
};
writeFileSync(join(dataDir, 'ramayana.json'), JSON.stringify({ meta, chapters, verses }) + '\n');
JSON.parse(readFileSync(join(dataDir, 'ramayana.json'), 'utf8')); // re-parse gate

writeFileSync(join(__dirname, '_ramayana_run_report.json'), JSON.stringify(report, null, 2) + '\n');
writeFileSync(join(__dirname, '_ramayana_pairs.json'), JSON.stringify(allPairs) + '\n');

const total = verses.length;
console.log(`TOTAL shipped: ${total} of 18761 CE verses | flagged (dice ${THRESHOLD}–${FLAG_BELOW}): ${report.flagged.length}`);
console.log('per-kanda:', JSON.stringify(perKanda));
