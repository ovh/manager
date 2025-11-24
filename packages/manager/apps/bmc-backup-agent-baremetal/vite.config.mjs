import { defineConfig } from 'vite';
import { resolve, dirname } from 'node:path';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { getBaseConfig } from '@ovh-ux/manager-vite-config';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const baseConfig = getBaseConfig()
const BACKUP_AGENT_PACKAGE = '@ovh-ux/backup-agent';

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
  plugins: [
    ...baseConfig.plugins,
    viteStaticCopy({
      targets: [{
        src: `${dirname(require.resolve(BACKUP_AGENT_PACKAGE))}/../public/**/*`,
        dest: `translations/module-backup-agent`,
      }],
    }),
  ]
});
