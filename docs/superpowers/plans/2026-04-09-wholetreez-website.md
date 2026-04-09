# WholeTreez Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static two-page website for WholeTreez dispensary with homepage, COA page, and build-time QR code generation.

**Architecture:** Astro static site with two pages (index, COA), shared layout with navbar/footer, Astro components for UI sections, and a Node script for QR code generation at build time. React integration installed but not actively used yet.

**Tech Stack:** Astro 5, @astrojs/react, qrcode (npm), vanilla CSS

---

## File Structure

```
/
├── public/
│   ├── images/          (logos + hero — copied from /images)
│   ├── coa/             (renamed PDFs — copied from /coa)
│   └── qr/              (generated at build time)
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── components/
│   │   ├── Navbar.astro
│   │   ├── Hero.astro
│   │   ├── InfoSection.astro
│   │   ├── ContactSection.astro
│   │   └── CoaCard.astro
│   ├── pages/
│   │   ├── index.astro
│   │   └── coa.astro
│   └── styles/
│       └── global.css
├── scripts/
│   └── generate-qr.mjs
├── astro.config.mjs
├── tsconfig.json
└── package.json
```

---

### Task 1: Scaffold Astro Project and Copy Assets

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`
- Create: `public/images/` (copy logos + hero)
- Create: `public/coa/` (copy + rename PDFs)

- [ ] **Step 1: Initialize Astro project**

```bash
cd /Users/tom/Developer/wholetreez
npm create astro@latest . -- --template minimal --no-install --no-git
```

If prompted about the non-empty directory, proceed (the existing files won't conflict).

- [ ] **Step 2: Install dependencies**

```bash
npm install
npx astro add react --yes
npm install qrcode
```

- [ ] **Step 3: Copy image assets to public/images/**

```bash
mkdir -p public/images
cp "images/Logo Wholetreez Black.png" public/images/
cp "images/Logo Wholetreez White.png" public/images/
cp "images/Logo Wholetreez W Black.png" public/images/
cp "images/Logo Wholetreez W White.png" public/images/
cp "images/Logo Wholetreez line Black.png" public/images/
cp "images/Logo Wholetreez line White.png" public/images/
cp images/hero.jpg public/images/
```

- [ ] **Step 4: Copy and rename COA PDFs to public/coa/**

```bash
mkdir -p public/coa
cp "coa/2603RLI0343-1748 - Rochester 420 - Bubblegum Poppers 1_8th.pdf" public/coa/bubblegum-poppers.pdf
cp "coa/2603RLI0343-1749 - Rochester 420 - Lemon Poppers 1_8th.pdf" public/coa/lemon-poppers.pdf
cp "coa/2603RLI0343-1750 - Rochester 420 - Cherry Poppers 1_8th.pdf" public/coa/cherry-poppers.pdf
```

- [ ] **Step 5: Verify dev server starts**

```bash
npx astro dev
```

Expected: Server starts on `localhost:4321`, default Astro welcome page loads.

- [ ] **Step 6: Initialize git and commit**

```bash
git init
```

Create `.gitignore`:

```
node_modules/
dist/
.astro/
.superpowers/
public/qr/
```

```bash
git add -A
git commit -m "chore: scaffold Astro project with assets"
```

---

### Task 2: Global CSS and Base Layout

**Files:**
- Create: `src/styles/global.css`
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Create global.css**

Create `src/styles/global.css`:

```css
/* Reset */
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --color-black: #111;
  --color-white: #fff;
  --color-gray-light: #f5f5f5;
  --color-gray: #666;
  --color-gray-dark: #999;
  --max-width: 1100px;
}

html {
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  color: var(--color-black);
  background: var(--color-white);
}

body {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

a {
  color: inherit;
  text-decoration: none;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}
```

- [ ] **Step 2: Create BaseLayout.astro**

Create `src/layouts/BaseLayout.astro`:

```astro
---
import '../styles/global.css';

interface Props {
  title: string;
}

const { title } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title} | WholeTreez</title>
    <link rel="icon" type="image/png" href="/images/Logo Wholetreez W Black.png" />
  </head>
  <body>
    <slot />
    <footer class="footer">
      <p>&copy; 2026 WholeTreez. All rights reserved.</p>
    </footer>
  </body>
</html>

<style>
  .footer {
    margin-top: auto;
    padding: 32px 24px;
    text-align: center;
    font-size: 13px;
    color: var(--color-gray);
    border-top: 1px solid #eee;
  }
</style>
```

- [ ] **Step 3: Update index.astro to use BaseLayout**

Replace `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Home">
  <p>Coming soon</p>
