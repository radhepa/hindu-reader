# VERIFICATION_LOG.md

## Run 2026-06-11 (later) — CURATED MAHABHARATA (6 core parvas, 38,425 verses)

Pipeline: `scripts/assemble-mahabharata.mjs` — the audited Ramayana methodology
applied to the six V1 parvas (Adi, Sabha, Vana, Udyoga, Bhishma, Shanti per
FEATURES.md; full 18-parva text is explicitly out of V1 scope per DONTS.md).

### Checks

```
[CHECK 1] Source Traceability — PASS — Sanskrit: Pune (BORI) CRITICAL EDITION
          e-text (Tokunaga/Smith, bombay.indology.info: "the electronic text of
          the critical edition of the Mahābhārata"), books 01/02/03/05/06/12,
          44,238 verse units parsed with a hard throw on any unparsed line.
          BORI numbering kept verbatim (incl. verse 0 invocations; prose units;
          speaker lines prepended for display, excluded from match text).
          English: M. N. Dutt prose 1895–1905 (PD) via Itihāsa corpus; volume
          layout VERIFIED before use (chapter resets + opening lines + vulgate
          adhyaya counts: vol-i=Adi 234+Sabha 81, vol-ii=Vana 315, vol-iii=
          Virata 72+Udyoga 194, vol-iv=Bhishma 124, vol-vii+viii=Shanti 173+192,
          enforced by asserts). Full pairing audit: scripts/_mahabharata_pairs.json.
[CHECK 2] Cross-Reference — PASS (by construction) — bigram-Dice >= 0.5 between
          the two independent Sanskrit sources, one-to-one per parva, positional-
          consistency gate (20 drops). 5,813 CE verses without agreeing English
          were DROPPED, never filled. Data fix this run: 71 corpus chapter labels
          carried OCR letter-O for zero ("11O"=110) — sanitized so the positional
          gate sees real numbers (results identical before/after; now provably so).
[CHECK 3] Schema & Consistency — PASS — JSON.parse clean; 38,425/38,425 carry
          sanskrit + transliteration + english; ids unique (mbh_{parva}_{adhyaya}_
          {verse}, app parva numbers 1–6); ordering strictly monotonic; meta ==
          chapters sum == verse count. Duplicate English: 13 — 6 consecutive-verse
          paragraph shares + 7 in KNOWN repeated-formula passages (Sabha 54/58
          dice-game refrain, Bhishma 16/95 Duryodhana's repeated order, Shanti 29
          Sixteen-Kings litany, etc.); the Sabha and Shanti groups verified to have
          IDENTICAL Sanskrit — genuine textual repetition, correctly translated.
[CHECK 4] Contextual Coherence — PASS (sampled) — verified by hand: mangalacharana
          (1.1.0, seed explanation carried over by Sanskrit match); BG 2.47 INSIDE
          Bhishma Parva (mbh_5_24_47 = BORI 6.24.47, karmaṇy evādhikāras te — Dutt's
          independent rendering is correct, a strong cross-pipeline check against
          gita.json); Shanti opening (water oblations on the Ganga); Vidura-style
          paṇḍita verse (5.33.17); 9 deterministic low-confidence samples: 7 exact,
          2 adjacent-context within the right scene (documented Dutt paragraph
          grain; both flagged). Parva openers 1–6 all shipped + daily-quote eligible.
```

### Numbers

```
1 Adi:    6,006 / 7,197 CE (83.5%)    4 Udyoga:  5,627 / 6,063 (92.8%)
2 Sabha:  2,054 / 2,390 CE (85.9%)    5 Bhishma: 4,503 / 5,406 (83.3%)
3 Vana:   8,765 / 10,316 CE (85.0%)   6 Shanti: 11,470 / 12,866 (89.1%)
TOTAL: 38,425 / 44,238 (86.9%) · flagged (dice 0.5–0.62): 2,833 · positional drops: 20
Adhyayas with zero verses: 2 of 1,263 (Udyoga 61, 159) · file: 29.4 MB minified
```

