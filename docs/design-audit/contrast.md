# Contrast check (items 0.1 and 0.2)

WCAG AA: 4.5:1 for normal text, 3:1 for large text and for non-text marks.
Ratios are computed from the colour tokens in `globals.css`, with opacity blended onto the real background.

## Rule now in force

- Text on paper or paper-deep: at least `ink/70` (5.61 on paper, 5.27 on paper-deep).
- Text on ink: at least `paper/60` (6.03). Text on ink-soft panels: at least `paper/70` (6.10).
- Text on a filled button or bubble: paper on `teal-deep` (7.81), hover `ink` (14.32).
- Decorative numerals and glyphs: `aria-hidden="true"`, at least 3:1.

## Every pair changed

| Where | Before | Ratio | After | Ratio |
|---|---|---|---|---|
| Primary Button, hero CTA, contact submit, demo buttons | paper on teal | 3.92 | paper on teal-deep | 7.81 |
| Same, on hover | paper on teal-deep | 7.81 | paper on ink | 14.32 |
| Demo alert bubble | paper on teal | 3.92 | paper on teal-deep | 7.81 |
| Demo alert timestamp | paper/70 on teal | 2.71 | paper/80 on teal-deep | 5.65 |
| Text selection | paper on teal | 3.92 | paper on teal-deep | 7.81 |
| Research and Contact link hover | teal on paper | 3.92 | ink on paper | 14.32 |
| Header inactive nav | ink/60 on paper | 4.12 | ink/70 on paper | 5.61 |
| Home pillar numerals `01 02 03` (decorative) | ink/35 | 2.10 | ink/55, aria-hidden | 3.56 |
| Demo step numerals (decorative) | ink/35 | 2.10 | ink/55, aria-hidden | 3.56 |
| FAQ "+" glyph (decorative) | ink/40 | 2.38 | ink/55, aria-hidden | 3.56 |
| FAQ hint line | ink/60 on paper | 4.12 | ink/70 | 5.61 |
| About bio | ink/55 on paper | 3.56 | ink/70 | 5.61 |
| Solution status note | ink/55 on paper | 3.56 | ink/70 | 5.61 |
| Legal "Last updated" | ink/45 on paper | 2.70 | ink/70 | 5.61 |
| Form placeholders (none in use today) | ink/40 | 2.38 | ink/65 | 4.80 |
| ProductPreview sub-line, caption, labels, axis dates | ink/40 to /60 | 2.38 to 4.12 | ink/70 | 5.61 |
| ProductPreview footnote (on paper-deep) | ink/45 | 2.63 | ink/70 | 5.27 |
| Demo panel label (on paper-deep) | ink/45 | 2.63 | ink/70 | 5.27 |
| Demo prediction label (on wheat tint) | #9a6f1f | 3.42 | #7d5816 | 4.86 |
| Pairing caveat (on paper-deep) | ink/50 | 2.99 | ink/70 | 5.27 |
| Pairing upcoming steps (on paper-deep) | ink at opacity 40% | 2.32 | opacity 70% | 5.27 |
| Pairing empty check circle (non-text) | paper/25 on paper-deep | 1.0 (invisible) | ink/55 | 3.42 |
| SealedReport sub-line and row labels | ink/55, ink/60 | 3.56, 4.12 | ink/70 | 5.61 |
| Timeline title, axis, hint (on ink-soft) | paper/40 to /60 | 2.9 to 4.93 | paper/70 | 6.10 |
| Timeline safe-limit line (on ink-soft) | wheat/90 | 3.88 | new token `--wheat-light` | 5.45 |
| Footer copyright (on ink) | paper/45 | 4.02 | paper/60 | 6.03 |
| Footer "Get in touch" (on ink) | paper/50 | 4.63 | paper/60 | 6.03 |

## Pairs checked and left alone (already pass)

| Pair | Ratio |
|---|---|
| ink/65 body copy on paper / paper-deep | 4.80 / 4.55 |
| teal-deep eyebrows on paper / paper-deep | 7.81 / 6.84 |
| red #9A3A30 on paper | 6.45 |
| wheat hero quote on ink | 5.98 |
| paper/70 to /80 on ink (hero sub-line, footer links) | 7.68 to 9.61 |
| teal-deep on teal/8 tint (sealed badge) | 7.11 |

Not fixable in code: the faint line "Follow one shipment, end to end" is baked into the video poster and video frames.
