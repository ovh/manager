import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  INLINE_DEPS,
  NO_EXTERNAL_DEPS,
  createConfig,
  defaultDedupedDependencies,
  defaultExcludedFiles,
  mergeConfig,
  sharedConfig,
  stubStylesPlugin,
} from '@ovh-ux/manager-tests-setup';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default mergeConfig(
  sharedConfig,
  createConfig({
    plugins: [...(sharedConfig.plugins ?? []), stubStylesPlugin()],
    test: {
      setupFiles: ['src/utils/test.setup.tsx'],
      deps: {
        inline: INLINE_DEPS,
      },
      server: {
        deps: {
          inline: INLINE_DEPS,
        },
      },
      coverage: {
        exclude: [
          ...defaultExcludedFiles,
          // App-specific exclusions (not in shared config):
          'src/data/api',
          'src/zimbra.config.ts',
          'src/hooks/index.ts',
          'src/routes/routes.tsx',
          'src/utils/index.ts',
        ],
      },
    },
    ssr: {
      noExternal: NO_EXTERNAL_DEPS,
    },
    resolve: {
      dedupe: [...defaultDedupedDependencies],
      alias: {
        '@/public': path.resolve(__dirname, 'public'),
        '@': path.resolve(__dirname, 'src'),
      },
    },
  }),
);
