// Mechanical gap detector for the scripture JSON files.
// Pure structural analysis — does NOT touch or generate any verse content.
// Per SCRIPTURE_FILL.md §2b: report gaps before anything is filled.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '..', 'assets', 'data');

const PLACEHOLDER_RE = /^(todo|placeholder|tbd|xxx|n\/a|)$/i;

const FILES = [
  { id: 'gita', file: 'gita.json', unit: 'chapter' },
  { id: 'ramayana', file: 'ramayana.json', unit: 'kanda' },
  { id: 'mahabharata', file: 'mahabharata.json', unit: 'parva' },
];

function chapterNumberOf(verse, unit) {
  if (unit === 'chapter') return verse.chapter;
  if (unit === 'kanda') return verse.kanda;
  if (unit === 'parva') return verse.parva;
  return undefined;
}

const report = [];

for (const { id, file, unit } of FILES) {
  const raw = readFileSync(join(dataDir, file), 'utf8');
  let json;
  try {
    json = JSON.parse(raw);
  } catch (e) {
    report.push({ id, parseError: String(e) });
    continue;
  }

  const meta = json.meta ?? {};
  const chapters = json.chapters ?? [];
  const verses = json.verses ?? [];

  // Group present verses by top-level unit number.
  const byChapter = new Map();
  for (const v of verses) {
    const cn = chapterNumberOf(v, unit);
    if (!byChapter.has(cn)) byChapter.set(cn, []);
    byChapter.get(cn).push(v);
  }

  // Detect placeholder / empty translation or sanskrit fields.
  const placeholders = [];
  for (const v of verses) {
    const en = v.translations?.english ?? '';
    const sa = v.sanskrit ?? '';
    if (PLACEHOLDER_RE.test(String(en).trim())) {
      placeholders.push({ id: v.id, field: 'translations.english', value: en });
    }
    if (PLACEHOLDER_RE.test(String(sa).trim())) {
      placeholders.push({ id: v.id, field: 'sanskrit', value: sa });
    }
  }

  const declaredTotalVerses = meta.total_verses ?? null;
  const presentTotalVerses = verses.length;

  const chapterReport = chapters.map((ch) => {
    const present = byChapter.get(ch.number) ?? [];
    const presentNums = present.map((v) => v.verse).sort((a, b) => a - b);
    return {
      number: ch.number,
      name: ch.name,
      declared: ch.verse_count,
      present: present.length,
      missing: Math.max(0, (ch.verse_count ?? 0) - present.length),
      presentVerseNums: presentNums,
    };
  });

  report.push({
    id,
    title: meta.title,
    structureLabel: meta.structure_label,
    declaredChapters: meta.total_chapters,
    declaredTotalVerses,
    presentTotalVerses,
    missingTotalVerses:
      declaredTotalVerses != null ? declaredTotalVerses - presentTotalVerses : null,
    placeholders,
    chapters: chapterReport,
  });
}

// Pretty console print.
for (const r of report) {
  console.log('='.repeat(70));
  console.log(`${r.title} (${r.id})`);
  console.log(
    `  Declared ${r.declaredChapters} ${r.structureLabel?.toLowerCase()}s · ${r.declaredTotalVerses} verses`
  );
  console.log(
    `  Present ${r.presentTotalVerses} verses · MISSING ${r.missingTotalVerses}`
  );
  if (r.placeholders.length) {
    console.log(`  PLACEHOLDER/EMPTY fields: ${r.placeholders.length}`);
    for (const p of r.placeholders) console.log(`    - ${p.id} ${p.field}`);
  } else {
    console.log('  No placeholder/empty content in present verses.');
  }
  console.log('  Per-unit:');
  for (const c of r.chapters) {
    const flag = c.missing > 0 ? 'GAP' : 'ok ';
    const nums = c.presentVerseNums.length
      ? ` present: [${c.presentVerseNums.join(', ')}]`
      : ' present: []';
    console.log(
      `   [${flag}] ${r.structureLabel} ${String(c.number).padStart(2)} ${c.name.padEnd(34)} ${String(c.present).padStart(3)}/${String(c.declared).padStart(5)} (missing ${c.missing})${c.missing > 0 ? nums : ''}`
    );
  }
}

// Emit machine-readable JSON at the end for downstream report authoring.
console.log('\n---JSON-REPORT-START---');
console.log(JSON.stringify(report, null, 2));
console.log('---JSON-REPORT-END---');
