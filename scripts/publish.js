#!/usr/bin/env node
/**
 * scripts/publish.js
 *
 * - Supports --dry-run / --dryrun / -n (simulates publish)
 * - Forwards all other CLI flags (e.g., --tag v1.2.3, --access public)
 * - Uses a project-local npm cache to avoid EACCES on ~/.npm
 */
const execa = require('execa');
const pSeries = require('p-series');
const fs = require('fs');
const path = require('path');

// ---------- CLI flags ----------
const rawArgs = process.argv.slice(2);
const isDryRun =
  rawArgs.includes('--dry-run') ||
  rawArgs.includes('--dryrun') ||
  rawArgs.includes('-n');

// forward every flag except the dry-run aliases
const forwardArgs = rawArgs.filter(
  (a) => a !== '--dry-run' && a !== '--dryrun' && a !== '-n',
);

// ---------- Local npm cache to avoid permission issues ----------
const npmCache =
  process.env.NPM_CONFIG_CACHE ||
  path.resolve(process.cwd(), 'target/.npm-cache');

try {
  fs.mkdirSync(npmCache, { recursive: true });
} catch (_) {
  // best effort; if it fails, npm will still try default cache
}

const baseEnv = {
  ...process.env,
  NPM_CONFIG_CACHE: npmCache,   // npm respects both cases
  npm_config_cache: npmCache,
};

// convenience wrappers
const npmInfo = (pkgSpec) =>
  execa('npm', ['info', pkgSpec], { env: baseEnv }); // capture stdout

const lernaExec = (args, inherit = true) =>
  execa('lerna', args, {
    env: baseEnv,
    stdio: inherit ? 'inherit' : 'pipe',
  });

execa('lerna', ['ls', '-pl', '--json', '--toposort'], { env: baseEnv })
  .then(({ stdout }) => {
    const packages = JSON.parse(stdout);

    return Promise.all(
      packages.map(async (pkg) => {
        // read package.json for per-package knobs
        const pkgJsonPath = path.join(pkg.location, 'package.json');
        let ignoreDependencies = false;
        try {
          const parseFullPkg = JSON.parse(
            fs.readFileSync(pkgJsonPath, { encoding: 'utf-8' }),
          );
          ignoreDependencies = Boolean(parseFullPkg.ignoreDependencies);
        } catch (_) {
          // ignore; default false
        }

        // check if version already exists on registry
        try {
          const { stdout: infoOut } = await npmInfo(
            `${pkg.name}@${pkg.version}`,
          );
          // if we got any output, consider it published
          return {
            ...pkg,
            publish: infoOut && infoOut.length > 0, // true => already published
            ignoreDependencies,
          };
        } catch (err) {
          // 404 → not published yet; any other error: surface helpful message but keep going
          const stderr = String(err.stderr || '');
          if (!stderr.includes('404')) {
            console.error(
              'npm info failed for',
              `${pkg.name}@${pkg.version}`,
              '\n',
              stderr || err.message || err,
            );
            // NOTE: don’t exit here; we’ll treat as "not published" so the pipeline can proceed.
          }
          return {
            ...pkg,
            publish: false, // not found or info failed → attempt publish
            ignoreDependencies,
          };
        }
      }),
    );
  })
  .then((packages) =>
    pSeries(
      packages
        .map((pkg) => {
          if (!pkg.publish) {
            return async () => {
              const prefix = isDryRun ? '[DRY-RUN] ' : '';
              console.log(`${prefix}Publishing package ${pkg.name}`);

              // Step 1: (optional) prepare — validates artifacts even in dry-run
              const includeDeps = pkg.ignoreDependencies
                ? []
                : ['--include-dependencies'];

              await lernaExec(
                [
                  'exec',
                  '--scope',
                  pkg.name,
                  ...includeDeps,
                  '--',
                  'npm',
                  'run',
                  'prepare',
                  '--if-present',
                ],
                true,
              );

              // Step 2: publish
              if (isDryRun) {
                // Simulate publish with npm (no registry writes)
                await lernaExec(
                  [
                    'exec',
                    '--scope',
                    pkg.name,
                    '--',
                    'npm',
                    'publish',
                    '--dry-run',
                    ...forwardArgs,
                  ],
                  true,
                );
              } else {
                // Real publish with yarn (kept from original script)
                await lernaExec(
                  [
                    'exec',
                    '--scope',
                    pkg.name,
                    '--',
                    'yarn',
                    'publish',
                    '--access=public',
                    '--non-interactive',
                    ...forwardArgs,
                  ],
                  true,
                );
              }
            };
          }

          console.log(
            `Package ${pkg.name} has been skipped (already published)`,
          );
          return null;
        })
        .filter(Boolean),
    ),
  )
  .catch((err) => {
    // Print a clearer hint for cache permission issues
    const stderr = String(err.stderr || '');
    if (stderr.includes('EACCES') && stderr.includes('/.npm')) {
      console.error(
        '\n⚠️  Detected npm cache permission issue on your home directory.\n' +
        '   This script now uses a project-local cache to avoid that, but if you still see this,\n' +
        `   ensure ${npmCache} is writable or fix your ~/.npm perms:\n` +
        '     sudo chown -R $(id -u):$(id -g) ~/.npm\n',
      );
    }
    console.error(err);
    process.exit(1);
  });
