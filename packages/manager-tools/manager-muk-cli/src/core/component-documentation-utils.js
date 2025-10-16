import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { pipeline } from 'node:stream/promises';

import {
  EMOJIS,
  MUK_WIKI_BASED_DOCUMENT,
  MUK_WIKI_COMPONENTS,
  ODS_REACT_PACKAGE_NAME,
  ODS_TAR_COMPONENTS_PATH,
  ODS_TAR_STORYBOOK_PATH,
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

/**
 * Determines whether a tar entry corresponds to Storybook source files
 * under `packages/storybook/src/{components,constants,helpers}`.
 *
 * @param {string} tarPath
 * @returns {boolean}
 */
function isStorybookBaseDocEntry(tarPath) {
  const normalized = tarPath.replaceAll('\\', '/');
  return /packages\/storybook\/src\/(components|constants|helpers)\//.test(normalized);
}

/**
 * Maps a tar entry path under `packages/storybook/src/`
 * to the Manager Wiki base-documents directory.
 *
 * Example:
 *   design-system-19.2.1/packages/storybook/src/helpers/date/formatDate.ts
 * → packages/manager-wiki/stories/manager-ui-kit/base-documents/helpers/date/formatDate.ts
 */
function mapStorybookPathToWiki(tarPath) {
  const normalized = tarPath.replaceAll('\\', '/');
  const marker = ODS_TAR_STORYBOOK_PATH;
  const idx = normalized.indexOf(marker);

  if (idx === -1) {
    logger.warn(`${EMOJIS.warn} Unexpected tar path: ${tarPath}`);
    return path.join(MUK_WIKI_BASED_DOCUMENT, path.basename(tarPath));
  }

  const rel = normalized.substring(idx + marker.length);
  return path.join(MUK_WIKI_BASED_DOCUMENT, rel);
}

/**
 * Writes a streamed Storybook file from the tarball to disk.
 * Creates all required directories if they do not exist.
 *
 * @async
 * @param {string} tarPath - Path of the file in the tar archive.
 * @param {ReadableStream} fileStream - The stream for the tar entry.
 * @returns {Promise<{created:number, updated:number}>} Statistics on the write operation.
 */
async function writeStorybookFile(tarPath, fileStream) {
  const target = mapStorybookPathToWiki(tarPath);
  await ensureDir(path.dirname(target));
  try {
    await pipeline(fileStream, fs.createWriteStream(target));
    logger.debug(`${EMOJIS.disk} ${path.relative(process.cwd(), target)}`);
    return { created: 1, updated: 0 };
  } catch (err) {
    logger.error(`${EMOJIS.error} Failed to write ${target}: ${err.message}`);
    return { created: 0, updated: 0 };
  }
}

/**
 * Ensures that all base Storybook folders exist in the wiki output,
 * even if the tarball doesn’t contain any file for them.
 *
 * This prevents missing directories like "helpers" or "constants"
 * when they have no eligible files or only subfolders.
 *
 * @param {string} baseDir - The base wiki directory (MUK_WIKI_BASED_DOCUMENT).
 */
function ensureBaseStorybookFolders(baseDir) {
  const directories = ['components', 'constants', 'helpers'];
  for (const directory of directories) {
    const target = path.join(baseDir, directory);
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target, { recursive: true });
      logger.info(
        `${EMOJIS.folder} Created base Storybook folder: ${path.relative(process.cwd(), target)}`,
      );
    }
  }
}

/**
 * Synchronizes all Storybook base documents from the ODS tarball into
 * the Manager Wiki. This includes every file located under:
 *
 * - packages/storybook/src/components/
 * - packages/storybook/src/constants/
 * - packages/storybook/src/helpers/
 *
 * @async
 * @param {Object} [options] - Optional configuration.
 * @param {string} [options.tag] - Specific ODS release tag to download. Defaults to latest.
 * @returns {Promise<{created:number, updated:number, total:number}>}
 * Count of streamed and written files.
 *
 * @example
 * await syncStorybookBaseDocuments({ tag: '19.2.1' })
 * // → { created: 53, updated: 0, total: 53 }
 */
export async function syncStorybookBaseDocuments({ tag } = {}) {
  let created = 0;
  let updated = 0;
  let total = 0;

  // 🗂 Ensure base folders exist even if empty
  ensureBaseStorybookFolders(MUK_WIKI_BASED_DOCUMENT);

  await extractDesignSystemDocs({
    tag,
    filter: isStorybookBaseDocEntry,
    onFileStream: async (tarPath, fileStream) => {
      const res = await writeStorybookFile(tarPath, fileStream);
      created += res.created;
      updated += res.updated;
      total += 1;
    },
  });

  return { created, updated, total };
}
