import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';

import { defineConfig } from 'vite';

import { getBaseConfig } from '@ovh-ux/manager-vite-config';

const require = createRequire(import.meta.url);

const BACKUP_LICENSES_PACKAGE = '@ovh-ux/backup-licenses';
const backupLicensesRoot = dirname(require.resolve(`${BACKUP_LICENSES_PACKAGE}/package.json`));

// Les cibles passent par getBaseConfig : une seconde instance de viteStaticCopy
// verrait son middleware rester derrière le fallback SPA de Vite, qui répond
// index.html pour les Messages_*.json (i18next n'affiche alors que les clés).
const baseConfig = getBaseConfig({
  staticCopyTargets: [
    {
      src: `${backupLicensesRoot}/public/translations/*`,
      dest: `translations/module-backup-licenses`,
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
