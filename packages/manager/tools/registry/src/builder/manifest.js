const semverCompare = require('semver/functions/compare');

module.exports = {
  buildRegistryManifest: (infos) => {
    return {
      fragments: infos.map((fragment) => fragment.name).sort(),
    };
  },

  buildFragmentManifest: (infos, fragmentName) => {
    const fragmentManifest = infos.find(
      (fragment) => fragment.name === fragmentName,
    );
    if (fragmentManifest) {
      return {
        ...fragmentManifest,
        versions: fragmentManifest.versions.sort(semverCompare),
      };
    }
    return fragmentManifest;
  },
};
