import { forgeGenerateCli } from '@/helpers/manager-forge-generation-helper.js';

/**
 * CLI for generating API files inside an app.
 * Usage: yarn generate:uapp:api --app "appName" --api "ApiName"
 */
export function forgeApiCli(argv: string[]) {
  forgeGenerateCli(argv, {
    type: 'api',
    argKey: 'api',
    folder: 'data',
    extension: '.api.ts',
    caseStyle: 'PASCAL_CASE',
  });
}
