/**
 * This Script generates, in the terminal, the YAML file content for the
 * translation request regarding the french translations keys that
 * miss their english counterparts.
 */

const path = require('path');
const fs = require('fs');
const process = require('process');

const rootPath = 'packages';

const LANGUAGE_FILES = {
  FR: 'Messages_fr_FR.json',
  EN: 'Messages_en_GB.json',
  ES: 'Messages_es_ES.json',
  CA: 'Messages_fr_CA.json',
  IT: 'Messages_it_IT.json',
  PL: 'Messages_pl_PL.json',
  PT: 'Messages_pt_PT.json',
};

// cmd parameter
const LANG = process.argv[2];

/**
 * @param {[FR | EN | ES | CA | IT | PL | PT]} lang language of the translation file
 * @param {string} filePath absolute path to the translation file
 * @returns translation keys array of a translation file
 */
function getTranslationKeys(lang, filePath) {
  const translationKeysFile = fs.readFileSync(
    path.resolve(filePath, LANGUAGE_FILES[lang]),
  );
  return Object.keys(JSON.parse(translationKeysFile));
}

/**
 * display, in the terminal, the relative path to the translation file
 * respecting the YAML indentiations
 * @param {string} filePath absolute path to the translation file.
 */
function displayTranslationFile(filePath) {
  // the short path contains the absolute translation file path minus
  // the project base directory path '/<project_directory>/manager'.
  const shortPath = filePath.substring(path.resolve().length + 1);
  console.info(`\x1b[33m- ${shortPath}: \x1b[0m`);
}

/**
 * display, in the terminal, the list of the translation keys
 * associated to the translation file while respecting the YAML indentiations.
 * @param {[string]} array list of the translation keys
 * @returns null
 */
function displayTranslationKeys(array) {
  array.map((key) => {
    console.info(`  - ${key}`);
    return key;
  });
  return null;
}

function displayTranslation(directoryPath, file, array) {
  displayTranslationFile(path.resolve(directoryPath, file));
  displayTranslationKeys(array);
}

/**
 * Recursive function to navigate in the Manager project looking for and
 * displaying the missing translation keys.
 * @param {string} directoryPath absolute path of the current directory.
 * @returns null
 */
function displayFile(directoryPath) {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return console.error(`Unable to scan directory: ${err}`);
    }
    files.forEach((file) => {
      const fileDetails = fs.lstatSync(path.resolve(directoryPath, file));
      if (fileDetails.isDirectory()) {
        // recusive function call
        displayFile(path.resolve(directoryPath, file));
      } else if (file === LANGUAGE_FILES.FR) {
        const frTranslationKeys = getTranslationKeys('FR', directoryPath);
        try {
          const langTranslationKeys = getTranslationKeys(LANG, directoryPath);
          const diff = frTranslationKeys.filter(
            (key) => !langTranslationKeys.includes(key),
          );

          if (diff.length) {
            displayTranslation(directoryPath, file, diff);
          }
        } catch (error) {
          displayTranslation(directoryPath, file, frTranslationKeys);
        }
      }
    });
    return null;
  });
  return null;
}

function main() {
  if (!Object.keys(LANGUAGE_FILES).includes(LANG)) {
    console.error(
      'Incorrect argument: authorized arguments are < EN | ES | CA | IT | PL | PT >',
    );
    return null;
  }
  console.info(
    `YAML translation content for the missing ${LANG} translation keys : `,
  );
  displayFile(rootPath);
  return null;
}

main();
