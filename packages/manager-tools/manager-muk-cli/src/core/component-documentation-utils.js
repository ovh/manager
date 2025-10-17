import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { pipeline } from 'node:stream/promises';

import {
  EMOJIS,
  MUK_WIKI_COMPONENTS,
  ODS_REACT_PACKAGE_NAME,
  ODS_TAR_COMPONENTS_PATH,
} from '../config/muk-config.js';
import { logger } from '../utils/log-manager.js';
import { ensureDir } from './file-utils.js';
import { fetchLatestVersion } from './npm-utils.js';
import {
  extractComponentDocumentationInfos,
  extractDesignSystemDocs,
} from './ods-documentation-tarball-utils.js';
import { createAsyncQueue } from './tasks-utils.js';

/**
 * Prepares target directories for a component’s base documentation.
 *
 * **Behavior:**
 * - If the component folder does not exist → create it.
 * - If the `base-component-doc` folder already exists → delete its contents.
 * - Always ensure the final directory structure exists before streaming files.
 *
 * **Why:**
 * Each synchronization cycle must start from a clean baseline
 * to avoid stale or conflicting documentation files.
 *
 * @param {string} componentDir - Absolute path to the component directory.
 * @param {string} baseDocDir - Absolute path to the `base-component-doc` folder.
 */
function prepareComponentDocumentationDir(componentDir, baseDocDir) {
  if (fs.existsSync(baseDocDir)) {
    fs.rmSync(baseDocDir, { recursive: true, force: true });
  } else if (!fs.existsSync(componentDir)) {
    ensureDir(componentDir);
  }
  ensureDir(baseDocDir);
}

/**
 * Initialize or refresh a component documentation directory.
 *
 * Handles three cases:
 * - Component folder does not exist → create new folder and base-doc.
 * - Component folder exists → clean and reinitialize base-doc.
 * - Always ensures base-doc directory exists before file writes.
 *
 * @param {string} component - Component name.
 * @returns {{componentDir: string, baseDocDir: string, isNew: boolean, isUpdated: boolean}}
 */
function initializeComponentDocs(component) {
  const componentDir = path.join(MUK_WIKI_COMPONENTS, component);
  const baseDocDir = path.join(componentDir, 'base-component-doc');
  const exists = fs.existsSync(componentDir);

  if (exists) {
    logger.info(`${EMOJIS.folder} Found existing component: '${component}'`);
  } else {
    logger.info(`${EMOJIS.folder} Creating new component directory: '${component}'`);
  }

  prepareComponentDocumentationDir(componentDir, baseDocDir);

  if (exists) {
    logger.info(`${EMOJIS.disk} Cleared and ready: ${path.relative(process.cwd(), baseDocDir)}`);
  } else {
    logger.info(`${EMOJIS.rocket} Initialized new base-doc folder for '${component}'`);
  }

  return {
    componentDir,
    baseDocDir,
    isNew: !exists,
    isUpdated: exists,
  };
}

/**
 * Stream a single documentation file to disk.
 *
 * Handles subdirectory creation, error handling, and logging.
 *
 * @param {import('node:stream').Readable} stream - The file stream.
 * @param {string} baseDocDir - Base documentation directory for the component.
 * @param {string} relPath - Relative path of the file within the component.
 */
async function writeComponentDocFile(stream, baseDocDir, relPath) {
  const destFile = path.join(baseDocDir, relPath);
  const subDir = path.dirname(destFile);

  ensureDir(subDir);

  const relativeTarget = path.relative(process.cwd(), destFile);
  logger.info(`${EMOJIS.disk} Writing file → ${relativeTarget}`);

  try {
    await pipeline(stream, fs.createWriteStream(destFile));
  } catch (err) {
    logger.error(`${EMOJIS.error} Failed to write ${relativeTarget}: ${err.message}`);
  }
}

/**
 * Stream extracted documentation files to disk directly as they are read
 * from the ODS Design System tarball.
 *
 * This function orchestrates:
 * 1️⃣ Parsing tar paths → (component, relPath)
 * 2️⃣ Initializing per-component folders (once)
 * 3️⃣ Writing documentation files via streaming
 *
 * @param {AsyncGenerator<{tarPath: string, stream: import('node:stream').Readable}>} fileStreamGenerator
 * @returns {Promise<{created: number, updated: number, total: number}>}
 */
async function streamComponentDocs(fileStreamGenerator) {
  const initializedComponents = new Set();
  let created = 0;
  let updated = 0;
  let total = 0;

  logger.info(`${EMOJIS.info} Starting component documentation sync (streaming mode)…`);

  for await (const { tarPath, stream } of fileStreamGenerator) {
    const { component, relPath } = extractComponentDocumentationInfos(tarPath);
    if (!component || !relPath) {
      logger.debug?.(`Skipping unrelated entry: ${tarPath}`);
      continue;
    }

    let baseDocDir;

    // Initialize directories once per component
    if (!initializedComponents.has(component)) {
      const { baseDocDir: docDir, isNew, isUpdated } = initializeComponentDocs(component);
      initializedComponents.add(component);
      baseDocDir = docDir;

      if (isNew) created++;
      if (isUpdated) updated++;
    } else {
      baseDocDir = path.join(MUK_WIKI_COMPONENTS, component, 'base-component-doc');
    }

    // Stream file into local folder
    await writeComponentDocFile(stream, baseDocDir, relPath);
    total++;
  }

  logger.success(
    `${EMOJIS.check} Completed streaming sync — created: ${created}, updated: ${updated}, files written: ${total}`,
  );

  return { created, updated, total };
}

/**
 * Filter ODS tarball entries to include only component documentation files.
 *
 * Matches files under the Design System's component documentation path, such as:
 *  - documentation.mdx
 *  - technical-information.mdx
 *  - .stories.tsx (storybook files)
 *
 * @param {string} filePath - Full path of a tarball entry.
 * @returns {boolean} True if the entry should be processed.
 */
function isOdsComponentDocEntry(filePath) {
  return (
    filePath.includes(ODS_TAR_COMPONENTS_PATH) &&
    (filePath.endsWith('.mdx') || filePath.endsWith('.md') || filePath.endsWith('.stories.tsx'))
  );
}

/**
 * Synchronize all ODS component documentation files.
 * Streams entries from GitHub tarball (or cache) into wiki component directories.
 *
 * Uses a streaming producer–consumer pipeline:
 * - Producer → extractDesignSystemDocs (streams tar entries)
 * - Queue → createAsyncQueue (handles backpressure)
 * - Consumer → streamComponentDocs (writes files to disk)
 *
 * @async
 * @returns {Promise<{created: number, updated: number, total: number}>}
 */
export async function syncComponentDocs() {
  const queue = createAsyncQueue();

  // 🧩 Producer: fetch latest ODS React version
  const latestVersion = await fetchLatestVersion(ODS_REACT_PACKAGE_NAME);
  logger.info(`${EMOJIS.info} ODS React latest version: ${latestVersion}`);

  await (async () => {
    await extractDesignSystemDocs({
      tag: latestVersion,
      filter: isOdsComponentDocEntry,
      onFileStream: async (tarPath, fileStream) => {
        await queue.push({ tarPath, stream: fileStream });
      },
    });
    queue.end(); // Signal the end of production
  })();

  // 💾 Consumer: write streamed documentation files
  return streamComponentDocs(queue);
}
