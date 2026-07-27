import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';

import { defineConfig } from 'vite';

import { getBaseConfig } from '@ovh-ux/manager-vite-config';

const require = createRequire(import.meta.url);

const BACKUP_LICENSES_PACKAGE = '@ovh-ux/backup-licenses';
const BACKUP_LICENSES_PUBLIC_DIR = resolve(
  dirname(require.resolve(BACKUP_LICENSES_PACKAGE)),
  '../public',
);

// Les traductions du module doivent passer par `staticCopyTargets` : une seconde
// instance de `viteStaticCopy()` verrait son middleware rester en fin de pile
// (derrière le fallback HTML de Vite), et les namespaces `module-backup-licenses/*`
// renverraient index.html au lieu du JSON.
const baseConfig = getBaseConfig({
  staticCopyTargets: [
    {
      src: `${BACKUP_LICENSES_PUBLIC_DIR}/translations/*`,
      dest: 'translations/module-backup-licenses',
    },
  ],
});

export default defineConfig({
  ...baseConfig,
  root: resolve(process.cwd()),
  server: {
    ...baseConfig.server,
    watch: {
      ...baseConfig.server?.watch,
      // Évite l'erreur ENOSPC (limite inotify) : inutile de surveiller les
      // dépendances et les artefacts de build dans ce monorepo.
      ignored: ['**/node_modules/**', '**/dist/**'],
    },
  },
});
