import path from 'path';
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
    // Plugins configuration
    plugins: [...(sharedConfig.plugins ?? []), stubStylesPlugin()],

    test: {
      // Setup file for global test configuration
      setupFiles: ['./src/setupTests.tsx'],

      // Server-side dependency handling
      server: {
        deps: {
          inline: INLINE_DEPS,
        },
      },

      // Coverage configuration
      coverage: {
        exclude: [
          ...defaultExcludedFiles,
          // App-specific exclusions:
          'src/mocks',
          'src/tracking.constant.ts',
          'src/vite-hmr.ts',
          'src/utils/downloadTextAsFile.ts',
        ],
      },
    },

    // SSR configuration - prevents external dependencies from being bundled
    ssr: {
      noExternal: NO_EXTERNAL_DEPS,
    },

    // Module resolution configuration
    resolve: {
      // Prevent duplicate module instances
      dedupe: [...defaultDedupedDependencies],

      // Path alias for cleaner imports
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  }),
);
