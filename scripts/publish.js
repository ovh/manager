#!/usr/bin/env node
/**
 * Nx-based publish script (replaces Lerna).
 *
 * - Supports --dry-run / --dryrun / -n
 * - Forwards --tag, --access, etc. to Nx Release / npm
 * - Uses a project-local npm cache (target/.npm-cache) to avoid EACCES on ~/.npm
 * - Relies on Nx Release configuration in nx.json to know which projects to publish.
 */

const fs = require('fs');
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// Nx Release programmatic API
const { releasePublish } = require('nx/release');

(async () => {
  const argv = await yargs(hideBin(process.argv))
    .version(false)
    .option('dry-run', {
      alias: ['dryrun', 'n'],
      type: 'boolean',
      describe: 'Simulate publish without pushing to the registry',
      default: false,
    })
    .option('tag', {
      type: 'string',
      describe: 'npm dist-tag to use (e.g. latest, next)',
    })
    .option('access', {
      type: 'string',
      describe: 'npm access (e.g. public, restricted)',
    })
    .option('projects', {
      type: 'string',
      describe:
        'Comma-separated list of Nx projects to publish (subset of Nx release config)',
    })
    .option('verbose', {
      type: 'boolean',
      default: false,
      describe: 'Enable verbose Nx Release logging',
    })
    // don't show default help/version noise (CI-friendly)
    .help(false)
    .parseAsync();

  const isDryRun = Boolean(argv['dry-run']);

  // ---------- Local npm cache (same behaviour as old script) ----------
  const npmCache =
    process.env.NPM_CONFIG_CACHE ||
    path.resolve(process.cwd(), 'target/.npm-cache');

  try {
    fs.mkdirSync(npmCache, { recursive: true });
  } catch {
    // best effort; if it fails, npm will fallback to its default cache
  }

  process.env.NPM_CONFIG_CACHE = npmCache;
  process.env.npm_config_cache = npmCache;

  // Optional project filter: allows you to mimic lerna --scope-like behaviour
  const projectsFilter = argv.projects
    ? String(argv.projects)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    : undefined;

  const commonOptions = {
    dryRun: isDryRun,
    verbose: argv.verbose,
    ...(projectsFilter ? { projects: projectsFilter } : {}),
  };

  // ---------- Publish phase ----------
  // NOTE:
  //  - This uses whatever versions are already in package.json.
  //  - Nx Release will check the registry and skip versions that are already published.
  const publishResults = await releasePublish({
    ...commonOptions,
    tag: argv.tag,
    access: argv.access,
    // Any extra releasePublish options you need can be added here.
  });

  const failures = Object.entries(publishResults).filter(
    ([, result]) => result.code !== 0,
  );

  if (failures.length) {
    console.error('Some packages failed to publish:\n');
    failures.forEach(([name, result]) => {
      console.error(` - ${name}: exit code ${result.code}`);
    });
    process.exit(1);
  }

  process.exit(0);
})().catch((err) => {
  // Keep the nice EACCES hint you had before, if you like:
  const stderr = String(err.stderr || err.message || '');
  if (stderr.includes('EACCES') && stderr.includes('/.npm')) {
    console.error(
      '\n⚠️  Detected npm cache permission issue on your home directory.\n' +
      '   This script uses a project-local cache, but if you still see this,\n' +
      `   ensure ${npmCache} is writable or fix your ~/.npm perms:\n` +
      '     sudo chown -R $(id -u):$(id -g) ~/.npm\n',
    );
  }

  console.error(err);
  process.exit(1);
});
