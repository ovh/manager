const concat = require('lodash/concat');
const fs = require('fs');
const path = require('path');

const ALL_LANGUAGES = process.env.OVH_BUILD_LANGUAGES
  ? process.env.OVH_BUILD_LANGUAGES.split(',')
  : [
      'cs_CZ',
      'de_DE',
      'en_GB',
      'es_ES',
      'es_US',
      'fr_CA',
      'fr_FR',
      'it_IT',
      'lt_LT',
      'pl_PL',
      'pt_PT',
    ];

const injectTranslationImport = (languages, trads, id, subdirectory) => {
  let result = '';
  trads.forEach((trad) => {
    const currentPath = path.dirname(id);
    const absolutePath = path.resolve(currentPath, trad, subdirectory);
    const relativePath = path.relative(currentPath, absolutePath);
    if (fs.existsSync(absolutePath)) {
      result += `
      promises.push(
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
  let promises = [];
  ${injectTranslationImport(languages, trads, id, subdirectory)}
  promises.forEach(p => asyncLoader.addTranslations(p));
  return $q.all(promises).then(() => $translate.refresh());
`;

module.exports = {
  injectTranslationImports,
  languages: concat(ALL_LANGUAGES),
};
