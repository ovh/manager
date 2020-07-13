/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const util = require('util');

const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);

const manifestBuilder = require('./builder/manifest');
const staticStorage = require('./storage/static-storage');
const remoteStorage = require('./storage/remote-storage');
const mergeInfos = require('./storage/merge-infos');

const {
  REGISTRY_FILE,
  FRAGMENT_DEFINITION_FILE,
} = require('./storage/constants');

const writeFragmentManifest = (rootPath, fragment, infos) =>
  mkdir(path.resolve(rootPath, fragment.name), {
    recursive: true,
  }).then(() =>
    writeFile(
      path.resolve(rootPath, fragment.name, FRAGMENT_DEFINITION_FILE),
      JSON.stringify(
        manifestBuilder.buildFragmentManifest(infos, fragment.name),
      ),
      'UTF-8',
    ),
  );

module.exports = (rootPath, { fallbackRegistry }) =>
  Promise.all([
    staticStorage.readInfos(rootPath),
    fallbackRegistry ? remoteStorage.readInfos(fallbackRegistry) : [],
  ])
    .then(([staticInfos, fallbackInfos]) =>
      mergeInfos(fallbackInfos, staticInfos),
    )
    .then((infos) =>
      Promise.all([
        writeFile(
          path.resolve(rootPath, REGISTRY_FILE),
          JSON.stringify(manifestBuilder.buildRegistryManifest(infos)),
          'UTF-8',
        ),
        ...infos.map((fragment) =>
          writeFragmentManifest(rootPath, fragment, infos),
        ),
      ]),
    )
    .then(() => {
      const fallbackInfos = fallbackRegistry
        ? ` with fallback informations from ${fallbackRegistry}`
        : '';
      console.log(
        `Manifests are generated for static registry in ${rootPath}${fallbackInfos}`,
      );
    });
/* eslint-enable no-console */