### Known limitations (documented, not fixed silently)
- Same Dutt paragraph-grain caveat as the Ramayana; 2,833 flagged pairings ship
  but are listed in scripts/_mahabharata_run_report.json for human review.
- BORI numbering differs from vulgate print editions (CE Sabha has 72 adhyayas
  vs vulgate 81, etc.). References are CE throughout.
- daily_quote_eligible marks only the 6 parva openers; the richer curation
  (Bhishma's teachings, key moments per DATA.md §6) is a human editorial pass.

---

## Run 2026-06-11 — FULL RAMAYANA (all 7 Kandas, 15,187 verses)

Pipeline: `scripts/assemble-ramayana-full.mjs` (same audited methodology as the
Bala 1–5 run, scaled to the whole epic). Deterministic: re-running it on the
same inputs reproduces the Bala 1–5 results byte-for-byte (72/36/23/12/19).

### ATTRIBUTION CORRECTION
Earlier reports called the Sanskrit source "Bombay edition/recension". The host
site (bombay.indology.info) states verbatim: *"the electronic text of the
critical edition of the Rāmāyaṇa"* (M. Tokunaga, rev. J. Smith — Baroda CE).
Sarga counts confirm CE (76/111/71/66/66/116/100 vs vulgate 77/119/75/67/68/128/111).
All references in the app therefore use **CE numbering**. Corrected everywhere
this run; no verse text changed by the correction.

### Checks

```
[CHECK 1] Source Traceability — PASS — Sanskrit: CE e-text Ram01–07 (PD), parsed
          18,761/18,761 verse lines with zero unparsed content lines (CRLF handled).
          English: M. N. Dutt prose 1891–94 (PD) via Itihāsa corpus (WAT 2021),
          19,371 shloka pairs across 7 kanda sections (boundaries = chapter resets).
          Every shipped verse stores CE ref; full pairing audit trail in
          scripts/_ramayana_pairs.json (verse -> Itihāsa vol/chapter/index + dice).
[CHECK 2] Cross-Reference — PASS (by construction) — every shipped verse's Sanskrit
          agrees between TWO independent editions (CE e-text vs Itihāsa/vulgate OCR)
          at bigram-Dice >= 0.5 after orthographic normalization, one-to-one per
          kanda. This simultaneously screens the CE e-text (whose site warns it
          "still contains many errors") and the Itihāsa OCR. Non-agreeing verses
          (3,574) were DROPPED, not guessed. NEW this run: positional-consistency
          gate — low-dice pairs (<0.62) sitting >5 chapters from their sarga's
          high-confidence consensus position were dropped as likely formulaic-verse
          collisions (11 dropped, logged in the run report).
[CHECK 3] Schema & Consistency — PASS — JSON.parse clean; 15,187/15,187 carry
          sanskrit + transliteration + english; ids unique; ordering strictly
          monotonic (kanda, sarga, verse); meta.total_verses == chapters sum ==
          verse count; calendar-tied ramayana_1_1_1 present (hard asserts in the
          pipeline). Duplicate English: 5 groups, ALL consecutive verse pairs
          sharing one Dutt prose paragraph (legitimate paragraph-grained prose).
[CHECK 4] Contextual Coherence — PASS (sampled) — kanda openings verified by hand:
          1.1.1 (Valmiki asks Narada), 4.1.1 (Rama lamenting at Pampa), 5.1.1
          (Hanuman sets out in quest of Sita), 6.1.1 (Rama delighted at Hanuman's
          report), 7.1.1 (ascetics congratulate Rama). 9 deterministic samples from
          the 986 low-confidence pairs read against their Sanskrit: all 9 correspond
          (known Dutt trait: occasional adjacent-verse context bundled in).
          2.1.1 and 3.1.1 did not clear the bar and are absent (dropped, not filled).
```

### Numbers

```
kanda 1 Bala:       1,553 / 1,941 CE (80.0%)   kanda 5 Sundara: 1,990 / 2,487 (80.0%)
kanda 2 Ayodhya:    2,722 / 3,160 CE (86.1%)   kanda 6 Yuddha:  3,677 / 4,436 (82.9%)
kanda 3 Aranya:     1,639 / 2,060 CE (79.6%)   kanda 7 Uttara:  2,008 / 2,690 (74.6%)
kanda 4 Kishkindha: 1,598 / 1,987 CE (80.4%)   TOTAL: 15,187 / 18,761 (81.0%)
Flagged low-confidence (dice 0.5–0.62), shipped + listed for human review: 986
Positional drops: 11 · Sargas with zero verses: 1 of 606 (Yuddha 112)
```

### Known limitations (documented, not fixed silently)
- Dutt's prose is paragraph-grained: some shipped English includes a clause of an
  adjacent verse; 5 consecutive-verse pairs share an identical paragraph.
- CE numbering differs from vulgate print editions (off-by-one sargas in places).
- The 986 flagged pairings ship (each cleared dice + positional gates and a 9-sample
  manual audit) but remain listed in scripts/_ramayana_run_report.json for review.

---

# Earlier runs

Run date: 2026-06-07

## Summary

No scripture verses were *added* this run. Work this run was: gap detection,
sourcing/edition validation, building and proving a deterministic Devanagari→IAST
transliterator, and a cross-reference probe that surfaced one textual variant. No
verse content was generated from memory.

## Structural integrity — CHECK 3 (existing data)

```
[CHECK 3] gita.json        — PASS — JSON.parse() clean; 9 verses; schema consistent
[CHECK 3] ramayana.json    — PASS — JSON.parse() clean; 1 verse; schema consistent
[CHECK 3] mahabharata.json — PASS — JSON.parse() clean; 1 verse; schema consistent
```

## Transliterator gate (scripts/translit.mjs + verify-translit.mjs)

A rule-based Devanagari→IAST transliterator was written and gated against the
known-good IAST of the 9 seed Gita verses (compared on normalized forms — spaces,
hyphens, apostrophes, dandas removed — so only true character fidelity is tested, not
editorial compound-splitting).

```
Transliterator gate: 8 PASS / 1 "fail" of 9
  - 8/8 substantive verses: transliterator reproduces seed IAST character-for-character
  - gita_18_66: mismatch is NOT a transliterator error — see textual variant below
```

**Conclusion: the transliterator is faithful** and safe to use for new verses, with the
caveat that it emits mechanical word-splitting (spaces only where the Devanagari has
them), not the editorial compound-hyphenation seen in 8 of the seed verses
(`sarva-dharmān`). Standardizing the whole file to the mechanical style is recommended
for consistency at 700+ verses (see FILL_SUMMARY.md, open decision).

## Cross-reference finding — CHECK 2 — BG 18.66 (FLAGGED, not changed)

```
[CHECK 2] gita_18_66 — VARIANT — "अहं त्वा" vs "अहं त्वां"
  Source A (seed gita.json):           sanskrit = "...अहं त्वा सर्वपापेभ्यो..."  (no anusvara)
  Source B (gita/gita open dataset):   text     = "...अहं त्वा सर्वपापेभ्यो..."  (no anusvara)
  Seed transliteration field:          "...ahaṁ tvāṁ sarva-pāpebhyo..."       (WITH anusvara)
  Common printed reading (unverified): "अहं त्वां" (tvāṁ)
```

Two independent Sanskrit sources agree on `त्वा`; the seed's own transliteration and the
common printed reading say `त्वां`. This is a real variant of one of the Gita's most
famous verses. Per the cardinal rule it is **flagged for human review against an
authoritative print edition** and NOT altered from memory. See FLAGGED_VERSES.md §V1.

## Bhagavad Gita fill — COMPLETE (701 verses)

```
[CHECK 1] Source Traceability — PASS — English: Annie Besant, "The Bhagavad-Gîtâ", 4th ed.
          1922 (public domain), human-proofread on Wikisource (pagequality=4). Sanskrit:
          GRETIL-derived (gita/gita dataset). Every verse traceable to chapter+verse.
[CHECK 2] Cross-Reference — PASS — Devanagari cross-checked Besant parallel text vs
          gita/gita spine; all 701 verses present in both; 0 missing from spine.
[CHECK 3] Schema & Consistency — PASS — JSON.parse clean; 701/701 carry sanskrit +
          transliteration + english + source; ids unique; verse sequence 1..N per chapter
          with 0 gaps/dups; transliterator gate 701/701.
[CHECK 4] Contextual Coherence — PASS (structural) — per-chapter verse counts match the
          chapter index exactly (Ch13=35 recension documented); no out-of-sequence verses;
          chapter colophons correctly excluded.
```

Per-chapter parse result (parsed/declared): 1:47/47, 2:72/72, 3:43/43, 4:42/42, 5:29/29,
6:47/47, 7:30/30, 8:28/28, 9:34/34, 10:42/42, 11:55/55, 12:20/20, 13:35/35, 14:27/27,
15:20/20, 16:24/24, 17:28/28, 18:78/78. Total 701/701.

### Known cosmetic (not a data issue)
The anusvara is stored as correct precomposed IAST `ṁ` (U+1E41). In the app it can render
as `m` + a slightly detached dot because the Lora Italic font's glyph for U+1E41 falls
back — this affects the original seed verses identically and is a font-glyph matter, not a
transliteration error.

## Ramayana fill — Bala Kanda Sargas 1–5 (162 verses, fuzzy cross-verified)

Extended from the initial 22 by replacing exact-normalized matching with bigram-Dice
fuzzy matching (≥ 0.5), which tolerates Itihāsa OCR noise. Bombay (clean Sanskrit +
canonical refs) is the spine; Dutt English is paired by max similarity. 162 of 199
Bombay verses across sargas 1–5 shipped; the rest dropped where Dutt's paragraph-grained
prose left no distinct English (not guessed). Per-sarga: 1:72/79, 2:36/41, 3:23/29,
4:12, 5:19. 0 duplicate English across verses. Low-confidence pairs (dice 0.5–0.62)
spot-checked: each verse's meaning is present in its English (Dutt bundles some context).
Reader updated with per-sarga dividers.

### (Earlier) initial 22-verse curated Ramayana — superseded by the above

```
[CHECK 1] Source Traceability — PASS — Sanskrit: Bombay edition (bombay.indology.info).
          English: M. N. Dutt, The Rāmāyana prose, 1891–94, via Itihāsa corpus (WAT2021).
          Both public domain. Each verse traceable to Bala Kanda, Sarga 1, verse N (Bombay).
[CHECK 2] Cross-Reference — PASS (by construction) — every shipped verse's Sanskrit
          agrees between TWO independent editions (Itihāsa/Dutt and Bombay) under
          orthographic normalization. Non-agreeing verses were excluded, not shipped.
[CHECK 3] Schema & Consistency — PASS — JSON.parse clean; 22/22 carry sanskrit +
          transliteration + english + source; ids unique; kanda/sarga fields correct.
[CHECK 4] Contextual Coherence — PASS — verses follow the Samkshepa Ramayana narrative
          arc (Narada's questions → Rama's virtues → exile → Sita → Hanuman → war →
          return → ideal reign). Spot-checked 1.1.3 / 1.1.22 / 1.1.72: Sanskrit ↔ Dutt
          English agree in meaning.
```

Shipped verse numbers (Bombay canonical): 1,3,4,5,7,10,12,16,17,22,31,35,36,53,56,57,
62,63,64,65,70,72. Gaps = verses excluded because the two editions did not cleanly
agree (Itihāsa OCR errors or verse-division divergence) — flagged, not guessed.

## Not yet evaluated
- Explanations for the filled Gita / Ramayana / Mahabharata verses: not written
  (pending the draft + human-review pass per DATA.md §5). Only the seed
  mangalacharana explanation exists (carried over by Sanskrit match).
- Hindi / Gujarati / Tamil translations: not populated for any book.
- ~~Mahabharata: not yet filled~~ — DONE 2026-06-11, see the run section at the
  top of this file (38,425 verses, 6 curated parvas, M. N. Dutt English).
