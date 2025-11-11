import boxen, { Options as BoxenOptions } from 'boxen';
import CFonts from 'cfonts';
import chalk from 'chalk';
import gradient from 'gradient-string';
import ora, { Ora } from 'ora';

import { Answers } from '@/types/PromptType.js';
import { Theme } from '@/types/ThemeType.js';

/**
 * Returns a consistent set of theme colors for the OVH FORGE CLI.
 */
export function getThemeColors(): Theme {
  return {
    primary: '#16A0FF', // Electric cyan blue
    secondary: '#B0C4DE', // Light steel gray (for gradients)
    accent: '#16A085', // Teal highlight for success messages
    background: '#0A1638', // Deep navy background
    text: '#FFFFFF', // White title text
  };
}

/**
 * Safely renders an ASCII title with brand colors.
 */
export function renderTitle(text = 'OVH FORGE CLI'): string {
  const theme = getThemeColors();

  const result = CFonts.render(text, {
    font: 'slick',
    align: 'center',
    colors: [theme.text, theme.primary],
    background: 'transparent',
    letterSpacing: 1,
    lineHeight: 1,
    env: 'node',
  });

  // Narrow the unknown return type
  if (
    result &&
    typeof result === 'object' &&
    'string' in result &&
    typeof (result as { string: unknown }).string === 'string'
  ) {
    return (result as { string: string }).string.trim();
  }

  // Fallback: return the raw text if structure is unexpected
  return text;
}

/**
 * Displays the main banner box with gradient subtitle and theming.
 */
export function renderBanner(
  subtitle = '⚙️  A command-line tool to forge and shape your Manager apps.',
): void {
  const theme = getThemeColors();
  const title = renderTitle();
  const width = Math.min(process.stdout?.columns ?? 120, 120);

  const subtitleGradient = gradient(theme.secondary, theme.primary)(`\n${subtitle}\n`);

  const boxOptions: BoxenOptions = {
    padding: { top: 1, bottom: 1, left: 6, right: 6 },
    margin: { top: 1, bottom: 1 },
    width,
    borderStyle: 'round',
    borderColor: theme.background,
    backgroundColor: theme.background,
    align: 'center',
  };

  console.log(boxen(`${title}\n${subtitleGradient}`, boxOptions));
}

/**
 * Displays a short spinner during initialization.
 */
export async function showInitializationSpinner(): Promise<void> {
  const theme = getThemeColors();
  const spinner: Ora = ora(chalk.hex(theme.primary)('Initializing CLI...')).start();
  await new Promise((resolve) => setTimeout(resolve, 800));
  spinner.succeed(chalk.hex(theme.primary)('Ready.'));
}

/**
 * Displays a formatted summary of collected app generation answers.
 */
export function displayAppGenerationSummary(answers: Answers): void {
  const theme = getThemeColors();

  console.clear();
  renderBanner();

  console.log(chalk.green.bold('✅ Generation configuration summary:\n'));
  console.log(`${chalk.hex(theme.primary)('Application Name:')} ${answers.appName}`);
  console.log(`${chalk.hex(theme.primary)('Package Name:')} ${answers.packageName}`);
  console.log(`${chalk.hex(theme.primary)('Description:')} ${answers.description}`);
  console.log(`${chalk.hex(theme.primary)('Regions:')} ${answers.regions.join(', ')}`);
  console.log(`${chalk.hex(theme.primary)('Universes:')} ${answers.universes.join(', ')}`);
  console.log(`${chalk.hex(theme.primary)('Level2 code:')} ${answers.level2}`);
  console.log(`${chalk.hex(theme.primary)('Tracking Universe:')} ${answers.universe}`);
  console.log(`${chalk.hex(theme.primary)('Tracking SubUniverse:')} ${answers.subUniverse}`);
  console.log('\n' + chalk.hex(theme.accent).bold('✨ All inputs collected. Proceeding...\n'));
}
