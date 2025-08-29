#!/usr/bin/env node
/**
 * CLI entry for the manager generator.
 *
 * - Uses the built JS from /dist (run `yarn build` first).
 * - Supports interactive (prompts) and non-interactive (flags / JSON) modes.
 * - Applies templates, then runs a tiny post-step to coerce some string tokens to booleans
 *   in the generated project (e.g., `isPci: 'true'` → `isPci: true`).
 *
 * Default output behavior:
 * - If `--out` is NOT provided, output goes to: <cwd>/<OUTPUT_BASE_DIR>/<appName-kebab>
 * - If `--out` IS provided, it overrides the default completely.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';

import { applyTemplates } from '../dist/src/kernel/generate-template/generate-templates.js';
import { OUTPUT_BASE_DIR } from '../dist/src/playbook/config/playbook-config.js';
import askQuestions from '../dist/src/playbook/playbook-main.js';
import { resolveTokens } from '../dist/src/playbook/tokens-main.js';
import { AnswersSchema } from '../dist/src/playbook/types/playbook-schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Shape of flags we care about when running non-interactively.
 * @typedef {Object} GeneratorFlags
 * @property {string=} answers
 * @property {string[]=} preset
 * @property {string=} out
 * @property {string=} template
 * @property {boolean=} ['non-interactive']
 * @property {boolean=} ['dry-run']
 * @property {boolean=} overwrite
 * @property {string=} appName
 * @property {string=} universe
 * @property {string=} subUniverse
 * @property {string=} region
 * @property {string=} flavor
 * @property {string=} language
 * @property {string=} framework
 * @property {boolean=} usePreset
 * @property {string=} mainApiPath
 * @property {string=} listingEndpointPath
 * @property {string=} dashboardEndpointPath
 */

/** @type {GeneratorFlags} */
// eslint-disable-next-line no-undef
const argv = yargs(hideBin(process.argv))
  .scriptName('manager-generator')
  .usage('$0 [options]')
  .option('non-interactive', {
    type: 'boolean',
    desc: 'Disable prompts; use flags/answers.json only',
  })
  .option('answers', { type: 'string', desc: 'Path to a JSON file with answers' })
  .option('preset', { type: 'array', desc: 'Preset name(s) to apply (can repeat)', string: true })
  .option('out', {
    type: 'string',
    desc: `Target directory for generated project (default: <cwd>/${OUTPUT_BASE_DIR}/<appName-kebab>)`,
  })
  .option('template', { type: 'string', desc: 'Template folder (defaults to templates/base)' })
  .option('dry-run', {
    type: 'boolean',
    desc: 'Print actions without writing files',
    default: false,
  })
  .option('overwrite', { type: 'boolean', desc: 'Overwrite existing files', default: false })

  // common fields you may want to pass non-interactively
  .option('appName', { type: 'string' })
  .option('universe', { type: 'string' })
  .option('subUniverse', { type: 'string' })
  .option('region', { type: 'string' })
  .option('flavor', { type: 'string' })
  .option('language', { type: 'string' })
  .option('framework', { type: 'string' })
  .option('usePreset', { type: 'boolean' })
  .option('mainApiPath', { type: 'string' })
  .option('listingEndpointPath', { type: 'string' })
  .option('dashboardEndpointPath', { type: 'string' })
  .help()
  .strict()
  .parse();

/**
 * Load answers from a JSON file when provided.
 *
 * @param {string | undefined} filePath - Absolute or relative path to a JSON file.
 * @returns {Promise<Record<string, unknown>>} Parsed JSON object or an empty object when no path is given.
 */
async function loadAnswersFile(filePath) {
  if (!filePath) return {};
  // eslint-disable-next-line no-undef
  const abs = path.resolve(process.cwd(), filePath);
  const raw = await fs.readFile(abs, 'utf-8');
  return JSON.parse(raw);
}

/**
 * Options for the boolean post-processing step.
 * @typedef {Object} BooleanFixOptions
 * @property {string} targetDir - Root of the generated project.
 * @property {boolean} dryRun - When true, log intended changes without writing files.
 */

/**
 * Post-process generated files to coerce specific string tokens into real booleans.
 *
 * Rationale:
 * Templates are plain `.ts` files and must remain valid pre-replacement.
 * We emit tokens as strings (e.g., `'{{isPci}}'`) so the template compiles,
 * then convert `'true'`/`'false'` to booleans in the generated output.
 *
 * Extend the `targets` list below to add more replacements when needed.
 *
 * @param {BooleanFixOptions} opts - Post-processing options.
 * @returns {Promise<void>} Resolves when all fixes are attempted.
 */
