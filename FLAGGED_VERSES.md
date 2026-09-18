# FLAGGED_VERSES.md

Every verse below is **flagged, not filled**, per the SCRIPTURE_FILL.md cardinal rule
("If you are not certain, FLAG IT — do not fill it") and the §3 prohibition on
generating verse content from memory.

A flagged gap is recoverable. A hallucinated verse corrupts the dataset. Nothing here
was guessed.

---

## Mahabharata run (2026-06-11) — flag classes

### M1 — 2,833 low-confidence pairings (SHIPPED, listed for review)
Dice 0.5–0.62 between BORI CE Sanskrit and the Itihāsa Sanskrit backing the Dutt
English. 9-sample manual audit: 7 exact, 2 adjacent-context within the right
scene (Dutt paragraph grain). Complete list: `scripts/_mahabharata_run_report.json`.

### M2 — 5,813 CE verses with no cross-verifiable English (NOT FILLED)
Dropped, never guessed. Only 2 of 1,263 adhyayas (Udyoga 61, 159) have zero verses.

### M3 — 20 positional drops (NOT FILLED)
Low-dice pairs landing >5 chapters from their adhyaya's consensus position.

### M4 — Repeated-formula duplicate English (SHIPPED, verified legitimate)
13 duplicate-English groups: 6 consecutive-verse paragraph shares + 7 in known
verbatim-repeat passages (Sabha 54/58 dice-game refrain, Shanti 29 Sixteen-Kings
litany — Sanskrit verified identical; Bhishma 16/95 Duryodhana's repeated order).

### M5 — daily_quote_eligible minimal
Only the 6 parva openers are marked. DATA.md §6 wants ~150–200 curated verses
per book ("Bhishma's teachings, key narrative moments") — that selection is an
editorial pass for a human, not something to auto-generate.

---

## Full-Ramayana run (2026-06-11) — flag classes

### R1 — 986 low-confidence pairings (SHIPPED, listed for review)
Pairs with bigram-Dice 0.5–0.62 between the CE Sanskrit and the Itihāsa Sanskrit
backing the Dutt English. Each cleared the one-to-one assignment, the positional-
consistency gate, and a 9-sample manual audit (all 9 correspond), so they ship —
but the complete list (CE ref + dice + Itihāsa location) is in
`scripts/_ramayana_run_report.json` for human review.

### R2 — 3,574 CE verses with no cross-verifiable English (NOT FILLED)
Dropped, never guessed. Causes: Dutt's paragraph-grained prose (one paragraph
covering several shlokas), 5 chapters missing from the Itihāsa scrape, OCR noise
below threshold, and vulgate-vs-CE recension differences. Notable absences:
kanda openings 2.1.1 and 3.1.1; sarga 6.112 entirely (its corpus chapter is
affected by a duplicated chapter number in vol-iii).

### R3 — 11 positional drops (NOT FILLED)
Low-dice pairs whose matched Itihāsa chapter sat >5 chapters from the sarga's
high-confidence consensus — likely formulaic-verse collisions across sargas.
Listed with expected vs actual chapter in `scripts/_ramayana_run_report.json`.

### R4 — Attribution correction (no text changed)
"Bombay recension" → **Baroda critical edition e-text** (Tokunaga/Smith,
bombay.indology.info). CE numbering used throughout; documented in
VERIFICATION_LOG.md.

---

## Textual variants flagged for human review (NOT altered)

### V1 — BG 18.66: `अहं त्वा` vs `अहं त्वां`

One of the Gita's most famous verses (the carama shloka). Sources disagree:

- Seed `gita.json` Sanskrit: `अहं त्वा` (no anusvara)
- `gita/gita` open dataset Sanskrit: `अहं त्वा` (no anusvara) — agrees with seed
- Seed transliteration field: `ahaṁ tvāṁ` (WITH anusvara)
- Common printed reading: `अहं त्वां` (tvāṁ)

Two Sanskrit sources read `त्वा`; the transliteration and common print read `त्वां`.
Both are grammatically defensible accusatives of *tvam*. **Not changed** — needs a
decision against an authoritative print edition (e.g., Gita Press, BORI). The
transliterator gate surfaced this; it is the single non-passing seed case.

---

## Blockers

### B1 — RESOLVED: edition chosen = public domain

Owner chose public-domain editions. Selected:
- **Gita → Annie Besant (1895/1922)** — verse-numbered, PD, human-proofread on Wikisource
  with verbatim Devanagari + English.
- **Ramayana → Griffith / M.N. Dutt** (curated key verses).
- **Mahabharata → Kisari Mohan Ganguli** (curated key verses).

The in-copyright editions named in SCRIPTURE_FILL.md §2a (Prabhupada, Sattar, Rajaji,
Debroy, Miller, Sargeant, R.K. Narayan) are **not** used — they can't be bundled in a
sold/handoff app without a license.

### B1-original — Edition not chosen, and the preferred list is mostly in-copyright (for the record)

SCRIPTURE_FILL.md §2a lists these preferred editions. Copyright status for an app being
built for sale / client handoff (see project context):

