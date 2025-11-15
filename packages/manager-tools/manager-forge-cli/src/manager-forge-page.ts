import { forgeGenerateCli } from '@/helpers/manager-forge-generation-helper.js';

/**
 * CLI for generating page files inside an app.
 * Usage: yarn generate:uapp:page --app "appName" --page "Dashboard"
 */
export function forgePageCli(argv: string[]) {
  forgeGenerateCli(argv, {
    type: 'page',
    argKey: 'page',
    folder: 'pages',
    extension: '.page.tsx',
    caseStyle: 'PASCAL_CASE',
  });
}
