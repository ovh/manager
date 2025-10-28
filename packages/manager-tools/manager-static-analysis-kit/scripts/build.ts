// scripts/build.ts
import { execSync } from 'node:child_process';
import { writeFileSync, rmSync, mkdirSync, existsSync, cpSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

type SrcDest = readonly [src: string, dest: string];

// 1) Your requested src/dest mapping
const tsConfigFiles: SrcDest[] = [
  ['src/adapters/ts-config/config/standard/tsconfig.react.ts',       'tsconfig/react.json'],
  ['src/adapters/ts-config/config/standard/tsconfig.node.ts',        'tsconfig/node.json'],
  ['src/adapters/ts-config/config/standard/tsconfig.test.ts',        'tsconfig/test.json'],
  ['src/adapters/ts-config/config/strict/tsconfig.react.ts',         'tsconfig/react-strict.json'],
  ['src/adapters/ts-config/config/strict/tsconfig.node.ts',          'tsconfig/node-strict.json'],
  ['src/adapters/ts-config/config/strict/tsconfig.test.ts',          'tsconfig/test-strict.json'],
];

// 2) Extra ambient .d.ts files that must be copied to dist (for matcher typings, etc.)
const extraDtsFiles: SrcDest[] = [
  [
    'src/adapters/html-w3c-validation/types/globals/html-w3c-tests-setup.d.ts',
    'adapters/html-w3c-validation/helpers/html-w3c-tests-setup.d.ts',
  ],
  [
    'src/adapters/html-w3c-validation/types/globals/vnu-jar.d.ts',
    'adapters/html-w3c-validation/types/globals/vnu-jar.d.ts',
  ],
  [
    'src/adapters/html-a11y-validation/types/html-a11y-tests-setup.d.ts',
    'adapters/html-a11y-validation/helpers/html-a11y-tests-setup.d.ts',
  ],
];

// @ts-ignore
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = resolve(__dirname, '..');
const dist = resolve(root, 'dist');

async function flattenTSConfigs(pairs: SrcDest[]) {
  for (const [srcRel, destRel] of pairs) {
    const srcFullPath = resolve(root, srcRel);
    const destFullPath = resolve(dist, destRel);
    const destDir = dirname(destFullPath);
    if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true });

    const mod = await import(pathToFileURL(srcFullPath).href);
    const config = mod.default;
    writeFileSync(destFullPath, JSON.stringify(config, null, 2), 'utf8');
  }
}

function copyExtraDts(pairs: SrcDest[]) {
  for (const [srcRel, destRel] of pairs) {
    const srcAbs = resolve(root, srcRel);
    if (!existsSync(srcAbs)) continue; // allow optional files
    const dstAbs = resolve(dist, destRel); // dest is inside dist/
    const dstDir = dirname(dstAbs);
    if (!existsSync(dstDir)) mkdirSync(dstDir, { recursive: true });
    cpSync(srcAbs, dstAbs);
  }
}

(async () => {
  console.log('🧹 Cleaning dist...');
  rmSync(dist, { recursive: true, force: true });

  console.log('🛠️  Building TypeScript...');
  execSync('tsc --project tsconfig.json', { stdio: 'inherit' });

  console.log('🔧 Rewriting imports using tsc-alias config...');
  execSync('tsc-alias', { stdio: 'inherit' });

  console.log('📦 Flattening TypeScript config files...');
  await flattenTSConfigs(tsConfigFiles);

  console.log('🧾 Copying extra .d.ts files...');
  copyExtraDts(extraDtsFiles);

  console.log('✅ Build completed with flattened tsconfigs and copied .d.ts files.');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
