import chalk from 'chalk';
import fs from 'node:fs';
import path from 'node:path';

import {
  APPLICATIONS_FOLDER_PATH,
  IGNORE_TARGETS,
  MODULES_FOLDER_PATH,
} from '@/configs/manager-forge-path-config.js';
import { CaseStyle, GeneratorOptions } from '@/types/GenerationType.js';
import { logger } from '@/utils/log-manager.js';

/**
 * Ensures that a given relative path (app/module) is added
 * to all ignore files (.eslintignore, .prettierignore, .stylelintignore)
 * without duplicating entries.
 *
 * @param {'app' | 'module'} type
 * @param {string} name - appName or moduleName
 */
export function updateIgnoreFiles(type: 'app' | 'module', name: string): void {
  const entry =
    type === 'app' ? `${APPLICATIONS_FOLDER_PATH}/${name}` : `${MODULES_FOLDER_PATH}/${name}`;

  IGNORE_TARGETS.forEach(({ file, label }) => {
    const filePath = path.join(process.cwd(), file);

    // If ignore file doesn't exist, skip silently
    if (!fs.existsSync(filePath)) {
      logger.warn(`⚠️ ${label} ignore file "${file}" not found. Skipping.`);
      return;
    }

    const content = fs.readFileSync(filePath, 'utf8');

    if (content.includes(entry)) {
      logger.log(`ℹ️ ${label}: entry already exists in ${file}`);
      return;
    }

    // Append with proper newline handling
    const updated = content.endsWith('\n') ? content + `${entry}\n` : content + `\n${entry}\n`;

    fs.writeFileSync(filePath, updated, 'utf8');
    logger.log(`✅ Added "${entry}" to ${file} (${label})`);
  });
}

/**
 * Parses CLI arguments of the form `--flag value` into an object map.
 * Skips flags without a following value and ensures type safety.
 *
 * @param {string[]} argv - Raw CLI arguments (e.g., process.argv.slice(2)).
 * @returns {Record<string, string>} Parsed arguments as key-value pairs.
 *
 * @example
 * parseArgs(['--app', 'my-app', '--api', 'User']);
 * // => { app: 'my-app', api: 'User' }
 */
export function parseArgs(argv: string[]): Record<string, string> {
  const args: Record<string, string> = {};

  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index];
    if (!argument?.startsWith('--')) continue;

    const flagName = argument.slice(2);
    const flagValue = argv[index + 1];

    if (flagValue && !flagValue.startsWith('--')) {
      args[flagName] = flagValue;
      index++; // Skip the value
    } else {
      logger.warn(`⚠️ Missing value for flag --${flagName}, skipping.`);
    }
  }

  return args;
}

/**
 * Ensures that a CLI flag value is provided and not empty.
 * Exits the process with an error message if the value is missing.
 *
 * @param {string | undefined} value - The provided argument value.
 * @param {string} flag - The flag name (e.g., `--app`, `--api`).
 * @throws Terminates the process if the value is empty or undefined.
 */
export function assertNonEmpty(value: string | undefined, flag: string): asserts value is string {
  if (!value || !value.trim()) {
    logger.error(chalk.red(`❌ Missing required flag ${flag}`));
    process.exit(1);
  }
}

/**
 * Verifies that the specified app directory exists.
 * Exits the process with an error message if not found.
 *
 * @param {string} appDirectory - Absolute path to the app directory.
 * @throws Terminates the process if the directory does not exist.
 */
export function ensureApplicationExists(appDirectory: string): void {
  if (!fs.existsSync(appDirectory)) {
    logger.error(chalk.red(`❌ App not found at: ${appDirectory}`));
    process.exit(1);
  }
}

/**
 * Ensures that a directory exists, creating it recursively if missing.
 *
 * @param {string} directoryPath - Directory path to verify or create.
 */
export function ensureDirectoryExists(directoryPath: string): void {
  if (!fs.existsSync(directoryPath)) fs.mkdirSync(directoryPath, { recursive: true });
}

/**
 * Converts a string to PascalCase (e.g., `user-profile` → `UserProfile`).
 *
 * @param {string} input - Input string.
 * @returns {string} PascalCase formatted string.
 */
