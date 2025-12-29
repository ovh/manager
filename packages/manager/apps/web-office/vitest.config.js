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
      environment: 'jsdom',
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
          'src/web-office.config.ts',
          'src/hooks',
          'src/routes/routes.tsx',
          'src/utils/form.ts',
          'src/utils/FormSchemas.utils.ts',
          'src/utils/Test.provider.tsx',
          'src/utils/test.setup.tsx',
          'src/utils/Test.utils.ts',
          '*.constants.ts',
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