</BaseLayout>
```

- [ ] **Step 4: Verify layout renders**

```bash
npx astro dev
```

Expected: `localhost:4321` shows "Coming soon" with the footer at the bottom.

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css src/layouts/BaseLayout.astro src/pages/index.astro
git commit -m "feat: add global CSS and base layout with footer"
```

---

### Task 3: Navbar Component

**Files:**
- Create: `src/components/Navbar.astro`
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Create Navbar.astro**

Create `src/components/Navbar.astro`:

```astro
---
const currentPath = Astro.url.pathname;
---

<nav class="navbar">
  <div class="navbar-inner">
    <a href="/" class="navbar-logo">
      <img src="/images/Logo Wholetreez line White.png" alt="WholeTreez" />
    </a>
    <div class="navbar-links">
      <a href="/" class:list={[{ active: currentPath === '/' }]}>Home</a>
      <a href="/coa" class:list={[{ active: currentPath === '/coa' || currentPath === '/coa/' }]}>COA</a>
    </div>
  </div>
</nav>

<style>
  .navbar {
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--color-black);
  }

  .navbar-inner {
    max-width: var(--max-width);
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
  }

  .navbar-logo img {
    height: 24px;
    width: auto;
  }

  .navbar-links {
    display: flex;
    gap: 32px;
  }

  .navbar-links a {
    color: var(--color-gray-dark);
    font-size: 13px;
    letter-spacing: 2px;
    text-transform: uppercase;
    transition: color 0.2s;
  }

  .navbar-links a:hover,
  .navbar-links a.active {
    color: var(--color-white);
  }

  @media (max-width: 768px) {
    .navbar-links {
      gap: 20px;
    }

    .navbar-links a {
      font-size: 12px;
    }
  }
</style>
```

- [ ] **Step 2: Add Navbar to BaseLayout**

In `src/layouts/BaseLayout.astro`, add the import and component:

Add to the frontmatter:
```astro
import Navbar from '../components/Navbar.astro';
```

Add `<Navbar />` as the first child inside `<body>`, before `<slot />`.

- [ ] **Step 3: Verify navbar renders**

```bash
npx astro dev
```

Expected: Dark sticky navbar with the WholeTreez wordmark on left, Home and COA links on right. Home link is white (active).

- [ ] **Step 4: Commit**

```bash
git add src/components/Navbar.astro src/layouts/BaseLayout.astro
git commit -m "feat: add sticky navbar with logo and nav links"
```

---

### Task 4: Hero Component

**Files:**
- Create: `src/components/Hero.astro`

- [ ] **Step 1: Create Hero.astro**

Create `src/components/Hero.astro`:

```astro
<section class="hero">
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <img
      src="/images/Logo Wholetreez White.png"
      alt="WholeTreez"
      class="hero-logo"
    />
    <p class="hero-tagline">Premium Cannabis &middot; New York</p>
    <a href="/coa" class="hero-cta">View Lab Results</a>
  </div>
</section>

<style>
  .hero {
    position: relative;
    min-height: 70vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url('/images/hero.jpg') center / cover no-repeat;
  }

  .hero-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
  }

  .hero-content {
    position: relative;
    text-align: center;
    padding: 48px 24px;
  }

  .hero-logo {
    max-width: 320px;
    margin: 0 auto 24px;
  }

  .hero-tagline {
    color: rgba(255, 255, 255, 0.8);
    font-size: 16px;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 32px;
  }

  .hero-cta {
    display: inline-block;
    padding: 14px 40px;
    background: var(--color-white);
    color: var(--color-black);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    transition: background 0.2s, color 0.2s;
  }

  .hero-cta:hover {
    background: var(--color-black);
    color: var(--color-white);
    outline: 1px solid var(--color-white);
  }

  @media (max-width: 768px) {
    .hero {
      min-height: 60vh;
    }

    .hero-logo {
      max-width: 240px;
    }
  }
</style>
```

- [ ] **Step 2: Add Hero to index.astro**

Update `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
---

<BaseLayout title="Home">
  <Hero />
</BaseLayout>
```

- [ ] **Step 3: Verify hero renders**

```bash
npx astro dev
```

Expected: Full hero section with `hero.jpg` background, dark overlay, white logo centered, tagline, and CTA button.

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.astro src/pages/index.astro
git commit -m "feat: add hero section with background image and CTA"
```

---

### Task 5: Info and Contact Sections

**Files:**
- Create: `src/components/InfoSection.astro`
- Create: `src/components/ContactSection.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create InfoSection.astro**

Create `src/components/InfoSection.astro`:

