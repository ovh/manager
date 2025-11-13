import { forgeGenerateCli } from '@/helpers/manager-forge-generation-helper.js';

/**
 * CLI for generating hooks inside an app.
 * Usage: yarn generate:uapp:hook --app "appName" --hook "useSomething"
 */
export function forgeHookCli(argv: string[]) {
  forgeGenerateCli(argv, {
    type: 'hook',
    argKey: 'hook',
    folder: 'hooks',
    extension: '.ts',
    caseStyle: 'PASCAL_CASE',
  });
}
