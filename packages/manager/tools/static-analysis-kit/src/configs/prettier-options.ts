import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { cwd } from 'process';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Example: 'xxx/packages/manager/apps/zimbra/tailwind.config.js'
const tailwindConfigPath = resolve(cwd(), 'tailwind.config.js');

// Path: /.../prettier-plugin-tailwindcss/dist/index.mjs
const tailwindPrettierPluginPath = resolve(
  __dirname,
  '../../node_modules/prettier-plugin-tailwindcss/dist/index.mjs',
);

// Path: '/.../@trivago/prettier-plugin-sort-imports/lib/src/index.js'
const trivagoImportSortPluginPath = resolve(
  __dirname,
  '../../node_modules/@trivago/prettier-plugin-sort-imports/lib/src/index.js',
);

export const prettierOptions = {
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  tabWidth: 2,
  arrowParens: 'always',
  endOfLine: 'lf',

  // Use absolute paths for plugins when using with eslint-plugin-prettier
  plugins: [
    tailwindPrettierPluginPath,
    trivagoImportSortPluginPath,
  ],

  // Dynamically resolve the Tailwind config per app
  tailwindConfig: tailwindConfigPath,
  tailwindFunctions: ['clsx', 'tw'],
  tailwindAttributes: ['classList'],

  // Sort imports plugin options
  importOrder: [
    '^react$', // Always put React first
    '^react(-dom|-router-dom)?$', // Other React-related libs
    '<THIRD_PARTY_MODULES>', // External packages (e.g., lodash, i18next)
    '^@ovhcloud/(.*)$', // OVH ODS design system
    '^@ovh-ux/(.*)$', // OVH Manager shared components
    '^@/(.*)$', // App-local aliases
    '^[./]', // Relative imports
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};

export const prettierIgnorePatterns = [
  '**/dist/**',
  '**/custom-elements*/**',
  '**/loader/**',
  '**/react/**',
  '**/vue/**',
  '**/apps/container/**',
  '**/apps/pci-databases-analytics/src/components/ui/**',
  '**/apps/pci-databases-analytics/src/lib/utils.ts',
];
