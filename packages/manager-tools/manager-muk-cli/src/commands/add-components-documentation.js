import fs from 'node:fs';
import path from 'node:path';

import { EMOJIS, MUK_WIKI_COMPONENTS } from '../config/muk-config.js';
import { ensureDir } from '../core/file-utils.js';
import { extractDesignSystemDocs } from '../core/github-tarball-utils.js';
import { logger } from '../utils/log-manager.js';

export async function addComponentsDocumentation() {
  const designSystemMarker = '/packages/storybook/stories/components/';
  fs.rmSync(MUK_WIKI_COMPONENTS, { recursive: true, force: true });
  ensureDir(MUK_WIKI_COMPONENTS);

  let extractedCount = 0;

  await extractDesignSystemDocs({
    filter: (entryPath) => entryPath.includes(designSystemMarker),
    async onFile(entryPath, fileContent) {
      const relativePath = entryPath.slice(
        entryPath.indexOf(designSystemMarker) + designSystemMarker.length,
      );
      const targetPath = path.join(MUK_WIKI_COMPONENTS, relativePath);
      ensureDir(path.dirname(targetPath));
      fs.writeFileSync(targetPath, fileContent);
      extractedCount++;
    },
  });

  logger.success(
    `${EMOJIS.check} Copied ${extractedCount} documentation files to ${MUK_WIKI_COMPONENTS}`,
  );
}
