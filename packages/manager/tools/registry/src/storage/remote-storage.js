const axios = require('axios');

const { REGISTRY_FILE, FRAGMENT_DEFINITION_FILE } = require('./constants');

const getRegistryManifest = (registryUrl) => {
  return axios
    .get(`${registryUrl}/${REGISTRY_FILE}`)
    .then(({ data }) => data)
    .catch(() => ({ fragments: [] }));
};

const getFragmentManifestFile = (registryUrl, fragment) => {
  return axios
    .get(`${registryUrl}/${fragment}/${FRAGMENT_DEFINITION_FILE}`)
    .then(({ data }) => data)
    .catch(() => ({ name: fragment, versions: [] }));
};

const readInfos = (registryUrl) => {
  return getRegistryManifest(registryUrl)
    .then((manifest) =>
      Promise.all(
        manifest.fragments.map((fragment) =>
          getFragmentManifestFile(registryUrl, fragment),
        ),
      ),
    )
    .then((fragments) =>
      fragments.filter(({ versions }) => versions.length > 0),
    );
};

const getFileContent = (registryUrl, fragment, version, file) =>
  axios
    .get(`${registryUrl}/${fragment}/${version}/${file}`)
    .then(({ data }) => data);

module.exports = {
  readInfos,
  getFileContent,
};
