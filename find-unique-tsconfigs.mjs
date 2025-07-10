import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const rootDir = path.resolve('packages/manager/apps');
const tsconfigFilename = 'tsconfig.json';

/**
 * Recursively find all tsconfig.json files in the app directory tree.
 */
function findAllTsconfigs(dir) {
  const tsconfigs = [];

  function walk(current) {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name === tsconfigFilename) {
        tsconfigs.push(fullPath);
      }
    }
  }

  walk(dir);
  return tsconfigs;
}

/**
 * Hash the tsconfig content to uniquely identify it.
 */
function hashConfig(config) {
  return crypto.createHash('sha256').update(JSON.stringify(config)).digest('hex');
}

function main() {
  const tsconfigs = findAllTsconfigs(rootDir);
  const uniqueConfigs = new Map(); // hash => { config, usedBy }

  for (const filePath of tsconfigs) {
    const content = fs.readFileSync(filePath, 'utf-8');
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      console.error(`Failed to parse ${filePath}: ${e.message}`);
      continue;
    }

    const hash = hashConfig(parsed);
    const relativeAppPath = path.relative(rootDir, filePath).split(path.sep)[0];

    if (!uniqueConfigs.has(hash)) {
      uniqueConfigs.set(hash, {
        config: parsed,
        usedBy: new Set(),
      });
    }

    uniqueConfigs.get(hash).usedBy.add(relativeAppPath);
  }

  // Output results
  console.log(`✅ Found ${tsconfigs.length} tsconfig.json files`);
  console.log(`🧬 Unique configurations: ${uniqueConfigs.size}`);

  let i = 1;
  for (const [hash, { config, usedBy }] of uniqueConfigs.entries()) {
    console.log(`\n--- Configuration ${i} ---`);
    console.log(`Used by apps: ${[...usedBy].join(', ')}`);
    console.log(`Configuration (trimmed):`);
    console.dir(config, { depth: 2, maxArrayLength: 10 });
    i++;
  }
}

main();
