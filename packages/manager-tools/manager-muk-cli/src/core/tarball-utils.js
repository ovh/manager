import { Buffer } from 'node:buffer';
import https from 'node:https';
import { createGunzip } from 'node:zlib';
import tar from 'tar-stream';

/**
 * Stream and extract a remote `.tar.gz` file, calling a handler for each matched file.
 * Handles redirects transparently.
 *
 * @param {string} url - Remote tarball URL.
 * @param {(entryPath: string) => boolean} filter - Predicate selecting entries to extract.
 * @param {(entryPath: string, content: Buffer) => Promise<void>} onFile - Async handler for file contents.
 * @returns {Promise<void>} Resolves when extraction completes.
 */
export async function streamTarGz(url, filter, onFile) {
  await new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': 'manager-muk-cli' } }, (res) => {
        // Handle HTTP redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          res.resume();
          streamTarGz(res.headers.location, filter, onFile).then(resolve).catch(reject);
          return;
        }

        if (res.statusCode !== 200) {
          reject(new Error(`Download failed: ${res.statusCode}`));
          return;
        }

        const gunzip = createGunzip();
        const extract = tar.extract();

        extract.on('entry', (header, stream, next) => {
          const entryPath = header.name;
          if (header.type === 'file' && filter(entryPath)) {
            const chunks = [];
            stream.on('data', (c) => chunks.push(c));
            stream.on('end', async () => {
              try {
                await onFile(entryPath, Buffer.concat(chunks));
                next();
              } catch (e) {
                reject(e);
              }
            });
          } else {
            stream.resume();
            stream.on('end', next);
          }
        });

        extract.on('finish', resolve);
        extract.on('error', reject);
        gunzip.on('error', reject);

        res.pipe(gunzip).pipe(extract);
      })
      .on('error', reject);
  });
}
