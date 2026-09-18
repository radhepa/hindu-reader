// Curated Mahabharata assembler — fuzzy cross-verified, 6 core parvas
// (Adi, Sabha, Vana, Udyoga, Bhishma, Shanti) per FEATURES.md. The full
// 18-parva text is explicitly out of V1 scope (DONTS.md).
//
// Sanskrit spine (clean, canonical refs): Pune (BORI) CRITICAL EDITION
//   e-text (Tokunaga/Smith, bombay.indology.info — the site states verbatim:
//   "the electronic text of the critical edition of the Mahābhārata").
//   BORI numbering is used, including verse 0 for opening invocations and
//   capital pada letters for prose units. Speaker lines ("vaiśaṁpāyana uvāca")
//   are prepended to their verse for display but EXCLUDED from match text.
// English (public domain): M. N. Dutt prose (1895–1905, vulgate-based),
//   via the Itihāsa corpus (Aralikatte et al., WAT 2021), shloka-aligned.
//
// Method — identical to the audited Ramayana runs:
//   bigram-Dice >= 0.5 on normalized Sanskrit, one-to-one greedy per parva,
//   positional-consistency gate for low-dice pairs, drop-never-guess.
//
// Outputs:
//   assets/data/mahabharata.json          (minified; provenance in meta.source)
//   scripts/_mahabharata_run_report.json  (per-parva stats + flagged pairs)
//   scripts/_mahabharata_pairs.json       (full audit trail)

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { devanagariToIAST } from './translit.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '..', 'assets', 'data');

const THRESHOLD = 0.5;
const FLAG_BELOW = 0.62;
const TOP_CANDIDATES = 48;

// App parva number (1..6) -> BORI book file + names + Itihāsa section locator.
const PARVAS = [
  { p: 1, bori: '01', name: 'Adi Parva' },
  { p: 2, bori: '02', name: 'Sabha Parva' },
  { p: 3, bori: '03', name: 'Vana Parva' },
  { p: 4, bori: '05', name: 'Udyoga Parva' },
  { p: 5, bori: '06', name: 'Bhishma Parva' },
  { p: 6, bori: '12', name: 'Shanti Parva' },
];

// ---------- 1. Parse the BORI CE e-text ----------
// Line forms (CRLF):  PPCCCVVVp  <pada text>   (p: a..z verse pada, A..Z prose)
//                     PPCCCVVV   <speaker line> ("X uvāca", no pada letter)
function parseBori(file, expectParva) {
  const raw = readFileSync(join(__dirname, file), 'utf8');
  const units = new Map(); // "chapter.verse" -> { padas: [], speaker: null }
  for (const line of raw.split(/\r?\n/)) {
    let m = line.match(/^(\d{2})(\d{3})(\d{3})([a-zA-Z])\s+(.+)/);
    if (m) {
      if (m[1] !== expectParva) throw new Error(`parva ${m[1]} in ${file}`);
      const key = `${Number(m[2])}.${Number(m[3])}`;
      if (!units.has(key)) units.set(key, { padas: [], speaker: null });
      units.get(key).padas.push(m[5].trim());
      continue;
    }
    m = line.match(/^(\d{2})(\d{3})(\d{3})\s+(.+)/);
    if (m) {
      if (m[1] !== expectParva) throw new Error(`parva ${m[1]} in ${file}`);
      const key = `${Number(m[2])}.${Number(m[3])}`;
      if (!units.has(key)) units.set(key, { padas: [], speaker: null });
      units.get(key).speaker = m[4].trim();
      continue;
    }
    if (line.trim() && !line.startsWith('%')) throw new Error(`unparsed line in ${file}: ${line.slice(0, 60)}`);
  }
  return [...units.entries()]
    .filter(([, u]) => u.padas.length > 0) // speaker-only units carry no text
    .map(([key, u]) => ({
      chapter: Number(key.split('.')[0]),
      verse: Number(key.split('.')[1]),
      dev: u.padas.join('\n'),          // match text: shloka only
      speaker: u.speaker,                // display text prepends this
    }))
    .sort((a, b) => a.chapter - b.chapter || a.verse - b.verse);
}

// ---------- 2. Itihāsa pools per parva ----------
// Dutt volume layout (verified by chapter resets + opening lines + vulgate
// adhyaya counts): vol-i = Adi(234)+Sabha(81); vol-ii = Vana(315);
// vol-iii = Virata(72)+Udyoga(194); vol-iv = Bhishma(124);
// vol-vii(1..173)+vol-viii(174..365) = Shanti.
const itihasa = JSON.parse(readFileSync(join(__dirname, '_itihasa_mahabharata.json'), 'utf8'));
// 71 chapter labels in this corpus carry OCR letter-O for zero ("1O" = 10,
// "11O" = 110). Sanitize before Number() so the positional gate sees real
// chapter numbers (NaN would silently disable it for those chapters).
function chapterNum(label) {
  const s = String(label).replace(/O/g, '0');
  if (!/^\d+$/.test(s)) throw new Error(`unparseable chapter label: ${label}`);
  return Number(s);
}
function sectionsOf(vol) {
  const secs = [];
  let prev = Infinity;
  for (const rec of itihasa[vol]) {
    const ch = chapterNum(rec.chapter);
    if (ch < prev) secs.push([]);
    secs[secs.length - 1].push(rec);
    prev = ch;
  }
  return secs;
}
const v1 = sectionsOf('vol-i'), v2 = sectionsOf('vol-ii'), v3 = sectionsOf('vol-iii'),
      v4 = sectionsOf('vol-iv'), v7 = sectionsOf('vol-vii'), v8 = sectionsOf('vol-viii');