```astro
<section class="info">
  <div class="info-inner">
    <div class="info-item">
      <span class="info-label">Location</span>
      <span class="info-value">New York, NY</span>
    </div>
    <div class="info-item">
      <span class="info-label">Hours</span>
      <span class="info-value">Coming Soon</span>
    </div>
  </div>
</section>

<style>
  .info {
    padding: 64px 24px;
    border-bottom: 1px solid #eee;
  }

  .info-inner {
    max-width: var(--max-width);
    margin: 0 auto;
    display: flex;
    justify-content: center;
    gap: 80px;
  }

  .info-item {
    text-align: center;
  }

  .info-label {
    display: block;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--color-gray-dark);
    margin-bottom: 8px;
  }

  .info-value {
    font-size: 16px;
    color: var(--color-black);
  }

  @media (max-width: 768px) {
    .info-inner {
      flex-direction: column;
      gap: 32px;
      align-items: center;
    }
  }
</style>
```

- [ ] **Step 2: Create ContactSection.astro**

Create `src/components/ContactSection.astro`:

```astro
<section class="contact">
  <div class="contact-inner">
    <h2 class="contact-heading">Get In Touch</h2>
    <a href="mailto:info@wholetreez.com" class="contact-email">
      info@wholetreez.com
    </a>
  </div>
</section>

<style>
  .contact {
    padding: 80px 24px;
    background: var(--color-gray-light);
    text-align: center;
  }

  .contact-inner {
    max-width: var(--max-width);
    margin: 0 auto;
  }

  .contact-heading {
    font-size: 14px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--color-gray);
    margin-bottom: 16px;
    font-weight: 400;
  }

  .contact-email {
    font-size: 28px;
    font-weight: 700;
    color: var(--color-black);
    transition: opacity 0.2s;
  }

  .contact-email:hover {
    opacity: 0.6;
  }

  @media (max-width: 768px) {
    .contact-email {
      font-size: 20px;
    }
  }
</style>
```

- [ ] **Step 3: Add both sections to index.astro**

Update `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import InfoSection from '../components/InfoSection.astro';
import ContactSection from '../components/ContactSection.astro';
---

<BaseLayout title="Home">
  <Hero />
  <InfoSection />
  <ContactSection />
</BaseLayout>
```

- [ ] **Step 4: Verify both sections render**

```bash
npx astro dev
```

Expected: Below the hero — info section with Location and Hours, then a light gray contact section with the email prominently displayed as a clickable mailto link.

- [ ] **Step 5: Commit**

```bash
git add src/components/InfoSection.astro src/components/ContactSection.astro src/pages/index.astro
git commit -m "feat: add info and contact sections to homepage"
```

---

### Task 6: COA Page with CoaCard Component

**Files:**
- Create: `src/components/CoaCard.astro`
- Create: `src/pages/coa.astro`

- [ ] **Step 1: Create CoaCard.astro**

Create `src/components/CoaCard.astro`:

```astro
---
interface Props {
  name: string;
  href: string;
}

const { name, href } = Astro.props;
---

<a href={href} target="_blank" rel="noopener noreferrer" class="coa-card">
  <span class="coa-card-name">{name}</span>
  <span class="coa-card-action">View COA &rarr;</span>
</a>

<style>
  .coa-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 28px;
    border: 1px solid #e0e0e0;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .coa-card:hover {
    border-color: var(--color-black);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .coa-card-name {
    font-size: 16px;
    font-weight: 600;
  }

  .coa-card-action {
    font-size: 13px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--color-gray);
    transition: color 0.2s;
  }

  .coa-card:hover .coa-card-action {
    color: var(--color-black);
  }
</style>
```

- [ ] **Step 2: Create coa.astro page**

Create `src/pages/coa.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import CoaCard from '../components/CoaCard.astro';
---

<BaseLayout title="Certificates of Analysis">
  <main class="coa-page">
    <div class="coa-header">
      <h1>Certificates of Analysis</h1>
      <p>Lab-tested results for full transparency. Click any product to view its COA.</p>
    </div>

    <section class="coa-brand">
      <h2>WholeTreez</h2>
      <p class="coming-soon">Coming soon</p>
    </section>

    <section class="coa-brand">
      <h2>Super Dope</h2>
      <div class="coa-grid">
        <CoaCard name="Bubblegum Poppers" href="/coa/bubblegum-poppers.pdf" />
        <CoaCard name="Lemon Poppers" href="/coa/lemon-poppers.pdf" />
        <CoaCard name="Cherry Poppers" href="/coa/cherry-poppers.pdf" />
      </div>
    </section>
  </main>
</BaseLayout>

<style>
  .coa-page {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 64px 24px;
  }

  .coa-header {
    margin-bottom: 64px;
  }

  .coa-header h1 {
    font-size: 32px;
    font-weight: 800;
    margin-bottom: 12px;
  }

  .coa-header p {
    font-size: 16px;
    color: var(--color-gray);
  }

  .coa-brand {
    margin-bottom: 48px;
  }

  .coa-brand h2 {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 2px solid var(--color-black);
  }

  .coming-soon {
    color: var(--color-gray-dark);
    font-style: italic;
    font-size: 15px;
  }

  .coa-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  @media (max-width: 768px) {
    .coa-header h1 {
      font-size: 24px;
    }
  }
</style>
```

