# FILL_SUMMARY.md

Latest run: 2026-06-11 (full Ramayana). Earlier: 2026-06-07 (Gita + Bala 1–5).
No verse content generated from memory, ever.

## Headline

| Scripture | Declared | Present | Missing | Source |
|---|---|---|---|---|
| **Bhagavad Gita** | **701** | **701** | **0** | Annie Besant (1922, PD) |
| **Ramayana** | **15,187 (ALL 7 Kandas)** | **15,187** | 3,574 CE verses dropped (no cross-verifiable English — never guessed) | Sanskrit: critical edition e-text (PD); English: M. N. Dutt (1891–94, PD) |
| **Mahabharata** | **38,425 (6 curated parvas)** | **38,425** | 5,813 CE verses dropped (no cross-verifiable English — never guessed) | Sanskrit: BORI critical edition e-text (PD); English: M. N. Dutt (1895–1905, PD) |

## Mahabharata — curated 6-parva run (2026-06-11)

- Scope per FEATURES.md: Adi, Sabha, Vana, Udyoga, Bhishma, Shanti only
  (full 18-parva text is V2 per DONTS.md). App parvas 1–6 = BORI 1/2/3/5/6/12.
- Pipeline: `scripts/assemble-mahabharata.mjs` — same audited method (bigram-Dice
  ≥ 0.5, one-to-one per parva, positional gate, drop-never-guess). BORI numbering
  verbatim, including verse-0 invocations; speaker lines ("vaiśaṁpāyana uvāca")
  prepended for display, excluded from matching.
- Dutt volume layout verified before use (chapter resets + opening lines + vulgate
  adhyaya counts, hard asserts). 71 OCR'd chapter labels (letter O for zero)
  sanitized. 38,425 shipped (86.9%); 2,833 low-confidence pairings flagged for
  human review; 20 positional drops; only 2 of 1,263 adhyayas empty.
- Hand-verified: mangalacharana 1.1.0 (seed explanation carried over), BG 2.47
  inside Bhishma Parva (independent Dutt rendering — cross-checks gita.json),
  Shanti opening, Vidura paṇḍita verse, 9 flagged samples.
- App: `adhyaya` sub-dividers in the Reader; parva selector shows real counts;
  29.4 MB minified JSON.

## Ramayana — FULL EPIC run (2026-06-11)

- Pipeline: `scripts/assemble-ramayana-full.mjs` — the audited Bala 1–5 method
  scaled to all 7 kandas (18,761 CE verses vs 19,371 Itihāsa shloka pairs).
