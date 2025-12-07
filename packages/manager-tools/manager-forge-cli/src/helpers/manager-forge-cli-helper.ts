import boxen, { Options as BoxenOptions } from 'boxen';
import CFonts from 'cfonts';
import chalk from 'chalk';
import gradient from 'gradient-string';
import ora, { Ora } from 'ora';

import { logger } from '@ovh-ux/manager-cli-core/logger';

import { ForgeCliOptions } from '@/types/GenerationType.js';
import { Answers } from '@/types/PromptType.js';
import { Theme } from '@/types/ThemeType.js';

/**
 * Retrieves the official OVH FORGE CLI theme colors.
 *
 * @returns {Theme} A color palette used across CLI visuals.
 */
export function getThemeColors(): Theme {
  return {
    primary: '#16A0FF', // Electric cyan blue — primary brand color
    secondary: '#B0C4DE', // Light steel gray — for gradient transitions
    accent: '#16A085', // Teal accent — used for success or highlights
    background: '#0A1638', // Deep navy — background for boxes
    text: '#FFFFFF', // White — text and titles
  };
}

/**
 * Dynamically renders an ASCII title with a responsive font.
 *
 * @param {string} [text='OVH FORGE CLI'] - The title to render.
 * @returns {string} - Rendered ASCII text, formatted for terminal display.
 */
export function renderTitle(text = 'OVH FORGE CLI'): string {
  const theme = getThemeColors();
  const terminalWidth = Math.max(process.stdout?.columns ?? 80, 40);

  // Normalize casing
  const titleText = text.toUpperCase();

  // Pick responsive font
  const font: 'console' | 'block' = terminalWidth > 119 ? 'block' : 'console';

  // Render using CFonts
  const rendered = CFonts.render(titleText, {
    font,
    align: 'center',
    colors: [theme.primary],
    background: 'transparent',
    letterSpacing: 1,
    lineHeight: 2,
    env: 'node',
  }) as { string: string };

  return rendered?.string?.trim?.() ?? titleText;
}

/**
 * Displays the main OVH FORGE CLI banner in a styled box.
 *
 * The banner combines the ASCII title with a gradient subtitle and
 * dynamically adjusts to the terminal size (capped at 130 columns).
 *
 * @param {string} [subtitle] - A short tagline displayed below the title.
 */
export function renderBanner(
  subtitle = '⚙️  A command-line tool to forge and shape your Manager apps.',
): void {
  const theme = getThemeColors();
  const title = renderTitle();
  const maxWidth = 130;
  const terminalWidth = Math.min(process.stdout?.columns ?? 80, maxWidth);

  // Create subtle gradient subtitle for aesthetic depth
  const subtitleGradient = gradient(theme.secondary, theme.primary)(`\n${subtitle}\n`);

  const boxOptions: BoxenOptions = {
    padding: { top: 1, bottom: 1, left: 6, right: 6 },
    margin: { top: 1, bottom: 1 },
    width: terminalWidth,
    borderStyle: 'double',
    borderColor: theme.primary,
    backgroundColor: theme.background,
    align: 'center',
  };

  logger.log(boxen(`${title}\n${subtitleGradient}`, boxOptions));
}

/**
 * Displays an initialization spinner during CLI startup.
 *
 * Simulates a short loading animation to enhance UX.
 * @async
 * @returns {Promise<void>} Resolves when initialization completes.
 */
export async function showInitializationSpinner(): Promise<void> {
  const theme = getThemeColors();
  const spinner: Ora = ora(chalk.hex(theme.primary)('Initializing CLI...')).start();

  await new Promise((resolve) => setTimeout(resolve, 800));

  spinner.succeed(chalk.hex(theme.primary)('Ready.'));
}

/**
 * Displays a formatted summary of all collected app generation answers.
 *
 * This step provides a clear overview before proceeding with scaffolding.
 *
 * @param {Answers} answers - User-provided answers from the interactive prompt.
 */
export function displayAppGenerationSummary(answers: Answers): void {
  const theme = getThemeColors();

  logger.clear();
  renderBanner();

  logger.log(chalk.green.bold('✅ Generation configuration summary:\n'));
  logger.log(`${chalk.hex(theme.primary)('Application Name:')} ${answers.appName}`);
  logger.log(`${chalk.hex(theme.primary)('Package Name:')} ${answers.packageName}`);
  logger.log(`${chalk.hex(theme.primary)('Description:')} ${answers.description}`);
  logger.log(`${chalk.hex(theme.primary)('Regions:')} ${answers.regions.join(', ')}`);
  logger.log(`${chalk.hex(theme.primary)('Universes:')} ${answers.universes.join(', ')}`);
  logger.log(`${chalk.hex(theme.primary)('Level2 code:')} ${answers.level2}`);
  logger.log(`${chalk.hex(theme.primary)('Tracking Universe:')} ${answers.universe}`);
  logger.log(`${chalk.hex(theme.primary)('Tracking SubUniverse:')} ${answers.subUniverse}`);

  logger.log('\n' + chalk.hex(theme.accent).bold('✨ All inputs collected. Proceeding...\n'));
}

/**
 * Runs a forge CLI command with unified UX and optional help display.
 *
 * @param runCommand - The CLI command callback.
 * @param options - Visual/UI options for the CLI runner.
 * @param helpText - Optional help text to display when user passes --help or -h.
 */
export async function runForgeCli(
  runCommand: () => void | Promise<void>,
  options: ForgeCliOptions = {},
  helpText?: string,
): Promise<void> {
  const { clearScreen = true, showBanner = true, showSpinner = true } = options;

  // ────────────────────────────────────────────────────────────
  // HELP MODE (before banner, before spinner)
  // ────────────────────────────────────────────────────────────
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    if (helpText) {
      logger.log(helpText);
    } else {
      logger.log('No help available for this command.');
    }
    return; // exit without running command
  }

  // ────────────────────────────────────────────────────────────
  // NORMAL MODE (banner, spinner, etc.)
  // ────────────────────────────────────────────────────────────
  if (clearScreen) logger.clear();
  if (showBanner) renderBanner();
  if (showSpinner) await showInitializationSpinner();

  try {
    logger.log('\n');
    await runCommand();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(chalk.red(message));
    process.exit(1);
  }
}
