const fs = require('fs');
const path = require('path');
const util = require('util');

const { FRAGMENT_MANIFEST_FILE } = require('./constants');

const getFragmentManifestFile = (rootPath, fragment) =>
  path.resolve(rootPath, fragment, 'dist', FRAGMENT_MANIFEST_FILE);

const listFragments = (rootPath) =>
  util
    .promisify(fs.readdir)(rootPath, { withFileTypes: true })
    .then((files) =>
      files.filter((file) => file.isDirectory()).map((file) => file.name),
    )
    .then((folders) =>
      Promise.all(
        folders.map((folder) =>
          util.promisify(fs.exists)(getFragmentManifestFile(rootPath, folder)),
        ),
      ).then((exists) => folders.filter((folder, index) => exists[index])),
    );

const getFragmentVersion = (rootPath, fragment) =>
  util
    .promisify(fs.readFile)(getFragmentManifestFile(rootPath, fragment))
    .then((content) => JSON.parse(content));

const hasFragmentVersion = (rootPath, fragment, version) =>
  getFragmentVersion(rootPath, fragment)
    .then(({ version: manifestVersion }) => manifestVersion === version)
    .catch(() => false);

const readInfos = (rootPath) =>
  listFragments(rootPath).then((fragments) =>
    Promise.all(
      fragments.map((fragment) =>
        getFragmentVersion(rootPath, fragment).then((manifest) => ({
          name: manifest.name,
          versions: [manifest.version],
        })),
      ),
    ),
  );

module.exports = {
  readInfos,
  hasFragmentVersion,
};
