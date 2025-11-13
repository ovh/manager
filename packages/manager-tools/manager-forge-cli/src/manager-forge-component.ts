import { HELP_COMPONENT } from '@/configs/manager-forge-config.js';
import { runForgeCli } from '@/helpers/manager-forge-cli-helper.js';
import { forgeGenerateCli } from '@/helpers/manager-forge-generation-helper.js';

/**
 * CLI for generating components inside an app.
 * Usage: yarn generate:uapp:component --app "appName" --component "ComponentName"
 */
export function forgeComponentCli(argv: string[] = process.argv.slice(2)) {
  return runForgeCli(
    () =>
      forgeGenerateCli(argv, {
        type: 'component',
        argKey: 'component',
        folder: 'components',
        extension: '.component.tsx',
        caseStyle: 'PASCAL_CASE',
      }),
    {
      clearScreen: false,
      showBanner: false,
      showSpinner: false,
    },
    HELP_COMPONENT,
  );
}