const expect = (secs, lens, vol) => {
  if (secs.length !== lens.length || secs.some((s, i) => s.length !== lens[i]))
    throw new Error(`${vol} sections ${secs.map((s) => s.length)} != expected ${lens}`);
};
expect(v1, [234, 81], 'vol-i');
expect(v2, [315], 'vol-ii');
expect(v3, [72, 194], 'vol-iii');
expect(v4, [124], 'vol-iv');
expect(v7, [173], 'vol-vii');
expect(v8, [192], 'vol-viii');
if (chapterNum(v8[0][0].chapter) !== 174) throw new Error('vol-viii must continue Shanti at ch 174');

const sectionByParva = {
  1: [['vol-i', v1[0]]],
  2: [['vol-i', v1[1]]],
  3: [['vol-ii', v2[0]]],
  4: [['vol-iii', v3[1]]],
  5: [['vol-iv', v4[0]]],
  6: [['vol-vii', v7[0]], ['vol-viii', v8[0]]],
};
function poolFor(p) {
  const pool = [];
  for (const [vol, recs] of sectionByParva[p]) {
    for (const rec of recs) {
      const n = Math.min(rec.sn.length, rec.en.length);
      for (let j = 0; j < n; j++) {
        const sn = String(rec.sn[j] ?? '').trim();
        const en = String(rec.en[j] ?? '').trim();
        if (sn.length < 8 || en.length < 8) continue;
        pool.push({ sn, en, ch: chapterNum(rec.chapter), ref: `${vol}/ch${rec.chapter}#${j + 1}` });
      }
    }
  }
  return pool;
}

// ---------- 3. Matching (identical normalization/scoring to Ramayana runs) ----------
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

// Seed explanation carryover (the mangalacharana's curated explanation),
// keyed by normalized Sanskrit so renumbering (1.1.1 -> BORI 1.1.0) is safe.
const seed = JSON.parse(readFileSync(join(dataDir, 'mahabharata.json'), 'utf8'));
const seedExplanations = new Map(
  seed.verses
    .filter((v) => v.explanations && Object.keys(v.explanations).length > 0)
    .map((v) => [normMatch(v.sanskrit), v.explanations])
);

const verses = [];
const report = {
  run: new Date().toISOString(), threshold: THRESHOLD, parvas: {},
  flagged: [], dropped_positional: [],
};
const allPairs = [];