- [ ] **Step 3: Verify COA page renders and PDFs open**

```bash
npx astro dev
```

Navigate to `localhost:4321/coa`. Expected:
- Page header with title and description
- WholeTreez section with "Coming soon"
- Super Dope section with three cards
- Clicking a card opens the PDF in a new tab
- Nav link "COA" is highlighted as active

- [ ] **Step 4: Commit**

```bash
git add src/components/CoaCard.astro src/pages/coa.astro
git commit -m "feat: add COA page with brand sections and card links"
```

---

### Task 7: QR Code Generation Script

**Files:**
- Create: `scripts/generate-qr.mjs`
- Modify: `package.json` (build script)

- [ ] **Step 1: Create generate-qr.mjs**

Create `scripts/generate-qr.mjs`:

```js
import QRCode from 'qrcode';
import { mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'public', 'qr');

const DOMAIN = 'https://wholetreez.com';

const coas = [
  { name: 'bubblegum-poppers', file: 'bubblegum-poppers.pdf' },
  { name: 'lemon-poppers', file: 'lemon-poppers.pdf' },
  { name: 'cherry-poppers', file: 'cherry-poppers.pdf' },
];

await mkdir(outDir, { recursive: true });

for (const coa of coas) {
  const url = `${DOMAIN}/coa/${coa.file}`;
  const outPath = join(outDir, `${coa.name}.png`);
  await QRCode.toFile(outPath, url, {
    width: 512,
    margin: 2,
    color: { dark: '#000000', light: '#ffffff' },
  });
  console.log(`QR: ${outPath} -> ${url}`);
}

console.log('QR code generation complete.');
```

- [ ] **Step 2: Run the script to verify it works**

```bash
node scripts/generate-qr.mjs
```

Expected output:
```
QR: /Users/tom/Developer/wholetreez/public/qr/bubblegum-poppers.png -> https://wholetreez.com/coa/bubblegum-poppers.pdf
QR: /Users/tom/Developer/wholetreez/public/qr/lemon-poppers.png -> https://wholetreez.com/coa/lemon-poppers.pdf
QR: /Users/tom/Developer/wholetreez/public/qr/cherry-poppers.png -> https://wholetreez.com/coa/cherry-poppers.pdf
QR code generation complete.
```

Verify the PNGs exist:

```bash
ls -la public/qr/
```

- [ ] **Step 3: Update package.json build script**

In `package.json`, change the `build` script to:

```json
"build": "node scripts/generate-qr.mjs && astro build"
```

- [ ] **Step 4: Verify full build works**

```bash
npm run build
```

Expected: QR codes generate first, then Astro builds to `dist/`.

- [ ] **Step 5: Commit**

```bash
git add scripts/generate-qr.mjs package.json
git commit -m "feat: add build-time QR code generation for COA PDFs"
```

---

### Task 8: Final Verification

- [ ] **Step 1: Run full build and preview**

```bash
npm run build && npx astro preview
```

- [ ] **Step 2: Check homepage**

Navigate to `localhost:4321`. Verify:
- Navbar with logo and links
- Hero with background image, logo, tagline, CTA
- Info section with placeholder address/hours
- Contact section with email
- Footer

- [ ] **Step 3: Check COA page**

Navigate to `localhost:4321/coa`. Verify:
- WholeTreez "Coming soon" section
- Super Dope section with 3 clickable cards
- PDFs open in new tab

- [ ] **Step 4: Check mobile responsiveness**

Resize browser to ~375px width. Verify:
- Navbar doesn't overflow
- Hero scales down
- Info items stack vertically
- COA cards are full width

- [ ] **Step 5: Verify QR codes are in dist**

```bash
ls dist/qr/
```

Expected: `bubblegum-poppers.png`, `lemon-poppers.png`, `cherry-poppers.png`

- [ ] **Step 6: Commit any final adjustments**

```bash
git add -A
git commit -m "chore: final build verification"
```