export function toPascalCase(input: string): string {
  return input
    .replace(/[-_\s]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * Converts a string to camelCase (e.g., `user-profile` → `userProfile`).
 *
 * @param {string} input - Input string.
 * @returns {string} camelCase formatted string.
 */
export function toCamelCase(input: string): string {
  const pascal = toPascalCase(input);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/**
 * Applies the correct naming convention according to the provided case style.
 *
 * @param {string} input - The raw input string.
 * @param {CaseStyle} style - The naming convention to apply.
 * @returns {string} The formatted name following the desired style.
 *
 * @example
 * formatName('user profile', 'KEBAB_CASE'); // 'user-profile'
 * formatName('user profile', 'PASCAL_CASE'); // 'UserProfile'
 */
export function formatName(input: string, style?: CaseStyle): string {
  switch (style) {
    case 'PASCAL_CASE':
      return toPascalCase(input);
    case 'CAMEL_CASE':
      return toCamelCase(input);
    case 'KEBAB_CASE':
      return input.toLowerCase().replace(/\s+/g, '-');
    case 'SNAKE_CASE':
      return input.toLowerCase().replace(/\s+/g, '_');
    default:
      return input;
  }
}

/**
 * Generates a new file for the specified app and entity type.
 * It verifies directory existence, applies naming conventions, and
 * writes a minimal placeholder file.
 *
 * @param {Object} params - Generation configuration object.
 * @param {string} params.appName - Name of the app containing the new entity.
 * @param {string} params.itemName - The name of the entity to generate.
 * @param {GeneratorOptions} params.options - The generator options for this entity type.
 * @param {string} [params.appsDir='packages/apps'] - Optional base directory for apps.
 *
 * @example
 * generateFile({
 *   appName: 'billing',
 *   itemName: 'UserProfile',
 *   options: {
 *     type: 'api',
 *     argKey: 'api',
 *     folder: 'data',
 *     extension: '.api.ts',
 *     caseStyle: 'PASCAL_CASE'
 *   },
 * });
 */
export function generateFile({
  appName,
  itemName,
  options,
  appsDir = '',
}: {
  appName: string;
  itemName: string;
  options: GeneratorOptions;
  appsDir?: string;
}): void {
  const appDirectory = path.resolve(appsDir, appName);
  ensureApplicationExists(appDirectory);

  const targetDirectory = path.join(appDirectory, 'src', options.folder);
  ensureDirectoryExists(targetDirectory);

  const formattedName = formatName(itemName, options.caseStyle);
  const targetFilePath = path.join(targetDirectory, `${formattedName}${options.extension}`);

  if (fs.existsSync(targetFilePath)) {
    logger.error(
      chalk.red(`❌ ${options.type} "${formattedName}" already exists at: ${targetFilePath}`),
    );
    process.exit(1);
  }

  fs.writeFileSync(targetFilePath, `// ${options.type}: ${formattedName}\n`, 'utf8');
  logger.log(chalk.green(`✅ Created ${path.relative(process.cwd(), targetFilePath)}`));
}

/**
 * Ensures hook names always start with "use", with the rest in PascalCase.
 *
 * Examples:
 *  datauser      → useDatauser
 *  DataUser      → useDataUser
 *  useDataUser   → useDataUser
 *  usedatauser   → useDatauser
 */
export function normalizeHookName(raw: string): string {
  const cleaned = raw.trim();

  if (cleaned.startsWith('use')) {
    // Already has use prefix → just PascalCase the rest
    const rest = cleaned.slice(3); // remove "use"
    return 'use' + toPascalCase(rest);
  }

  return 'use' + toPascalCase(cleaned);
}

/**
 * CLI entrypoint handler for any generator command (API, component, hook, page).
 * It reads command-line args, validates them, and delegates generation.
 *
 * @param {string[]} argv - Raw CLI arguments (typically `process.argv.slice(2)`).
 * @param {GeneratorOptions} options - Type-specific generation configuration.
 *
 * @example
 * forgeGenerateCli(process.argv.slice(2), {
 *   type: 'component',
 *   argKey: 'component',
 *   folder: 'components',
 *   extension: '.component.tsx',
 *   caseStyle: 'PASCAL_CASE'
 * });
 */
export function forgeGenerateCli(argv: string[], options: GeneratorOptions): void {
  const parsedArgs = parseArgs(argv);
  const appName = parsedArgs.app;
  const entityName = parsedArgs[options.argKey];

  assertNonEmpty(appName, '--app');
  assertNonEmpty(entityName, `--${options.argKey}`);

  generateFile({ appName, itemName: entityName, options, appsDir: APPLICATIONS_FOLDER_PATH });
}
