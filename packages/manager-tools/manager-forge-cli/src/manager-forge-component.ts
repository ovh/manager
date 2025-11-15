import { forgeGenerateCli } from '@/helpers/manager-forge-generation-helper.js';

/**
 * CLI for generating components inside an app.
 * Usage: yarn generate:uapp:component --app "appName" --component "ComponentName"
 */
export function forgeComponentCli(argv: string[]) {
  forgeGenerateCli(argv, {
    type: 'component',
    argKey: 'component',
    folder: 'components',
    extension: '.component.tsx',
    caseStyle: 'PASCAL_CASE',
  });
}
