/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const express = require('express');

const manifestBuilder = require('./builder/manifest');
const devStorage = require('./storage/dev-storage');
const remoteStorage = require('./storage/remote-storage');
const filterInfos = require('./storage/filter-infos');
const mergeInfos = require('./storage/merge-infos');

const {
  REGISTRY_FILE,
  FRAGMENT_DEFINITION_FILE,
} = require('./storage/constants');

module.exports = (rootPath, port = 8888, { fallbackRegistry, filters }) => {
  return Promise.all([
    devStorage.readInfos(rootPath),
    fallbackRegistry ? remoteStorage.readInfos(fallbackRegistry) : [],
  ])
    .then(([devInfos, fallbackInfos]) =>
      mergeInfos(fallbackInfos, filterInfos(devInfos, filters)),
    )
    .then((infos) => {
      const app = express();

      app.get(`/${REGISTRY_FILE}`, (request, response) => {
        response.status(200).json(manifestBuilder.buildRegistryManifest(infos));
      });

      app.get(`/:fragment/${FRAGMENT_DEFINITION_FILE}`, (request, response) => {
        const { fragment } = request.params;
        const manifest = manifestBuilder.buildFragmentManifest(infos, fragment);
        if (manifest) {
          response.status(200).json(manifest);
        } else {
          response.status(404).send(`Fragment "${fragment}" not found`);
        }
      });

      app.get('/:fragment/:version/*', (request, response) => {
        const { fragment, version } = request.params;
        const filepath = request.params[0] ? request.params[0] : '';
        const fragmentVersion = infos.find(
          (fragmentInfos) =>
            fragmentInfos.name === fragment &&
            fragmentInfos.versions.includes(version),
        );

        if (!fragmentVersion) {
          return response.status(404).send(`Fragment "${fragment}" not found`);
        }

        return devStorage
          .hasFragmentVersion(rootPath, fragment, version)
          .then((hasDevVersion) => {
            if (hasDevVersion) {
              const fragmentDistPath = path.resolve(rootPath, fragment, 'dist');

              return fs.exists(
                path.resolve(fragmentDistPath, filepath),
                (exists) => {
                  if (exists) {
                    return response.sendFile(filepath, {
                      root: fragmentDistPath,
                    });
                  }
                  return response
                    .status(404)
                    .send(
                      `File "${filepath}" not found in fragment "${fragment}"`,
                    );
                },
              );
            }
            if (fallbackRegistry) {
              return remoteStorage
                .getFileContent(fallbackRegistry, fragment, version, filepath)
                .then((content) => response.status(200).send(content))
                .catch(() =>
                  response
                    .status(404)
                    .send(
                      `File "${filepath}" not found in fragment "${fragment}" from fallback registry "${fallbackRegistry}"`,
                    ),
                );
            }
            return response
              .status(404)
              .send(`Fragment "${fragment}" not found`);
          });
      });

      app.listen(port);

      console.log(`Serve: ${rootPath} - localhost:${port}`);
      if (fallbackRegistry) {
        console.log(`Fallback registry: ${fallbackRegistry}`);
      }

      return app;
    });
};
/* eslint-enable no-console */
