import { promises as fsp } from 'node:fs';
import path from 'node:path';

import { assertNoUnresolvedTokens, replaceTokens } from '../tokens/tokens-helper';
import { ApplyTemplatesOptions, InternalOptions, PostProcessorCtx } from '../types/template-types';
import {
  booleanUnquoteForAppConstants,
  buildRuntimeTokens,
  ensureDir,
  isBinaryFile,
  labelFor,
  runPostProcessors,
  transformName,
  writeFileSafe,
} from './generate-template-helper';

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
  const postProcessors = (options as InternalOptions).postProcessors ?? [];

  // compute derived tokens (isPci) once up front
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
        tokens: runtimeTokens, // propagate derived tokens
        dryRun,
        overwrite,
        ...(postProcessors.length ? { postProcessors } : {}),
      } as InternalOptions);
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

      // Check unresolved tokens in both content and path (only on real runs)
      if (!dryRun) {
        assertNoUnresolvedTokens(dst, replaced);
        assertNoUnresolvedTokens(dst, transformedName);
      }

      // run post-processors (built-in + user-supplied)
      const ctx: PostProcessorCtx = {
        absPath: dst,
        relPath: transformedName,
        tokens: runtimeTokens,
      };
      const processors = [booleanUnquoteForAppConstants, ...postProcessors];
      const finalContent = runPostProcessors(replaced, ctx, processors);

      const result = await writeFileSafe(dst, finalContent, { dryRun, overwrite });

      if (
        dst.endsWith('README.md') ||
        dst.endsWith('App.constants.ts') ||
        dst.endsWith('package.json')
      ) {
        console.log(`\n--- ${dst} ---\n${finalContent}\n--- end of ${dst} ---\n`);
      }

      console.log(`${labelFor(result)}: ${dst}`);
    }
  }
}
