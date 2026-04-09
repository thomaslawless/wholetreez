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
