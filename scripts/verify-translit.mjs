// Gate: prove the transliterator reproduces the known-good IAST of the seed
// verses. We compare on NORMALIZED forms (hyphens/spaces/apostrophes removed)
// because the seed uses editorial compound-splitting the Devanagari does not
// encode. A character-level match on the normalized form means the
// transliterator is faithful; only the editorial word-splitting differs.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { devanagariToIAST, normalizeForCompare } from './translit.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const gita = JSON.parse(
  readFileSync(join(__dirname, '..', 'assets', 'data', 'gita.json'), 'utf8')
);

let pass = 0;
let fail = 0;
const failures = [];

for (const v of gita.verses) {
  const expected = v.transliteration;
  const got = devanagariToIAST(v.sanskrit);
  const en = normalizeForCompare(expected);
  const gn = normalizeForCompare(got);
  if (en === gn) {
    pass += 1;
  } else {
    fail += 1;
    failures.push({ id: v.id, expected, got, en, gn });
  }
}

console.log(`Transliterator gate: ${pass} pass / ${fail} fail (of ${gita.verses.length})`);
for (const f of failures) {
  console.log('\n--- MISMATCH ' + f.id + ' ---');
  console.log('expected IAST: ' + f.expected.replace(/\n/g, ' / '));
  console.log('got      IAST: ' + f.got.replace(/\n/g, ' / '));
  console.log('exp normalized: ' + f.en);
  console.log('got normalized: ' + f.gn);
  // Show first differing index.
  const n = Math.min(f.en.length, f.gn.length);
  let d = -1;
  for (let i = 0; i < n; i++) { if (f.en[i] !== f.gn[i]) { d = i; break; } }
  if (d === -1 && f.en.length !== f.gn.length) d = n;
  if (d >= 0) {
    console.log(`first diff at ${d}: exp "${f.en.slice(d, d + 8)}" vs got "${f.gn.slice(d, d + 8)}"`);
  }
}
