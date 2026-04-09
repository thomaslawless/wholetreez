# WholeTreez Dispensary Website — Design Spec

## Overview

A static website for WholeTreez, a New York cannabis dispensary. Two pages: a homepage with dispensary info and a COA (Certificate of Analysis) page for lab test results. QR codes generated at build time for physical product labels.

## Tech Stack

- **Framework:** Astro with React integration (for future component needs)
- **Styling:** Vanilla CSS (scoped per component/page)
- **Output:** Static site (`astro build` → HTML/CSS/JS)
- **QR Generation:** `qrcode` npm package, run via a build-time script that outputs PNG files to `public/qr/`
- **Domain:** wholetreez.com

## Design Language

- Clean & modern: white backgrounds, black text (#111), gray accents (#666, #999)
- Bold typography, generous whitespace
- Logo-driven branding — the WholeTreez mark carries the visual weight
- Mobile responsive (single column on small screens)

## Project Structure

```
/
├── public/
│   ├── images/
│   │   ├── hero.jpg
│   │   ├── Logo Wholetreez White.png
│   │   ├── Logo Wholetreez Black.png
│   │   ├── Logo Wholetreez W Black.png
│   │   ├── Logo Wholetreez W White.png
│   │   ├── Logo Wholetreez line Black.png
│   │   └── Logo Wholetreez line White.png
│   ├── coa/
│   │   ├── bubblegum-poppers.pdf
│   │   ├── lemon-poppers.pdf
│   │   └── cherry-poppers.pdf
│   └── qr/              (generated at build time)
│       ├── bubblegum-poppers.png
│       ├── lemon-poppers.png
│       └── cherry-poppers.png
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro      (shared HTML shell, nav, footer)
│   ├── components/
│   │   ├── Navbar.astro
│   │   ├── Hero.astro
│   │   ├── ContactSection.astro
│   │   ├── InfoSection.astro
│   │   └── CoaCard.astro
│   ├── pages/
│   │   ├── index.astro            (homepage)
│   │   └── coa.astro              (COA page)
│   └── styles/
│       └── global.css
├── scripts/
│   └── generate-qr.mjs           (build-time QR code generator)
├── astro.config.mjs
└── package.json
```

## Pages

### Homepage (`/`)

1. **Navbar** — WholeTreez line logo (white variant) on left, navigation links (Home, COA) on right. Sticky, dark background (#111).

2. **Hero section** — `hero.jpg` as full-width background image with dark overlay (rgba(0,0,0,0.5)). Centered content: WholeTreez full logo (white variant), tagline text below. CTA button linking to `/coa`.

3. **Info section** — Two or three columns (responsive). Address (placeholder), hours (placeholder). Simple, clean layout with label text above values.

4. **Contact section** — Prominent display of `info@wholetreez.com`. Mailto link. Clean heading: "Get In Touch" or similar.

5. **Footer** — Copyright line: "© 2026 WholeTreez. All rights reserved."

### COA Page (`/coa`)

1. **Same navbar**

2. **Page header** — "Certificates of Analysis" heading with brief explanation: lab-tested results for transparency.

3. **WholeTreez section** — Brand heading with logo mark. "Coming soon" message styled subtly (gray text, perhaps italic).

4. **Super Dope section** — Brand heading. Three COA cards in a row (stack on mobile):
   - **Bubblegum Poppers** — links to `/coa/bubblegum-poppers.pdf`
   - **Lemon Poppers** — links to `/coa/lemon-poppers.pdf`
   - **Cherry Poppers** — links to `/coa/cherry-poppers.pdf`

5. Each card: product name, "View COA" link/button. PDFs open in new tab (`target="_blank"`).

6. **Same footer**

### COA Card Component

Reusable component accepting: product name, PDF path. Renders a clean card with the product name and a link to the PDF. Hover state: subtle border or shadow change.

## QR Code Generation

A Node script (`scripts/generate-qr.mjs`) that runs before the Astro build:

- Reads a list of COA entries (hardcoded array in the script for now):
  ```js
  const coas = [
    { name: 'bubblegum-poppers', file: 'bubblegum-poppers.pdf' },
    { name: 'lemon-poppers', file: 'lemon-poppers.pdf' },
    { name: 'cherry-poppers', file: 'cherry-poppers.pdf' },
  ];
  ```
- For each entry, generates a QR code PNG pointing to `https://wholetreez.com/coa/{file}`
- Saves to `public/qr/{name}.png`
- QR codes are black-on-white, 512x512px — print-friendly

The `package.json` build script chains this: `"build": "node scripts/generate-qr.mjs && astro build"`

## PDF File Naming

The original COA filenames are long lab IDs. They'll be copied/renamed to cleaner names in `public/coa/`:

| Original | Renamed |
|----------|---------|
| `2603RLI0343-1748 - Rochester 420 - Bubblegum Poppers 1_8th.pdf` | `bubblegum-poppers.pdf` |
| `2603RLI0343-1749 - Rochester 420 - Lemon Poppers 1_8th.pdf` | `lemon-poppers.pdf` |
| `2603RLI0343-1750 - Rochester 420 - Cherry Poppers 1_8th.pdf` | `cherry-poppers.pdf` |

## Responsive Behavior

- **Desktop (>768px):** Multi-column layouts, horizontal nav
- **Mobile (<768px):** Single column, hamburger menu or stacked nav links, full-width cards

## Out of Scope

- E-commerce / product listings
- CMS or dynamic content management
- User accounts or authentication
- Analytics (can be added later)
- SEO meta tags beyond basics (can be added later)
