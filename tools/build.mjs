import { cp, mkdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const out = path.join(root, 'dist');
await mkdir(out, { recursive: true });
for (const item of ['index.html', 'payment.html', 'assets']) {
  await cp(path.join(root, item), path.join(out, item), { recursive: true });
}
for (const required of ['index.html', 'payment.html', 'assets/js/app.js', 'assets/js/pdf.js', 'assets/terma-dan-syarat.pdf', 'assets/logo-hulubalang.png']) {
  if (!(await stat(path.join(out, required))).isFile()) throw new Error('Fail tiada: ' + required);
}
console.log('Build berjaya. Fail untuk Vercel tersedia dalam dist/.');