async function fixGeneratedBooleans(opts) {
  const { targetDir, dryRun } = opts;

  const targets = [
    {
      file: path.join(targetDir, 'src', 'App.constants.ts'),
      regex: /(\bisPci\s*:\s*)['"]\s*(true|false)\s*['"]/g,
      replacer: (_m, prefix, val) => `${prefix}${val}`,
    },
    {
      file: path.join(targetDir, 'tailwind.config.mjs'),
      regex: /(\bisPci\s*:\s*)['"]\s*(true|false)\s*['"]/g,
      replacer: (_m, prefix, val) => `${prefix}${val}`,
    },
  ];

  for (const t of targets) {
    try {
      const raw = await fs.readFile(t.file, 'utf8');
      const next = raw.replace(t.regex, t.replacer);
      if (next !== raw) {
        if (dryRun) {
          console.log(`📝 (post) would coerce booleans in ${t.file}`);
        } else {
          await fs.writeFile(t.file, next, 'utf8');
          console.log(`🔧 post-processed booleans in ${t.file}`);
        }
      }
    } catch {
      // file may not exist in all flavors
    }
  }
}

/**
 * Post-process package.json to turn single-string, comma-separated lists
 * into proper arrays of strings for selected fields (e.g., regions, universes).
 *
 * Examples:
 *   "regions": ["CA, EU, US"]     -> ["CA","EU","US"]
 *   "universes": ["Dedicated, Manager"] -> ["Dedicated","Manager"]
 *
 * Idempotent: if already normalized, it does nothing.
 *
 * @param {BooleanFixOptions} opts
 */
async function fixCommaSeparatedArrays(opts) {
  const { targetDir, dryRun } = opts;
  const pkgPath = path.join(targetDir, 'package.json');

  // Which top-level keys to normalize
  const fieldsToNormalize = ['regions', 'universes'];

  try {
    const raw = await fs.readFile(pkgPath, 'utf8');
    const pkg = JSON.parse(raw);

    let changed = false;

    const normalizeArray = (arr) => {
      if (!Array.isArray(arr)) return arr;

      // Only act if at least one string item contains a comma
      const hasCommaItem = arr.some((v) => typeof v === 'string' && v.includes(','));
      if (!hasCommaItem) return arr;

      // Split by comma, trim, drop empties and placeholder ellipsis
      const parts = arr.flatMap((v) => (typeof v === 'string' ? v.split(',') : [v]));
      const cleaned = parts
        .map((v) => (typeof v === 'string' ? v.trim() : v))
        .filter((v) => typeof v === 'string' && v.length > 0 && v !== '...' && v !== '…');

      // Deduplicate while preserving order
      return [...new Set(cleaned)];
    };

    for (const key of fieldsToNormalize) {
      if (key in pkg) {
        const before = pkg[key];
        const after = normalizeArray(before);

        // Only mark changed if it actually differs
        if (JSON.stringify(after) !== JSON.stringify(before)) {
          pkg[key] = after;
          changed = true;
        }
      }
    }

    if (changed) {
      if (dryRun) {
        console.log(`📝 (post) would normalize comma-separated arrays in ${pkgPath}`);
      } else {
        await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
        console.log(`🔧 normalized comma-separated arrays in ${pkgPath}`);
      }
    }
  } catch {
    // package.json might not exist in some flavors; ignore
  }
}

/**
 * Main program: gather answers, resolve tokens, render templates, run post-steps.
 *
 * Flow:
 *  1) Load answers from JSON (optional).
 *  2) Merge with CLI flags.
 *  3) If non-interactive, validate via AnswersSchema; else prompt to fill gaps.
 *  4) Resolve tokens (presets + env + derived).
 *  5) Determine template & output directories.
 *  6) Apply templates.
 *  7) Post-process generated files (e.g., coerce booleans).
 *
 * @returns {Promise<void>} Exits the process with code 1 on error.
 */
async function run() {
  // 1) seed from JSON file (if any)
  const jsonAnswers = await loadAnswersFile(argv.answers);

  // 2) seed from flags (yargs already parsed)
  const flagAnswers = {
    appName: argv.appName,
    universe: argv.universe,
    subUniverse: argv.subUniverse,
    region: argv.region,
    flavor: argv.flavor,
    language: argv.language,
    framework: argv.framework,
    usePreset: argv.usePreset,
    mainApiPath: argv.mainApiPath,
    listingEndpointPath: argv.listingEndpointPath,
    dashboardEndpointPath: argv.dashboardEndpointPath,
  };

  // 3) if non-interactive, validate and go; else, prompt to fill gaps
  /** @type {Record<string, unknown>} */
  let answers;
  if (argv['non-interactive']) {
    answers = AnswersSchema.parse({ ...jsonAnswers, ...flagAnswers });
  } else {
    // If askQuestions accepts no seed, this extra arg is simply ignored at runtime.
    const seed = { ...jsonAnswers, ...flagAnswers };
    answers = await askQuestions(seed);
  }

  // 4) resolve tokens (presets + env tokens)
  const ctxPresets = argv.preset?.length
    ? argv.preset.map(String)
    : // auto-pick preset when appropriate
      answers.isPci === 'true' && answers.usePreset
      ? ['pciQuickstart']
      : [];
  const tokens = await resolveTokens(answers, { presets: ctxPresets });

  // 5) choose template + target
  const templateDir = path.resolve(
    argv.template ? argv.template : path.join(__dirname, '../template'),
  );

  // Default output dir: <cwd>/<OUTPUT_BASE_DIR>/<appName-kebab>
  const appNameFolder = String(answers.appName)
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
  // eslint-disable-next-line no-undef
  const defaultOut = path.resolve(process.cwd(), OUTPUT_BASE_DIR, appNameFolder);

  const targetDir = path.resolve(argv.out ? argv.out : defaultOut);

  // 6) generate
  await applyTemplates({
    templateDir,
    targetDir,
    tokens,
    dryRun: !!argv['dry-run'],
    overwrite: !!argv.overwrite,
  });

  // 7) fix boolean generation
  await fixGeneratedBooleans({ targetDir, dryRun: !!argv['dry-run'] });

  // 8) normalize comma-separated arrays in package.json
  await fixCommaSeparatedArrays({ targetDir, dryRun: !!argv['dry-run'] });
}

run().catch((err) => {
  console.error(err);
  // eslint-disable-next-line no-undef
  process.exit(1);
});
