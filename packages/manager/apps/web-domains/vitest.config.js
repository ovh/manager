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
      coverage: {
        exclude: [
          ...defaultExcludedFiles,
          'src/pages/layout.tsx',
          'src/**/routes.tsx',
          'src/**/__tests__',
          'src/**/__mocks__',
          'src/**/data/**/*',
          'src/**/hooks/**/*',
          'src/**/types/**/*',
        ],
      },
      setupFiles: 'src/common/setupTests.tsx',
      deps: {
        inline: INLINE_DEPS,
      },
      server: {
        deps: {
          inline: INLINE_DEPS,
        },
      },
      css: false,
    },
    ssr: {
      noExternal: NO_EXTERNAL_DEPS,
    },
    resolve: { dedupe: [...defaultDedupedDependencies],
      alias: {
        '@/public': path.resolve(__dirname, 'public'),
        '@': path.resolve(__dirname, 'src'),
      },
      mainFields: ['module'],
    },
  }),
);
