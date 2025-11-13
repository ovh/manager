import { HELP_HOOK } from '@/configs/manager-forge-config.js';
import { runForgeCli } from '@/helpers/manager-forge-cli-helper.js';
import { forgeGenerateCli } from '@/helpers/manager-forge-generation-helper.js';

/**
 * CLI for generating hooks inside an app.
 * Usage: yarn generate:uapp:hook --app "appName" --hook "useSomething"
 */
export function forgeHookCli(argv: string[] = process.argv.slice(2)) {
  return runForgeCli(
    () =>
      forgeGenerateCli(argv, {
        type: 'hook',
        argKey: 'hook',
        folder: 'hooks',
        extension: '.ts',
        caseStyle: 'PASCAL_CASE',
      }),
    {
      clearScreen: false,
      showBanner: false,
      showSpinner: false,
    },
    HELP_HOOK,
  );
}
