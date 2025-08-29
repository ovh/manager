import { TokenMap } from './tokens-types';

/**
 * Options passed to the template application engine.
 *
 * Defines where templates are located, where they should be written,
 * and how {{TOKEN}} placeholders are replaced.
 */
export interface ApplyTemplatesOptions {
  /**
   * Absolute path to the template folder to copy from.
   *
   * Example: "/repo/scripts/templates/dashboard"
   */
  templateDir: string;

  /**
   * Absolute path to the target folder where rendered files will be written.
   *
   * Example: "/repo/packages/manager/apps/my-app"
   */
  targetDir: string;

  /**
   * Tokens used to replace `{{TOKEN}}` placeholders in file content and names.
   *
   * Contract: only string values are supported at this level.
   */
  tokens: TokenMap;

  /**
   * If true, prints intended actions (copy, overwrite, skip) but does not write any files.
   *
   * Useful for CI checks, dry runs, or debugging.
   */
  dryRun?: boolean;

  /**
   * If true, existing files in the target folder will be overwritten.
   * If false, the engine will skip those files.
   *
   * Default: `false`
   */
  overwrite?: boolean;
}

/**
 * Context passed to a PostProcessor.
 *
 * Contains the destination paths and the tokens actually applied
 * during replacement.
 */
export interface PostProcessorCtx {
  /** Absolute destination path of the file (after any name transforms). */
  absPath: string;

  /** Destination path relative to the provided `targetDir`. */
  relPath: string;

  /** Final tokens used during replacement. */
  tokens: TokenMap;
}

/**
 * A PostProcessor allows content-level transformations after token replacement
 * but before writing files to disk.
 *
 * Examples of processors:
 *  - Prettifying JSON
 *  - Fixing boolean placeholders (e.g. replacing "true" with unquoted true)
 *  - Adding license headers
 */
export interface PostProcessor {
  /**
   * Determines whether this processor should run for a given file.
   *
   * Use `relPath` and/or `absPath` to scope to specific directories or extensions.
   *
   * Example:
   *   match: (rel, abs) => rel.endsWith(".json")
   */
  match: (relPath: string, absPath: string) => boolean;

  /**
   * Pure function that transforms file content.
   *
   * Input is the file content after token replacement.
   * Output must be a new string (do not mutate in place).
   */
  transform: (content: string, ctx: PostProcessorCtx) => string;
}

/**
 * Internal extension of {@link ApplyTemplatesOptions} used by the engine itself.
 *
 * Provides extra knobs for dotfiles, binary handling, and post-processing.
 */
export interface InternalOptions extends ApplyTemplatesOptions {
  /**
   * Optional list of names to ignore at each directory level.
   *
   * Example: ["node_modules", ".DS_Store"]
   */
  ignore?: string[];

  /**
   * If enabled, file names starting with "_" in templates are renamed to dotfiles.
   *
   * Example:
   *   "_gitignore" → ".gitignore"
   *   "_eslintrc"  → ".eslintrc"
   */
  enableDotfileRename?: boolean;

  /**
   * Additional file extensions to treat as binary.
   *
   * These will be skipped from token replacement and written as-is.
   *
   * Example: ["png", "ico"]
   */
  binaryExtensions?: string[];

  /**
   * Optional content post-processing pipeline.
   *
   * Executed AFTER token replacement but BEFORE writing to disk.
   *
   * Example use cases:
   *   - normalize booleans,
   *   - prettify generated JSON/YAML,
   *   - inject headers or metadata.
   */
  postProcessors?: PostProcessor[];
}
