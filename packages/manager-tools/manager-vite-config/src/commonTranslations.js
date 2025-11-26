import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'path';

export function getCommonTranslations() {
  const require = createRequire(import.meta.url);
  let packageJson;
  try {
    packageJson = JSON.parse(fs.readFileSync(`${process.cwd()}/package.json`, 'utf8'));
  } catch {
    packageJson = {};
  }
  const COMMON_TRANSLATIONS_PACKAGE = '@ovh-ux/manager-common-translations';
  const viteStaticPluginTargets = [];
  if (packageJson?.dependencies[COMMON_TRANSLATIONS_PACKAGE]) {
    viteStaticPluginTargets.push({
      src: `${path.dirname(require.resolve(COMMON_TRANSLATIONS_PACKAGE))}/@ovh-ux`,
      dest: `translations`,
    });
  }
  return viteStaticPluginTargets;
}
