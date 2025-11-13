import { HELP_PAGE } from '@/configs/manager-forge-config.js';
import { runForgeCli } from '@/helpers/manager-forge-cli-helper.js';
import { forgeGenerateCli } from '@/helpers/manager-forge-generation-helper.js';

/**
 * CLI for generating page files inside an app.
 * Usage: yarn generate:uapp:page --app "appName" --page "Dashboard"
 */
export function forgePageCli(argv: string[] = process.argv.slice(2)) {
  return runForgeCli(
    () =>
      forgeGenerateCli(argv, {
        type: 'page',
        argKey: 'page',
        folder: 'pages',
        extension: '.page.tsx',
        caseStyle: 'PASCAL_CASE',
      }),
    {
      clearScreen: false,
      showBanner: false,
      showSpinner: false,
    },
    HELP_PAGE,
  );
}
