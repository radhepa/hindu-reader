// Deterministic Devanagari -> IAST transliterator.
// This is a rule-based mechanical mapping, NOT memory-generated content.
// It is gated by verify-translit.mjs against the known-good seed verses
// before it is trusted for any new verse.

const INDEP_VOWELS = {
  'अ': 'a', 'आ': 'ā', 'इ': 'i', 'ई': 'ī', 'उ': 'u', 'ऊ': 'ū',
  'ऋ': 'ṛ', 'ॠ': 'ṝ', 'ऌ': 'ḷ', 'ॡ': 'ḹ',
  'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au',
  'ऎ': 'e', 'ऒ': 'o', 'ऑ': 'ŏ', 'ऍ': 'ĕ',
};

const MATRAS = {
  'ा': 'ā', 'ि': 'i', 'ी': 'ī', 'ु': 'u', 'ू': 'ū',
  'ृ': 'ṛ', 'ॄ': 'ṝ', 'ॢ': 'ḷ', 'ॣ': 'ḹ',
  'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au',
  'ॆ': 'e', 'ॊ': 'o', 'ॉ': 'ŏ', 'ॅ': 'ĕ',
};

// Consonant base WITHOUT the inherent 'a'.
const CONSONANTS = {
  'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ṅ',
  'च': 'c', 'छ': 'ch', 'ज': 'j', 'झ': 'jh', 'ञ': 'ñ',
  'ट': 'ṭ', 'ठ': 'ṭh', 'ड': 'ḍ', 'ढ': 'ḍh', 'ण': 'ṇ',
  'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
  'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
  'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v',
  'श': 'ś', 'ष': 'ṣ', 'स': 's', 'ह': 'h',
  'ळ': 'ḻ', 'क़': 'q', 'ख़': 'k͟h', 'ग़': 'ġ', 'ज़': 'z',
  'ड़': 'ṛ', 'ढ़': 'ṛh', 'फ़': 'f', 'य़': 'ẏ',
};

const VIRAMA = '्';
const ANUSVARA = 'ं';   // -> ṁ (non-assimilated, matches seed convention)
const VISARGA = 'ः';    // -> ḥ
const CANDRABINDU = 'ँ'; // -> ̐
const AVAGRAHA = 'ऽ';   // -> '
const NUKTA = '़';
const OM = 'ॐ';

function isConsonant(ch) {
  return Object.prototype.hasOwnProperty.call(CONSONANTS, ch);
}

export function devanagariToIAST(input) {
  const chars = Array.from(input);
  let out = '';
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];

    if (ch === OM) { out += 'oṁ'; continue; }

    if (isConsonant(ch)) {
      out += CONSONANTS[ch];
      const next = chars[i + 1];
      if (next === VIRAMA) {
        // Bare consonant, no inherent vowel.
        i += 1;
      } else if (next && MATRAS[next]) {
        out += MATRAS[next];
        i += 1;
      } else {
        // Inherent 'a'.
        out += 'a';
      }
      continue;
    }

    if (INDEP_VOWELS[ch]) { out += INDEP_VOWELS[ch]; continue; }
    if (MATRAS[ch]) { out += MATRAS[ch]; continue; } // stray matra
    if (ch === ANUSVARA) { out += 'ṁ'; continue; }
    if (ch === VISARGA) { out += 'ḥ'; continue; }
    if (ch === CANDRABINDU) { out += '̐'; continue; }
    if (ch === AVAGRAHA) { out += "'"; continue; }
    if (ch === NUKTA) { continue; }

    // Dandas: dropped to match the established seed style (line breaks already
    // separate verse lines; the | bars are redundant in display).
    if (ch === '।' || ch === '॥') { continue; }
    if (ch === '\n') { out += '\n'; continue; }
    if (ch === ' ') { out += ' '; continue; }

    // Digits (Devanagari -> Arabic) — usually stripped from verse text.
    const dig = '०१२३४५६७८९'.indexOf(ch);
    if (dig >= 0) { out += String(dig); continue; }

    // Unknown — pass through so it is visible in diffs rather than silently dropped.
    out += ch;
  }
  return out;
}

// Normalize for comparison against editorially hyphenated/sandhi-split IAST:
// strip spaces, hyphens, apostrophes, dandas, and combining marks differences
// are NOT stripped (we want to catch real character errors).
export function normalizeForCompare(s) {
  return s
    .toLowerCase()
    .replace(/[\s\-'’|]/g, '')
    .replace(/‍/g, '')
    .trim();
}
