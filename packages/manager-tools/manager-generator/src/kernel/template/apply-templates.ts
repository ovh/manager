import { promises as fsp } from 'node:fs';
import path from 'node:path';

import { DEFAULT_BINARY_EXTS } from '../config/kernel-constants';
import { derivePkgName } from '../prompts/prompts-helper';
import { assertNoUnresolvedTokens, replaceTokens } from '../tokens/tokens-helper';
import { ApplyTemplatesOptions, InternalOptions } from '../types/template-types';

/**
 * Convert a file operation result status into a human-readable label with an emoji indicator.
 *
 * @param result - 'created' | 'overwritten' | 'skipped-exists' | 'dry-run'
 */
function labelFor(result: 'created' | 'overwritten' | 'skipped-exists' | 'dry-run'): string {
  return result === 'created'
    ? '✅ created'
    : result === 'overwritten'
      ? '♻️ overwritten'
      : result === 'skipped-exists'
        ? '⚠️ skipped (exists)'
        : '📝 (dry-run)';
}

/** Ensure dir exists unless dry-run. */
async function ensureDir(dir: string, dryRun: boolean): Promise<void> {
  if (!dryRun) await fsp.mkdir(dir, { recursive: true });
}

/** Best-effort “is binary” by extension. */
function isBinaryFile(filePath: string, extra: string[] = []): boolean {
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
function buildRuntimeTokens(src: Record<string, string>): Record<string, string> {
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
function transformName(
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

/** Write file with overwrite/dry-run handling. */
async function writeFileSafe(
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
 * Recursively copy template tree to target with token replacement in:
 * - file contents (text files) and
 * - file/folder names,
 * plus dotfile renaming and safety checks.
 */
// eslint-disable-next-line max-lines-per-function
export async function applyTemplates(options: ApplyTemplatesOptions): Promise<void> {
  const {
    templateDir,
    targetDir,
    tokens,
    dryRun = false,
    overwrite = false,
  } = options as InternalOptions;

  const ignore = (options as InternalOptions).ignore ?? [];
  const enableDotfileRename = (options as InternalOptions).enableDotfileRename ?? true;
  const binaryExtensions = (options as InternalOptions).binaryExtensions ?? [];

  // 🔧 NEW: compute derived tokens (packageNameResolved, isPci) once up front
  const runtimeTokens = buildRuntimeTokens(tokens);

  // Read & sort entries for deterministic output
  const entries = (await fsp.readdir(templateDir, { withFileTypes: true })).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  await ensureDir(targetDir, dryRun);

  for (const entry of entries) {
    if (ignore.includes(entry.name)) continue;

    const src = path.join(templateDir, entry.name);

    // Replace tokens and apply dotfile rename in the path segment itself
    const transformedName = transformName(entry.name, runtimeTokens, { enableDotfileRename });
    const dst = path.join(targetDir, transformedName);

    if (entry.isDirectory()) {
      console.log(dryRun ? `📁 (dry-run) mkdir ${dst}` : `📁 mkdir ${dst}`);
      await ensureDir(dst, dryRun);
      await applyTemplates({
        templateDir: src,
        targetDir: dst,
        tokens: runtimeTokens, // <<< propagate derived tokens
        dryRun,
        overwrite,
      });
      continue;
    }

    if (entry.isFile()) {
      const treatAsBinary = isBinaryFile(src, binaryExtensions);

      if (treatAsBinary) {
        const buf = await fsp.readFile(src);
        const result = await writeFileSafe(dst, buf, { dryRun, overwrite });
        console.log(`${labelFor(result)}: ${dst}`);
        continue;
      }

      const raw = await fsp.readFile(src, 'utf-8');
      const replaced = replaceTokens(raw, runtimeTokens);

      // Check unresolved tokens in both content and path
      if (!dryRun) {
        assertNoUnresolvedTokens(dst, replaced);
        assertNoUnresolvedTokens(dst, transformedName);
      }

      const result = await writeFileSafe(dst, replaced, { dryRun, overwrite });

      if (
        dst.endsWith('README.md') ||
        dst.endsWith('App.constants.ts') ||
        dst.endsWith('package.json')
      ) {
        console.log(`\n--- ${dst} ---\n${replaced}\n--- end of ${dst} ---\n`);
      }

      console.log(`${labelFor(result)}: ${dst}`);
    }
  }
}