- **Attribution corrected:** the Sanskrit e-text is the **Baroda critical edition**
  (Tokunaga/Smith; the site's own words: "the electronic text of the critical
  edition"), not "Bombay recension" as earlier reports said. CE numbering is used.
- bigram-Dice ≥ 0.5, one-to-one per kanda, PLUS a new positional-consistency gate
  (low-dice pairs landing >5 chapters from their sarga's consensus are dropped — 11).
- **15,187 shipped (81.0%)**; per-kanda 80–86% except Uttara 74.6% (textually messiest).
  986 low-confidence pairings (dice 0.5–0.62) ship but are listed for human review in
  `scripts/_ramayana_run_report.json`; full audit trail in `scripts/_ramayana_pairs.json`.
- Hand-verified: 5 kanda openings + 9 deterministic low-confidence samples — all
  correspond. Kanda 2/3 openings (2.1.1, 3.1.1) did not clear the bar → absent.
- App: Reader now mounts verses incrementally (continuous scroll preserved);
  reading progress tracks the scrolled window, not whole-kanda-on-open;
  `defaultOpenChapter` = first chapter with content (Bala, not the largest kanda).

## Ramayana — Bala Kanda, Sargas 1–5 (162 verses)

- **162 verses** across the opening five sargas of Bala Kanda (Sarga 1 = the
  *Samkshepa Ramayana*, Valmiki's whole-epic summary; Sarga 2 = the origin of the
  śloka; Sargas 3–5 = Brahma's command, composition, and the line of kings).
- **Two independent public-domain sources, cross-verified per verse:**
  - Sanskrit (Devanagari, canonical numbering): **Bombay edition** (bombay.indology.info,
    via the ValmikiRamayanam-MuneoTokunaga repo).
  - English: **M. N. Dutt** prose (1891–94), via the peer-reviewed **Itihāsa corpus**.
- **Method (fuzzy cross-verification):** each clean Bombay verse is paired with the Dutt
  English whose (OCR-noisy) Sanskrit is most similar by bigram-Dice (≥ 0.5, with
  nasal/sibilant/gemination normalization). This tolerates Itihāsa OCR noise (e.g.
  `दृढत्नतः` vs the correct `दृढव्रतः`) while still refusing genuine mismatches. Of 199
  Bombay verses in these sargas, **162 shipped**; ~37 were dropped where no Dutt English
  matched (Dutt's prose bundles some shlokas into one paragraph, leaving neighbors
  without distinct text). Per-sarga: S1 72/79, S2 36/41, S3 23/29, S4 12, S5 19.
- **Integrity:** Sanskrit + canonical verse numbers from the clean Bombay edition;
  English is verbatim Dutt; 0 duplicate English across verses; nothing guessed.
  Dutt's prose is paragraph-grained, so some verses' English is mildly over-inclusive
  (contains neighbouring context) — faithful, just coarse.
- Pipeline: `scripts/assemble-ramayana.mjs`. Reader shows per-sarga dividers.

### To extend further (more sargas / kandas)
The same pipeline scales to the rest of Bala Kanda (76 sargas) and the other six kandas
(Bombay Sanskrit Ram02–07 + Dutt English are all available). Gaps will remain wherever
Dutt's prose bundling leaves a shloka without distinct English. A second PD verse-aligned
English would raise coverage; the IITK/valmikiramayan.net aligned English is **not PD**.

## Bhagavad Gita — COMPLETE

- **701 verses**, all 18 chapters, fully populated and verified.
- **English:** Annie Besant, *The Bhagavad-Gîtâ (The Lord's Song)*, 4th ed. 1922 —
  public domain, human-proofread transcription on Wikisource.
- **Sanskrit (Devanagari):** GRETIL-derived text (gita/gita open dataset), cross-checked
  against Besant's parallel Devanagari. Verse-to-number alignment was machine-verified:
  every chapter parsed to its exact verse count and every verse mapped to the spine.
- **Transliteration:** mechanical IAST from `scripts/translit.mjs`, proven faithful
  (gate: 8/8 on original seed; 701/701 internally consistent after fill).
- **`source` metadata** added to every verse.
- **Seed metadata preserved:** the 8 daily-quote-eligible flags and 9 curated
  explanations carried over.

### Recension note (documented, not an error)
Chapter 13 has **35** verses, not 34 — Besant's recension (and the gita/gita dataset)
include Arjuna's opening question (13.1, *prakṛtiṁ puruṣaṁ caiva…*). Total is therefore
**701**, not the idealized "700." `meta.total_verses` and the Ch13 index were updated to
match the actual sourced data.

## Still pending (separate passes)

1. **Explanations** for the 692 newly filled verses — empty for now. Per DATA.md these
   must be drafted then human-reviewed (explanatory, non-sectarian tone). Not done
   from memory.
2. **Daily-quote curation** — only 8 verses flagged eligible; DATA.md §6 wants ~150–200.
3. **Ramayana + Mahabharata** curated key-verse sets (Griffith/Dutt, Ganguli — all PD).
   Needs a curated verse list + the same pipeline.
4. **BG 18.66** `त्वा`/`त्वां` variant — flagged for human review (FLAGGED_VERSES.md §V1).

## On disk

- `assets/data/gita.json` — **rewritten: 701 verified verses.**
- Added `scripts/{build-gita,assemble-gita,translit,verify-translit,gap-report}.mjs`.
- Build caches under `scripts/_besant_cache/` + `scripts/_gita_assembled.json` (gitignored).
