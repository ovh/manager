/**
 * @file template-utils.ts
 * @description Small utilities shared by the template application pipeline.
 */
import { promises as fsp } from 'node:fs';
import path from 'node:path';

import { derivePkgName } from '../../prompts/prompts-helper';
import { replaceTokens } from '../../tokens/tokens-helper';
import { InternalOptions, PostProcessor, PostProcessorCtx } from '../../types/template-types';
import { DEFAULT_BINARY_EXTS } from '../config/kernel-constants';

/**
 * Convert a file operation result status into a human-readable label with an emoji indicator.
 *
 * @param result - 'created' | 'overwritten' | 'skipped-exists' | 'dry-run'
 */
export function labelFor(result: 'created' | 'overwritten' | 'skipped-exists' | 'dry-run'): string {
  return result === 'created'
    ? '✅ created'
    : result === 'overwritten'
      ? '♻️ overwritten'
      : result === 'skipped-exists'
        ? '⚠️ skipped (exists)'
        : '📝 (dry-run)';
}

/** Ensure dir exists unless dry-run. */
export async function ensureDir(dir: string, dryRun: boolean): Promise<void> {
  if (!dryRun) await fsp.mkdir(dir, { recursive: true });
}

/** Best-effort “is binary” by extension. */
export function isBinaryFile(filePath: string, extra: string[] = []): boolean {
  const ext = path.extname(filePath).toLowerCase();
  return DEFAULT_BINARY_EXTS.concat(extra).includes(ext);
}

/**
 * Build a runtime token map that includes derived tokens needed by templates.
 * - `packageNameResolved` is computed from `appName` and optional `packageName`
 * - `isPci` is normalized to a string boolean ('true' | 'false') if absent
 *
 * All tokens are strings to remain compatible with the current replaceTokens pipeline.
 */
export function buildRuntimeTokens(src: Record<string, string>): Record<string, string> {
  const appName = src.appName ?? '';
  const packageName = src.packageName; // may be undefined
  const appType = (src.appType ?? '').toLowerCase();

  const packageNameResolved = src.packageNameResolved ?? derivePkgName(appName, packageName);

  // Keep tokens string-only; templates can safely use {{isPci}} unquoted
  const isPci =
    src.isPci ?? (appType === 'pci' || appName.toLowerCase().startsWith('pci-') ? 'true' : 'false');

  return {
    ...src,
    packageNameResolved,
    isPci,
  };
}

/** Apply filename conventions: tokens + dotfile rename. */
export function transformName(
  rawName: string,
  tokens: Record<string, string>,
  opts: Pick<InternalOptions, 'enableDotfileRename'>,
): string {
  // 1) Replace tokens in the name
  const withTokens = replaceTokens(rawName, tokens);

  // 2) _dotfile → .dotfile (common template publishing trick)
  if (opts.enableDotfileRename !== false && withTokens.startsWith('_')) {
    return `.${withTokens.slice(1)}`;
  }
  return withTokens;
}

/** Write file with overwrite/dry-run handling (emits dry-run log here to keep parity). */
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

/** Unquote boolean-like tokens in App.constants.ts only. */
export const booleanUnquoteForAppConstants: PostProcessor = {
  match: (relPath) => relPath.replace(/\\/g, '/').endsWith('src/App.constants.ts'),
  transform: (content) =>
    content
      .replace(/\b(isPci)\s*:\s*'true'\b/g, '$1: true')
      .replace(/\b(isPci)\s*:\s*'false'\b/g, '$1: false'),
};

/** Compose processors: run in order, returning the final content. */
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
