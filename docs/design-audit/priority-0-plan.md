# Priority 0 findings: accessibility and structure

What the site measured before the Priority 0 fixes. What changed is in
`priority-0-changelog.md`.

## What I measured

### Contrast (WCAG AA: 4.5:1 normal text, 3:1 large text)

| Pair | Ratio | Where it is used |
|---|---|---|
| paper on teal | 3.92 FAIL | primary Button, hero CTA, contact submit, demo buttons, demo alert bubble, text selection |
| teal on paper (hover) | 3.92 FAIL | link hover on Research, Contact, FAQ |
| ink/35 on paper | 2.10 FAIL | `01 02 03` pillar numerals, demo step numerals |
| ink/40 on paper | 2.38 FAIL | form placeholders, FAQ chevron area, chart axis labels |
| ink/45 on paper | 2.70 FAIL | ProductPreview labels and footnote, Legal page date, demo caption |
| ink/50 on paper | 3.10 FAIL | demo "whose sensor" caveat |
| ink/55 on paper | 3.56 FAIL | Solution status note, About bio, SealedReport labels, ProductPreview sub-line |
| ink/60 on paper | 4.12 FAIL | inactive desktop nav, FAQ, SealedReport rows, ProductPreview caption |
| paper/40 and /45 on ink | 3.47 / 4.02 FAIL | footer copyright line, timeline scrubber labels |
| ink/65 and up on paper | 4.80+ pass | (ink/65 on paper-deep is 4.55, a bare pass) |
| paper on teal-deep | 7.81 pass | proposed new button fill |
| paper on ink | 14.32 pass | proposed new button hover |

The text inside the video poster ("Follow one shipment, end to end") is also faint, but it is part of the video image, not HTML. I can't fix it in code. I'm noting it for when the video is next exported.

### Headings

- Home: h1, then h3 Sense, Detect, Prove (skips h2), then h2. "What we do" is not a heading.
- Solution: no skipped level, but the three pillar cards are h2 at the same level as the section titles.
- About, Research, Contact: only an h1. Section labels such as "Our mission" are styled spans, so a screen reader user can't jump to them.

### JavaScript off

Everything inside a `Reveal` stays invisible: 16 blocks on Home, 30 on Solution, 9 on About, 3 on Research and 7 on Contact (including the form labels). The hero is fine because its animation is pure CSS. The same failure also happens when JavaScript is slow. My first screenshot run caught the page before it was ready, and every section below the hero was blank.

### Other findings

- The mobile menu links stay keyboard-focusable while the menu is closed. The panel is only collapsed visually, so tabbing on a phone or tablet walks through hidden links.
- No custom focus styles anywhere. Browser default outlines are hard to see on the dark hero and footer.
- The contact form only works with JavaScript (it posts with `fetch`).
- The logo is a 579 x 640 PNG shown at 56 to 64px tall, so every visitor downloads about 10 times the pixels needed.
- No horizontal scroll at 320px on any page.
