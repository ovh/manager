import concat from 'lodash/concat';
import fs from 'fs';
import path from 'path';
import slash from 'slash';
import startsWith from 'lodash/startsWith';

const ALL_LANGUAGES = [
  'cs_CZ',
  'de_DE',
  'en_GB',
  'es_ES',
  'es_US',
  'fi_FI',
  'fr_CA',
  'fr_FR',
  'it_IT',
  'lt_LT',
  'pl_PL',
  'pt_PT',
];

const normalizePath = p => (startsWith(p, '.') ? slash(p) : `./${slash(p)}`);

const injectFallbackFunction = (languages, trads, id, subdirectory, format) => {
  let code = 'let p = []; switch($translate.fallbackLanguage()) {';
  languages.forEach((lang) => {
    code += `case '${lang}':`;
    trads.forEach((trad) => {
      const dirname = path.dirname(id);
      const fullTradPath = path.resolve(dirname, trad, subdirectory);
      const relativePath = path.relative(dirname, fullTradPath);
      if (fs.existsSync(path.join(fullTradPath, `Messages_${lang}.${format}`))) {
        code += `if (!path || path === '${normalizePath(relativePath)}') {`;
        const toImport = normalizePath(path.join(relativePath, `Messages_${lang}.${format}`));
        code += `p.push(import('${toImport}').then(module => module.default ? module.default : module));`;
        code += '}';
      }
    });
    code += 'break;';
  });
  code += '} return $q.all(p).then((translations) => translations.reduce((previousValue, currentValue) => ({ ...previousValue, ...currentValue }), {})); ';
  return code;
};

const injectTranslationSwitch = (languages, trads, id, subdirectory, format) => {
  let code = 'switch($translate.use()) {';

  languages.forEach((lang) => {
    code += `case '${lang}':`;
    trads.forEach((trad) => {
      const dirname = path.dirname(id);
      const fullTradPath = path.resolve(dirname, trad, subdirectory);
      const relativePath = path.relative(dirname, fullTradPath);
      const toImport = normalizePath(path.join(relativePath, `Messages_${lang}.${format}`));

      const fileExists = fs.existsSync(path.join(fullTradPath, `Messages_${lang}.${format}`));

      code += 'if ($translate.use() !== $translate.fallbackLanguage()) {';
      if (fileExists) {
        code += `  promises.push(
            Promise.all([
              import('${toImport}').then(module => module.default ? module.default : module),
              useFallback('${normalizePath(relativePath)}'),
            ])
            .then(([ translations = {}, fallbackTranslations = {} ]) => {
              return Object.assign(fallbackTranslations, translations);
            })
          );`;
      } else {
        code += `promises.push(
              $q.when(
                useFallback('${normalizePath(relativePath)}'),
              )
            );`;
      }
      code += '}';
      if (fileExists) {
        code += ` else {
          promises.push(
            import('${toImport}').then(module => module.default ? module.default : module),
          );
        }`;
      }
    });


    code += 'break;';
  });
  code += 'default: promises.push(useFallback()); break; }';
  return code;
};

const injectTranslationImports = (languages, trads, id, subdirectory, format = 'xml') => `
  let promises = [];
  const useFallback = (path = false) => {
    ${injectFallbackFunction(languages, trads, id, subdirectory, format)}
  };
  ${injectTranslationSwitch(languages, trads, id, subdirectory, format)}
  promises.forEach(p => asyncLoader.addTranslations(p));
  return $q.all(promises).then(() => $translate.refresh());
`;

export = {
  normalizePath,
  injectTranslationImports,
  languages: concat(ALL_LANGUAGES),
};
