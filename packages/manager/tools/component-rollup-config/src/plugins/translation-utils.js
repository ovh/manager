const concat = require('lodash/concat');
const fs = require('fs');
const path = require('path');

const ALL_LANGUAGES = process.env.OVH_BUILD_LANGUAGES
  ? process.env.OVH_BUILD_LANGUAGES.split(',')
  : ['de_DE', 'en_GB', 'es_ES', 'fr_CA', 'fr_FR', 'it_IT', 'pl_PL', 'pt_PT'];

const injectTranslationImport = (languages, trads, id, subdirectory) => {
  let result = '';
  trads.forEach((trad) => {
    const currentPath = path.dirname(id);
    const absolutePath = path.resolve(currentPath, trad, subdirectory);
    const relativePath = path.relative(currentPath, absolutePath);
    if (fs.existsSync(absolutePath)) {
      result += `
      requests.push(() =>
        $q.all({
          use: import('./${relativePath}/Messages_' + $translate.use() + '.json')
            .then((module) => module.default || module)
            .catch(() => ({})),
          fallback: import('./${relativePath}/Messages_' + $translate.fallbackLanguage() + '.json')
            .then((module) => module.default || module)
            .catch(() => ({})),
        }).then((result) => Object.assign(result.fallback, result.use))
      );`;
    }
  });
  return result;
};

const injectTranslationImports = (languages, trads, id, subdirectory) => `
  let requests = [];
  ${injectTranslationImport(languages, trads, id, subdirectory)}
  const promise = requests.map((request) => asyncLoader.registerTranslationsRequest(request));
  return $q.all(promise).then(() => $translate.refresh());
`;

module.exports = {
  injectTranslationImports,
  languages: concat(ALL_LANGUAGES),
};
