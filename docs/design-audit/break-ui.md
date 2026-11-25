# Break-UI pass: Contact form and Solution demo (item 2.4)

Worst-case data used: name "Aleksandra Wiśniewska-Kowalczyk-Ó Súilleabháin",
company "Northwind Industries Holdings Cold Chain Logistics (Middle East) FZE",
email "bartholomew.fitzgerald@northwind-industries-holdings.example.com",
a long Arabic + Chinese message, empty fields, a malformed email.
Widths: 320px and 390px, plus root text at 200%.

## What broke (all fixed)

| # | Severity | Where | Worst case | What happened | Fix |
|---|---|---|---|---|---|
| 1 | Broken | ContactForm | All fields empty | `noValidate` removed the browser checks and nothing replaced them, so an empty form was sent to Formspree | Check name, email and message before sending; message under each field, `aria-invalid` + `aria-describedby`, focus moves to the first problem |
| 2 | Broken | ContactForm | `bartholomew.fitzgerald@northwind` | Sent as-is | Simple shape check with a plain message |
| 3 | Fragile | ContactForm | Pasted document | No length limits | `maxLength`: name 120, company 160, email 254, message 5000 |
| 4 | Ugly | ContactForm | Server error | Error text not announced to screen readers | `role="alert"` |
| 5 | Broken | Footer, Contact | Our own email at 200% text | Unbreakable address widened every page to 641px | `overflow-wrap: anywhere` on both links |
| 6 | Broken | Solution pillars | 200% text | Single-column grid sized to the longest word, page scrolled sideways | `grid-cols-1`, padding p-6 on phones, headings break long words only when they would overflow |
| 7 | Ugly | Demo step nav | 200% text | Labels could not wrap | `min-w-0` on button and label |
| 8 | Broken | Solution preview, demo steps | 200% text | Implicit grid tracks sized to content | `grid-cols-1` below md |

## Still there

- At 320px *and* 200% text together (like 160px wide at normal size), the
  demo's step 1 still scrolls about 36px sideways. Normal 320px and 200% text
  at 390px are both clean.
- ProductPreview clips its own inner content at 200% text (the card is
  `overflow-hidden`). It is an illustration; left as is.

## What held up

- Long names, company and email in the inputs: no overflow at 320px.
- Arabic and Chinese text renders with fallback fonts, no clipping.
- The demo at 320px normal text: all four steps fit.
