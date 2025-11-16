import {
  assertNonEmpty,
  forgeGenerateCli,
  normalizeHookName,
  parseArgs,
} from '@/helpers/manager-forge-generation-helper.js';

/**
 * CLI for generating hooks inside an app.
 * Usage: yarn generate:uapp:hook --app "appName" --hook "useSomething"
 */
export function forgeHookCli(argv: string[]) {
  const parsedArgs = parseArgs(argv);
  let rawHookName = parsedArgs.hook;

  assertNonEmpty(rawHookName, '--hook');

  // Normalize hook name BEFORE generation
  const normalized = normalizeHookName(rawHookName);

  // Override the arg with the normalized version
  parsedArgs.hook = normalized;

  // Now call the generic generator
  forgeGenerateCli(['--app', parsedArgs.app ?? '', '--hook', normalized], {
    type: 'hook',
    argKey: 'hook',
    folder: 'hooks',
    extension: '.ts',
    caseStyle: undefined,
  });
}
