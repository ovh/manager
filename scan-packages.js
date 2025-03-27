const fs = require('fs');
const path = require('path');

function scanPackages(dir, dryRun = true) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    // eslint-disable-next-line no-restricted-syntax
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      // Skip node_modules and dist directories
      if (entry.name === 'node_modules' || entry.name === 'dist') {
        continue;
      }

      if (entry.isDirectory()) {
        scanPackages(fullPath, dryRun);
      } else if (entry.name === 'package.json') {
        try {
          const packageJson = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

          if (/\/apps\//.test(fullPath)) {
            delete packageJson.scripts['start:dev'];
            delete packageJson.scripts['start:watch'];
            packageJson.scripts.start = packageJson.scripts.dev;
            delete packageJson.scripts.dev;
            delete packageJson.scripts['dev:watch'];
            if (/\/apps\/container\//.test(fullPath)) {
              packageJson.scripts.start = 'vite';
            }
            if (dryRun) {
              console.log(`[DRY RUN] Would update ${packageJson.name}`);
              console.log(packageJson.scripts);
            } else {
              fs.writeFileSync(
                fullPath,
                `${JSON.stringify(packageJson, null, 2)}\n`,
              );
              console.log(`Updated ${packageJson.name}`);
            }
          }
          if (/\/modules\//.test(fullPath)) {
            if (packageJson.scripts) {
              delete packageJson.scripts['start:dev'];
              delete packageJson.scripts['start:watch'];
              delete packageJson.scripts.start;
              // packageJson.scripts.start = packageJson.scripts.dev;
              // delete packageJson.scripts.dev;
              if (dryRun) {
                console.log(`[DRY RUN] Would update ${packageJson.name}`);
                console.log(packageJson.scripts);
              } else {
                fs.writeFileSync(
                  fullPath,
                  `${JSON.stringify(packageJson, null, 2)}\n`,
                );
                console.log(`Updated ${packageJson.name}`);
              }
            }
          }
          if (/\/core\//.test(fullPath)) {
            if (packageJson.scripts) {
              delete packageJson.scripts['start:dev'];
              delete packageJson.scripts['start:watch'];
              delete packageJson.scripts.start;
              // packageJson.scripts.start = packageJson.scripts.dev;
              // delete packageJson.scripts.dev;
              if (dryRun) {
                console.log(`[DRY RUN] Would update ${packageJson.name}`);
                console.log(packageJson.scripts);
              } else {
                fs.writeFileSync(
                  fullPath,
                  `${JSON.stringify(packageJson, null, 2)}\n`,
                );
                console.log(`Updated ${packageJson.name}`);
              }
            }
          }
          if (/\/components\//.test(fullPath)) {
            delete packageJson.scripts['start:dev'];
            delete packageJson.scripts['start:watch'];
            delete packageJson.scripts.start;
            // packageJson.scripts.start = packageJson.scripts.dev;
            // delete packageJson.scripts.dev;
            if (dryRun) {
              console.log(`[DRY RUN] Would update ${packageJson.name}`);
              console.log(packageJson.scripts);
            } else {
              fs.writeFileSync(
                fullPath,
                `${JSON.stringify(packageJson, null, 2)}\n`,
              );
              console.log(`Updated ${packageJson.name}`);
            }
          }
        } catch (err) {
          console.error(`Error processing ${fullPath}: ${err.message}`);
        }
      }
    }
  } catch (err) {
    console.error(`Error scanning directory ${dir}: ${err.message}`);
  }
}

// Run with dry-run by default
const dryRun = process.argv.includes('--dry-run');
console.log(dryRun);
console.log(
  dryRun
    ? 'Dry run mode - no changes will be made'
    : 'LIVE mode - files will be modified',
);
scanPackages(process.cwd(), dryRun);
