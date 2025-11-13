import { HELP_API } from '@/configs/manager-forge-config.js';
import { runForgeCli } from '@/helpers/manager-forge-cli-helper.js';
import { forgeGenerateCli } from '@/helpers/manager-forge-generation-helper.js';

/**
 * CLI for generating API files inside an app.
 * Usage: yarn generate:uapp:api --app "appName" --api "ApiName"
 */
export function forgeApiCli(argv: string[] = process.argv.slice(2)) {
  return runForgeCli(
    () =>
      forgeGenerateCli(argv, {
        type: 'api',
        argKey: 'api',
        folder: 'data',
        extension: '.api.ts',
        caseStyle: 'PASCAL_CASE',
      }),
    {
      clearScreen: false,
      showBanner: false,
      showSpinner: false,
    },
    HELP_API,
  );
}
