/* eslint-disable no-console */
const path = require('path');
const staticStorage = require('./storage/static-storage');

const addFragmentStatic = require('./addFragmentStatic');

const parseInfos = (infos) =>
  infos.reduce(
    (results, { name, versions }) => [
      ...results,
      ...versions.map((version) => ({ name, version })),
    ],
    [],
  );

const getMissingFragmentsVersion = (sourceInfos, targetInfos) => {
  const source = parseInfos(sourceInfos);
  const target = parseInfos(targetInfos);

  return source.filter(
    ({ name, version }) =>
      !target.find(
        ({ name: targetName, version: targetVersion }) =>
          name === targetName && version === targetVersion,
      ),
  );
};

module.exports = (sourceRegistryPath, targetRegistryPath) => {
  return Promise.all([
    staticStorage.readInfos(sourceRegistryPath),
    staticStorage.readInfos(targetRegistryPath),
  ]).then(([sourceInfos, targetInfos]) => {
    const diff = getMissingFragmentsVersion(sourceInfos, targetInfos);

    if (diff.length > 0) {
      return Promise.all(
        diff.map(({ name, version }) =>
          addFragmentStatic(
            targetRegistryPath,
            path.resolve(sourceRegistryPath, name, version),
          ),
        ),
      );
    }

    console.log('No fragment to sync');
    return Promise.resolve();
  });
};

/* eslint-enable no-console */
