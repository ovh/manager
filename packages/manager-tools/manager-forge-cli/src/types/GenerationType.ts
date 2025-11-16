/**
 * Supported case styles for generated filenames.
 */
export type CaseStyle =
  | 'PASCAL_CASE'
  | 'CAMEL_CASE'
  | 'KEBAB_CASE'
  | 'SCREAMING_SNAKE_CASE'
  | 'FLAT_CASE'
  | 'SNAKE_CASE';

/**
 * Describes generation parameters for a specific entity type
 * (API, component, hook, page).
 */
export interface GeneratorOptions {
  /** Type of entity being generated (used for logs). */
  type: 'api' | 'component' | 'hook' | 'page';
  /** CLI flag key for this generator (e.g. `--api`, `--component`). */
  argKey: string;
  /** Relative folder (under `src/`) where the file should be created. */
  folder: string;
  /** File extension to use (e.g. `.ts`, `.tsx`, `.api.ts`). */
  extension: string;
  /** Naming convention style to apply to the entity name. */
  caseStyle?: CaseStyle;
}

/**
 * Optional configuration flags controlling the visual behavior of the
 * generic Forge CLI runner (`runForgeCli`).
 *
 * These options allow each CLI command to enable or disable
 * screen clearing, banner display, and loading spinner animations,
 * while preserving a unified UX by default.
 */
export interface ForgeCliOptions {
  /**
   * Whether to clear the terminal screen before running the CLI command.
   *
   * @default true
   */
  clearScreen?: boolean;

  /**
   * Whether to display the ASCII banner at the beginning of the CLI execution.
   *
   * @default true
   */
  showBanner?: boolean;

  /**
   * Whether to show the loading spinner animation during initialization.
   *
   * @default true
   */
  showSpinner?: boolean;
}
