import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, '../dist');

// Inject CSS import into ES module
const esFile = path.join(distPath, 'manager-ui-kit-lib.es.js');
if (fs.existsSync(esFile)) {
  const content = fs.readFileSync(esFile, 'utf-8');
  const injected = `import './style.css';\n${content}`;
  fs.writeFileSync(esFile, injected, 'utf-8');
  console.log('✅ Injected CSS import into ES module');
}

// For CommonJS, we'll use require (executed at runtime)
const cjsFile = path.join(distPath, 'manager-ui-kit-lib.cjs.js');
if (fs.existsSync(cjsFile)) {
  const content = fs.readFileSync(cjsFile, 'utf-8');
  // Find the exports line and inject CSS loading before it
  const injected = content.replace(
    /(["']use strict["'];)/,
    `$1\n// Auto-load CSS\nif (typeof window !== 'undefined') {\n  const link = document.createElement('link');\n  link.rel = 'stylesheet';\n  link.href = new URL('./style.css', import.meta.url).href;\n  document.head.appendChild(link);\n}`,
  );
  fs.writeFileSync(cjsFile, injected, 'utf-8');
  console.log('✅ Injected CSS loading into CJS module');
}
