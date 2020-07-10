module.exports = {
  buildRegistryManifest: (infos) => {
    return {
      fragments: infos.map((fragment) => fragment.name),
    };
  },

  buildFragmentManifest: (infos, fragmentName) => {
    return infos.find((fragment) => fragment.name === fragmentName);
  },
};
