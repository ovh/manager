/* eslint-disable no-console */
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const util = require('util');
const staticStorage = require('./storage/static-storage');

const { FRAGMENT_MANIFEST_FILE } = require('./storage/constants');

const getFragmentManifest = (fragmentPath) =>
  util
    .promisify(fs.readFile)(path.resolve(fragmentPath, FRAGMENT_MANIFEST_FILE))
    .then((content) => JSON.parse(content))
    .catch(() => ({}));

module.exports = (rootPath, fragmentPath) =>
  Promise.all([
    staticStorage.readInfos(rootPath),
    getFragmentManifest(fragmentPath),
  ]).then(([infos, fragmentManifest]) => {
    const { name, version } = fragmentManifest;

    if (!name || !version) {
      console.log(`Invalid manifest in ${fragmentPath}`);
    } else {
      const fragmentExists = infos.find(
        (info) => info.name === name && info.versions.includes(version),
      );

      if (fragmentExists) {
        console.log(
          `Fragment "${name}@${version}" already exists in ${rootPath}`,
        );
      } else {
        util
          .promisify(fse.copy)(
            fragmentPath,
            path.resolve(rootPath, name, version),
            {
              dereference: true,
            },
          )
          .then(() => {
            console.log(
              `Fragment "${name}@${version}" added in registry ${rootPath}`,
            );
          });
      }
    }
  });
/* eslint-enable no-console */
