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
        provider: 'v8',
        exclude: [
          ...defaultExcludedFiles,
          // App-specific exclusions (not in shared config):
          'src/**/**.constant.*',
          'src/routes/*',
          'src/data/api',
          'src/data/__mocks__',
          'src/data/types/*',
          'src/web-hosting.config.ts',
          'src/hooks/index.ts',
          'src/hooks/types.ts',
          'src/pages/404.tsx',
          'src/pages/onboarding/Onboarding.page.tsx',
          'src/pages/layout.tsx',
          'src/pages/dashboard/multisite/domain/ModifyDomainsSteps/types.ts',
          'src/queryClient.ts',
          'src/utils/*.ts',
          'src/utils/*.tsx',
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
