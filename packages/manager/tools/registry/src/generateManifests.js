/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const util = require('util');

const writeFile = util.promisify(fs.writeFile);

const manifestBuilder = require('./builder/manifest');
const { readInfos } = require('./storage/static-storage');
const {
  REGISTRY_FILE,
  FRAGMENT_DEFINITION_FILE,
} = require('./storage/constants');

module.exports = (rootPath) =>
  readInfos(rootPath)
    .then((infos) =>
      Promise.all([
        writeFile(
          path.resolve(rootPath, REGISTRY_FILE),
          JSON.stringify(manifestBuilder.buildRegistryManifest(infos)),
          'UTF-8',
        ),
        ...infos.map((fragment) =>
          writeFile(
            path.resolve(rootPath, fragment.name, FRAGMENT_DEFINITION_FILE),
            JSON.stringify(
              manifestBuilder.buildFragmentManifest(infos, fragment.name),
            ),
            'UTF-8',
          ),
        ),
      ]),
    )
    .then(() =>
      console.log(`Manifests are generated for static registry in ${rootPath}`),
    );
/* eslint-enable no-console */
