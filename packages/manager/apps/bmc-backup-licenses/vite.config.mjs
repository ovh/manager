import { defineConfig } from 'vite';
import { resolve, dirname } from 'node:path';
import { getBaseConfig } from '@ovh-ux/manager-vite-config';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const BACKUP_LICENSES_PACKAGE = '@ovh-ux/backup-licenses';
const backupLicensesRoot = dirname(require.resolve(`${BACKUP_LICENSES_PACKAGE}/package.json`));

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
  resolve: {
    ...baseConfig.resolve,
    dedupe: [
      ...baseConfig.resolve.dedupe,
      'react-hook-form'
    ],
  },
});
