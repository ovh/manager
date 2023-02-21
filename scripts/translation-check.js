/**
 * This Script generates, in the terminal, the YAML file content for the
 * translation request regarding the french translations keys that
 * miss their english counterparts.
 */

const path = require('path');
const fs = require('fs');

const rootPath = 'packages';
const LANGUAGE_FILES = {
  EN: 'Messages_en_GB.json',
  FR: 'Messages_fr_FR.json',
};

/**
 * @param {[FR|EN]} lang language of the translation file
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
          const enTranslationKeys = getTranslationKeys('EN', directoryPath);
          const diff = frTranslationKeys.filter(
            (key) => !enTranslationKeys.includes(key),
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

displayFile(rootPath);