| Text | Preferred in doc | Copyright reality |
|---|---|---|
| Gita | Prabhupada (BBT) | **In copyright** (ISKCON/BBT). Not usable without license. |
| Gita | Sivananda (DLS) | Distributed free by DLS, but **not clearly public domain** for commercial redistribution. Risk. |
| Gita | Sargeant / Miller | **In copyright.** |
| Ramayana | Sattar (Penguin) / Dutt | Sattar **in copyright**; M.N. Dutt (1890s) **public domain**. |
| Ramayana | Rajaji / R.K. Narayan | **In copyright.** |
| Mahabharata | Rajaji / R.K. Narayan | **In copyright.** |
| Mahabharata | Debroy (Penguin) | **In copyright.** |

Cleanly public-domain options NOT in the doc, viable for a sellable app:

- **Gita:** Kashinath Trimbak Telang (Sacred Books of the East, 1882); Edwin Arnold,
  *The Song Celestial* (1885, verse).
- **Ramayana:** Ralph T. H. Griffith (1870–74, verse); M. N. Dutt (1890s, prose).
- **Mahabharata:** Kisari Mohan Ganguli (1883–96, complete prose) — the only complete
  public-domain English Mahabharata.

**Action required from owner:** pick one edition per text. Until then, translation
content cannot be sourced.

### B2 — PARTIALLY RESOLVED: scope = curated key verses (totals still need correcting)

Owner chose **curated key verses** for Ramayana + Mahabharata (Gita stays full-700).
Remaining action: correct `meta.total_verses` in `ramayana.json` (24,000) and
`mahabharata.json` (30,000) down to the curated counts once the curated sets are
selected, so "missing" is well-defined. Original analysis kept below for the record.

### B2-original — Declared verse totals contradict the intended format

- `ramayana.json` meta declares **24,000** verses (full Valmiki shloka count).
- `mahabharata.json` meta declares **30,000** verses, but SCRIPTURE_FILL.md §2a/§6 treat
  the Mahabharata as **abridged** (Rajaji/Narayan), which is hundreds of narrative
  sections — not 30,000 shlokas.
- FEATURES.md scopes V1 Mahabharata to **six curated Parvas**, not the whole text.

Until the owner decides "full shloka corpus" vs "abridged narrative," the count of
"missing" verses for these two texts is undefined. The numbers below are stated against
the *current declared totals* and will change once scope is fixed.

---

## Gita — flagged missing verses (691)

Present (do not refill): `gita_1_1`, `gita_2_14`, `gita_2_20`, `gita_2_47`, `gita_4_7`,
`gita_4_8`, `gita_9_22`, `gita_11_55`, `gita_18_66`.

Missing by chapter (verse numbers absent):

| Ch | Name | Present | Missing |
|---|---|---|---|
| 1 | Arjuna Vishada Yoga | 1/47 | 2–47 |
| 2 | Sankhya Yoga | 3/72 | 1–13, 15–19, 21–46, 48–72 |
| 3 | Karma Yoga | 0/43 | 1–43 |
| 4 | Jnana Karma Sannyasa Yoga | 2/42 | 1–6, 9–42 |
| 5 | Karma Sannyasa Yoga | 0/29 | 1–29 |
| 6 | Dhyana Yoga | 0/47 | 1–47 |
| 7 | Jnana Vijnana Yoga | 0/30 | 1–30 |
| 8 | Akshara Brahma Yoga | 0/28 | 1–28 |
| 9 | Raja Vidya Raja Guhya Yoga | 1/34 | 1–21, 23–34 |
| 10 | Vibhuti Yoga | 0/42 | 1–42 |
| 11 | Vishvarupa Darshana Yoga | 1/55 | 1–54 |
| 12 | Bhakti Yoga | 0/20 | 1–20 |
| 13 | Kshetra Kshetrajna Vibhaga Yoga | 0/34 | 1–34 |
| 14 | Gunatraya Vibhaga Yoga | 0/27 | 1–27 |
| 15 | Purushottama Yoga | 0/20 | 1–20 |
| 16 | Daivasura Sampad Vibhaga Yoga | 0/24 | 1–24 |
| 17 | Shraddhatraya Vibhaga Yoga | 0/28 | 1–28 |
| 18 | Moksha Sannyasa Yoga | 1/78 | 1–65, 67–78 |

Reason flagged: no edition chosen (B1); cannot source from memory (§3).

## Ramayana — flagged missing verses (23,999 against current declared total)

Present (do not refill): `ramayana_1_1_1`.

Missing: effectively the entire text — Bala Kanda 1.1.2 onward through Uttara Kanda.
Reason flagged: no edition chosen (B1) **and** scope/total undefined (B2).

## Mahabharata — flagged missing verses (29,999 against current declared total)

Present (do not refill): `mbh_1_1_1`.

Missing: effectively the entire text across all six declared Parvas.
Reason flagged: no edition chosen (B1) **and** abridged-vs-full scope undefined (B2).
Per SCRIPTURE_FILL.md §6, intentional abridgement omissions must NOT be treated as gaps —
which is impossible to honor until the abridged scope is defined.
