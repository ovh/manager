/**
 * @file template-utils.ts
 * @description
 * Small utilities shared by the template application pipeline.
 *
 * These helpers are used to:
 * - Format logs for file operations
 * - Ensure directories exist
 * - Detect binary files
 * - Build runtime token maps
 * - Apply naming conventions (tokens, dotfiles)
 * - Write files safely with overwrite/dry-run support
 * - Apply content post-processors
 */
import { promises as fsp } from 'node:fs';
import path from 'node:path';

import { DEFAULT_BINARY_EXTS } from '../../playbook/config/kernel-config';
import { replaceTokens } from '../tokens/tokens-helper';
import { InternalOptions, PostProcessor, PostProcessorCtx } from '../types/template-types';

/**
 * Convert a file operation result status into a human-readable label with an emoji indicator.
 *
 * @param result - File operation result type.
 *   - `'created'`: new file was written
 *   - `'overwritten'`: existing file was replaced
 *   - `'skipped-exists'`: file already exists and was skipped
 *   - `'dry-run'`: no write, dry-run mode
 *
 * @returns A human-friendly label string with emoji.
 *
 * @example
 * ```ts
 * console.log(labelFor('created')); // "✅ created"
 * console.log(labelFor('skipped-exists')); // "⚠️ skipped (exists)"
 * ```
 */
export function labelFor(result: 'created' | 'overwritten' | 'skipped-exists' | 'dry-run'): string {
  switch (result) {
    case 'created':
      return '✅ created';
    case 'overwritten':
      return '♻️ overwritten';
    case 'skipped-exists':
      return '⚠️ skipped (exists)';
    case 'dry-run':
      return '📝 (dry-run)';
    default:
      // This should never happen since result is a union type
      return '';
  }
}

/**
 * Ensure that a directory exists, creating parent directories if necessary.
 *
 * Skips filesystem writes in dry-run mode.
 *
 * @param dir - Absolute or relative path to the directory.
 * @param dryRun - If true, no filesystem changes are made.
 */
export async function ensureDir(dir: string, dryRun: boolean): Promise<void> {
  if (!dryRun) await fsp.mkdir(dir, { recursive: true });
}

/**
 * Heuristic check: determine if a file should be treated as binary based on its extension.
 *
 * Combines a default list (`DEFAULT_BINARY_EXTS`) with user-provided `extra` extensions.
 *
 * @param filePath - The file path whose extension is checked.
 * @param extra - Additional extensions (e.g. `["ico", "icns"]`).
 *
 * @returns True if the extension is considered binary, otherwise false.
 */
export function isBinaryFile(filePath: string, extra: string[] = []): boolean {
  const ext = path.extname(filePath).toLowerCase();
  return DEFAULT_BINARY_EXTS.concat(extra).includes(ext);
}

/**
 * Build a runtime token map with derived tokens needed by templates.
 *
 * Guarantees:
 * - All tokens are strings (to keep `replaceTokens` pipeline simple).
 * - `isPci` is normalized to `"true"` or `"false"`.
 *
 * @param src - Source token map (user-provided or partially computed).
 * @returns Complete token map with derived values.
 *
 * @example
 * ```ts
 * buildRuntimeTokens({ appName: "pci-billing" });
 * // {
 * //   appName: "pci-billing",
 * //   isPci: "true"
 * // }
 * ```
 */
export function buildRuntimeTokens(src: Record<string, string>): Record<string, string> {
  const isPci = src.isPci || 'false';
  return {
    ...src,
    isPci,
  };
}

/**
 * Apply filename transformations:
 * - Replace `{{TOKEN}}` placeholders
 * - Convert leading `_` to `.` if dotfile renaming is enabled
 *
 * @param rawName - Original template filename
 * @param tokens - Runtime token map
 * @param opts - Internal options (dotfile renaming toggle)
 *
 * @example
 * ```ts
 * transformName("_gitignore", {}, { enableDotfileRename: true });
 * // ".gitignore"
 * ```
 */
export function transformName(
  rawName: string,
  tokens: Record<string, string>,
  opts: Pick<InternalOptions, 'enableDotfileRename'>,
): string {
  const withTokens = replaceTokens(rawName, tokens);
  if (opts.enableDotfileRename !== false && withTokens.startsWith('_')) {
    return `.${withTokens.slice(1)}`;
  }
  return withTokens;
}

/**
 * Write a file safely with overwrite and dry-run handling.
 *
 * Behavior:
 * - If `dryRun = true`, logs the action and returns `"dry-run"`.
 * - If `overwrite = true`, replaces existing files.
 * - If `overwrite = false` and file exists, returns `"skipped-exists"`.
 *
 * @param filePath - Absolute path to write.
 * @param content - File content as string or Buffer.
 * @param opts - Write options (`dryRun`, `overwrite`).
 *
 * @returns A status string describing the action.
 */
export async function writeFileSafe(
  filePath: string,
  content: string | Buffer,
  { dryRun, overwrite }: { dryRun: boolean; overwrite: boolean },
): Promise<'created' | 'overwritten' | 'skipped-exists' | 'dry-run'> {
  if (dryRun) {
    console.log(`📝 (dry-run) write ${filePath}`);
    return 'dry-run';
  }
  try {
    await fsp.writeFile(filePath, content, { flag: overwrite ? 'w' : 'wx' });
    return overwrite ? 'overwritten' : 'created';
  } catch (err) {
    const e = err as NodeJS.ErrnoException;
    if (e.code === 'EEXIST') return 'skipped-exists';
    throw e;
  }
}

/**
 * Post-processor that unquotes boolean-like tokens in `App.constants.ts`.
 *
 * Example transformation:
 * ```ts
 * isPci: 'true'  →  isPci: true
 * isPci: 'false' →  isPci: false
 * ```
 */
export const booleanUnquoteForAppConstants: PostProcessor = {
  match: (relPath) => relPath.replace(/\\/g, '/').endsWith('src/App.constants.ts'),
  transform: (content) =>
    content
      .replace(/\b(isPci)\s*:\s*'true'\b/g, '$1: true')
      .replace(/\b(isPci)\s*:\s*'false'\b/g, '$1: false'),
};

/**
 * Run a sequence of PostProcessors in order, returning the final content.
 *
 * Each processor can choose to match/transform or skip the file.
 *
 * @param content - Original file content after token replacement
 * @param ctx - File context (absPath, relPath, tokens)
 * @param processors - List of processors to run
 *
 * @returns Final transformed content
 */
export function runPostProcessors(
  content: string,
  ctx: PostProcessorCtx,
  processors: PostProcessor[],
): string {
  let out = content;
  for (const p of processors) {
    if (p.match(ctx.relPath, ctx.absPath)) {
      out = p.transform(out, ctx);
    }
  }
  return out;
}