for (const { p, bori, name } of PARVAS) {
  const ce = parseBori(`_bori_mbh${bori}.txt`, bori);
  const pool = poolFor(p);

  const poolGrams = pool.map((e) => bigrams(normMatch(e.sn)));
  const poolN = poolGrams.map(gramCount);
  const postingCap = Math.max(1500, Math.floor(pool.length * 0.15));
  const inv = new Map();
  poolGrams.forEach((g, i) => {
    for (const b of g.keys()) {
      if (!inv.has(b)) inv.set(b, []);
      inv.get(b).push(i);
    }
  });

  const pairs = [];
  for (let ci = 0; ci < ce.length; ci++) {
    const g = bigrams(normMatch(ce[ci].dev));
    const n = gramCount(g);
    const hits = new Map();
    for (const b of g.keys()) {
      const post = inv.get(b);
      if (!post || post.length > postingCap) continue;
      for (const pi of post) hits.set(pi, (hits.get(pi) || 0) + 1);
    }
    const cand = [...hits.entries()].sort((a, b) => b[1] - a[1]).slice(0, TOP_CANDIDATES);
    for (const [pi] of cand) {
      const d = dice(g, poolGrams[pi], n, poolN[pi]);
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

  // Positional gate: CE adhyaya -> Dutt chapter consensus from >=0.7 pairs;
  // low-dice pairs >5 chapters off consensus are dropped (formulaic collisions).
  const byAdhyaya = new Map();
  for (const [ci, a] of assign) {
    if (a.score < 0.7) continue;
    const c = ce[ci].chapter;
    if (!byAdhyaya.has(c)) byAdhyaya.set(c, []);
    byAdhyaya.get(c).push(pool[a.pi].ch);
  }
  const median = (xs) => xs.slice().sort((x, y) => x - y)[Math.floor(xs.length / 2)];
  const consensus = new Map();
  for (const [c, chs] of byAdhyaya) consensus.set(c, median(chs));
  const expectedFor = (c) => {
    if (consensus.has(c)) return consensus.get(c);
    for (let d = 1; d <= 12; d++) {
      if (consensus.has(c - d)) return consensus.get(c - d);
      if (consensus.has(c + d)) return consensus.get(c + d);
    }
    return null;
  };
  let droppedPositional = 0;
  for (const [ci, a] of [...assign]) {
    if (a.score >= FLAG_BELOW) continue;
    const exp = expectedFor(ce[ci].chapter);
    if (exp != null && Math.abs(pool[a.pi].ch - exp) > 5) {
      assign.delete(ci);
      droppedPositional++;
      report.dropped_positional.push({
        ref: `${p}.${ce[ci].chapter}.${ce[ci].verse}`, dice: Number(a.score.toFixed(3)),
        itihasa: pool[a.pi].ref, expected_chapter: exp,
      });
    }
  }

  let shipped = 0;
  for (let ci = 0; ci < ce.length; ci++) {
    const a = assign.get(ci);
    if (!a) continue; // no agreeing English -> drop, never guess
    const { chapter, verse, dev, speaker } = ce[ci];
    if (a.score < FLAG_BELOW) {
      report.flagged.push({
        ref: `${p}.${chapter}.${verse}`, dice: Number(a.score.toFixed(3)), itihasa: pool[a.pi].ref,
      });
    }
    allPairs.push({ ref: `${p}.${chapter}.${verse}`, dice: Number(a.score.toFixed(3)), itihasa: pool[a.pi].ref });
    const displayDev = speaker ? `${speaker}\n${dev}` : dev;
    verses.push({
      id: `mbh_${p}_${chapter}_${verse}`,
      book: 'mahabharata',
      parva: p,
      parva_name: name,
      chapter,
      verse,
      sanskrit: displayDev,
      transliteration: devanagariToIAST(displayDev),
      translations: { english: tidyEnglish(pool[a.pi].en) },
      explanations: seedExplanations.get(normMatch(dev)) ?? {},
      daily_quote_eligible: false, // set below: first shipped verse per parva
      holiday_tags: [],
    });
    shipped++;
  }

  report.parvas[p] = {
    name, bori_book: bori,
    ce_verses: ce.length, itihasa_pool: pool.length,
    shipped, dropped_positional: droppedPositional,
    match_rate: Number((shipped / ce.length).toFixed(3)),
  };
  console.log(
    `parva ${p} ${name} (BORI ${bori}): CE ${ce.length} | pool ${pool.length} | shipped ${shipped} (${(100 * shipped / ce.length).toFixed(1)}%) | positional drops ${droppedPositional}`
  );
}

verses.sort((a, b) => a.parva - b.parva || a.chapter - b.chapter || a.verse - b.verse);

// Daily-quote eligibility: each parva's first shipped verse (per DATA.md §6
// "key Parva opening verses"; further curation is a human editorial pass).
const seenParva = new Set();
for (const v of verses) {
  if (!seenParva.has(v.parva)) {
    v.daily_quote_eligible = true;
    seenParva.add(v.parva);
  }
}

// ---------- 4. Integrity gates ----------
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
console.log(`duplicate English across shipped verses: ${dupEnglish}`);
report.duplicate_english = dupEnglish;

// ---------- 5. Write book file ----------
const perParva = {};
for (const v of verses) perParva[v.parva] = (perParva[v.parva] || 0) + 1;
const chapters = PARVAS.map(({ p, name }) => ({ number: p, name, verse_count: perParva[p] || 0 }));
const meta = {
  ...seed.meta,
  subtitle: 'Curated · 6 core Parvas',
  total_chapters: 6,
  total_verses: verses.length,
  sub_structure_unit: 'adhyaya',
  source: {
    sanskrit: 'Pune (BORI) critical edition e-text (M. Tokunaga, rev. J. Smith), bombay.indology.info — public domain. BORI numbering (incl. verse 0 invocations).',
    english_translator: 'Manmatha Nath Dutt (1895–1905), public domain',
    english_via: 'Itihāsa corpus (Aralikatte et al., WAT 2021), shloka-aligned',
    transliteration: 'Mechanical IAST, scripts/translit.mjs',
    cross_check: `CE Sanskrit fuzzy-matched (bigram-Dice ≥ ${THRESHOLD}, one-to-one per parva, positional gate) to independent Itihāsa Sanskrit; refs + Sanskrit from CE verbatim; unmatched verses dropped, never filled`,
    verified: true,
  },
};
writeFileSync(join(dataDir, 'mahabharata.json'), JSON.stringify({ meta, chapters, verses }) + '\n');
JSON.parse(readFileSync(join(dataDir, 'mahabharata.json'), 'utf8')); // re-parse gate

writeFileSync(join(__dirname, '_mahabharata_run_report.json'), JSON.stringify(report, null, 2) + '\n');
writeFileSync(join(__dirname, '_mahabharata_pairs.json'), JSON.stringify(allPairs) + '\n');

console.log(`TOTAL shipped: ${verses.length} | flagged (dice ${THRESHOLD}–${FLAG_BELOW}): ${report.flagged.length}`);
console.log('per-parva:', JSON.stringify(perParva));
