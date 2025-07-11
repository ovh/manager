import { execSync } from 'node:child_process';
import { writeFileSync, rmSync, mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

(async () => {
  // @ts-ignore
  const root = resolve(import.meta.dirname, '..');
  const dist = resolve(root, 'dist');

  console.log('🧹 Cleaning dist...');
  rmSync(dist, { recursive: true, force: true });

  console.log('🛠️  Building TypeScript...');
  execSync('tsc --project tsconfig.json', { stdio: 'inherit' });

  console.log('📦 Flattening TypeScript config files...');

  const configs: [string, string][] = [
    ['src/adapters/ts-config/config/standard/tsconfig.react.ts', 'tsconfig/react.json'],
    ['src/adapters/ts-config/config/standard/tsconfig.node.ts', 'tsconfig/node.json'],
    ['src/adapters/ts-config/config/standard/tsconfig.test.ts', 'tsconfig/test.json'],
    ['src/adapters/ts-config/config/strict/tsconfig.react.ts', 'tsconfig/react-strict.json'],
    ['src/adapters/ts-config/config/strict/tsconfig.node.ts', 'tsconfig/node-strict.json'],
    ['src/adapters/ts-config/config/strict/tsconfig.test.ts', 'tsconfig/test-strict.json'],
  ];

  for (const [sourcePath, destPath] of configs) {
    const srcFullPath = resolve(root, sourcePath);
    const destFullPath = resolve(dist, destPath);
    const destDir = resolve(dist, destPath.split('/').slice(0, -1).join('/'));

    if (!existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true });
    }

    const configModule = await import(pathToFileURL(srcFullPath).href);
    const config = configModule.default;

    writeFileSync(destFullPath, JSON.stringify(config, null, 2), 'utf8');
  }

  console.log('✅ Build completed with flattened tsconfigs.');
})();
