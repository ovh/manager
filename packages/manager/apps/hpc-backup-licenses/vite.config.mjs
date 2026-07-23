import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';

import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

import { getBaseConfig } from '@ovh-ux/manager-vite-config';

const require = createRequire(import.meta.url);
const baseConfig = getBaseConfig();

const BACKUP_LICENSES_PACKAGE = '@ovh-ux/backup-licenses';

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
  plugins: [
    ...baseConfig.plugins,
    viteStaticCopy({
      targets: [
        {
          src: `${dirname(require.resolve(BACKUP_LICENSES_PACKAGE))}/../public/**/*`,
          dest: `translations/module-backup-licenses`,
        },
      ],
    }),
  ],
});
