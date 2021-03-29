const fs = require('fs');
const path = require('path');
const util = require('util');

const { FRAGMENT_MANIFEST_FILE } = require('./constants');

const getFragmentManifestFile = (rootPath, fragment, version) =>
  path.resolve(rootPath, fragment, version, FRAGMENT_MANIFEST_FILE);

const getFragmentVersionManifest = (rootPath, fragment, version) =>
  util
    .promisify(fs.readFile)(
      getFragmentManifestFile(rootPath, fragment, version),
    )
    .then((content) => JSON.parse(content))
    .catch(() => ({}));

const listVersions = (rootPath, fragment) =>
  util
    .promisify(fs.readdir)(path.resolve(rootPath, fragment), {
      withFileTypes: true,
    })
    .then((files) =>
      files.filter((file) => file.isDirectory()).map((file) => file.name),
    )
    .then((versions) =>
      Promise.all(
        versions.map((version) =>
          getFragmentVersionManifest(rootPath, fragment, version).then(
            (manifest) => manifest.version === version,
          ),
        ),
      ).then((valids) => versions.filter((version, index) => valids[index])),
    );

const listFragments = (rootPath) =>
  // list fragments
  util
    .promisify(fs.readdir)(rootPath, { withFileTypes: true })
    .then((files) =>
      files.filter((file) => file.isDirectory()).map((file) => file.name),
    )
    .then((folders) =>
      Promise.all(
        folders.map((folder) =>
          listVersions(rootPath, folder).then((versions) => ({
            name: folder,
            versions,
          })),
        ),
      ),
    )
    .then((fragments) =>
      fragments.filter(({ versions }) => versions.length > 0),
    );
const readInfos = (rootPath) => listFragments(rootPath);

module.exports = {
  readInfos,
};
