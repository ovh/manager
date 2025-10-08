#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import https from 'node:https';
import { createGunzip } from 'node:zlib';
import tar from 'tar-stream';

import { EMOJIS, MUK_COMPONENTS_SRC, ODS_REACT_LATEST_URL } from '../config/muk-config.js';
import { logger } from '../utils/log-manager.js';

/**
 * Get list of local muk-components component names.
 * @returns {Promise<string[]>}
 */
async function getLocalComponents() {
  const entries = await fs.readdir(MUK_COMPONENTS_SRC, { withFileTypes: true });
  const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);
  logger.info(`${EMOJIS.folder} Found ${dirs.length} local components`);
  return dirs;
}

/**
 * Get tarball URL for the latest ods-react package.
 * @returns {Promise<string>} tarball URL
 */
async function getOdsTarballUrl() {
  return new Promise((resolve, reject) => {
    https
      .get(ODS_REACT_LATEST_URL, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            resolve(json.dist.tarball);
          } catch (err) {
            reject(err);
          }
        });
      })
      .on('error', reject);
  });
}

/**
 * Fetch and extract ODS React components from npm tarball.
 * @returns {Promise<string[]>}
 */
async function getRemoteOdsComponents() {
  const tarballUrl = await getOdsTarballUrl();
  logger.info(`${EMOJIS.package} Fetching ODS React tarball: ${tarballUrl}`);

  return new Promise((resolve, reject) => {
    const extract = tar.extract();
    const gunzip = createGunzip();
    const components = new Set();

    extract.on('entry', (header, stream, next) => {
      const match = header.name.match(/src\/components\/([^/]+)\//);
      if (match) components.add(match[1]);
      stream.on('end', next);
      stream.resume();
    });

    extract.on('finish', () => resolve([...components].sort()));
    https.get(tarballUrl, (res) => res.pipe(gunzip).pipe(extract)).on('error', reject);
  });
}

/**
 * Main command logic: compare ODS and local components.
 */
export async function checkComponents() {
  logger.info(`${EMOJIS.info} Checking component parity between ODS and Manager...`);

  const [local, remote] = await Promise.all([getLocalComponents(), getRemoteOdsComponents()]);

  const missing = remote.filter((r) => !local.includes(r));
  const extra = local.filter((l) => !remote.includes(l));

  logger.info(`ℹ Remote count: ${remote.length}, Local count: ${local.length}`);

  if (missing.length === 0) {
    logger.success('✅ All ODS components exist locally.');
  } else {
    logger.warn(`⚠ Missing ${missing.length} ODS components:`);
    missing.forEach((c) => logger.info(`• ${c}`));
  }

  if (extra.length > 0) {
    logger.debug(`Local-only components (${extra.length}): ${extra.join(', ')}`);
  }

  return { missing, extra };
}
