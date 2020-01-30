import pick from 'lodash/pick';
import pickBy from 'lodash/pickBy';
import set from 'lodash/set';

angular.module('managerApp').service('CloudStorageContainer', [
  '$cacheFactory',
  '$http',
  '$q',
  'OvhApiCloudProjectStorage',
  'CloudStorageContainersConfiguration',
  'CLOUD_PCA_FILE_STATE',
  function CloudStorageContainerService(
    $cacheFactory,
    $http,
    $q,
    OvhApiCloudProjectStorage,
    storageContainerConfig,
    CLOUD_PCA_FILE_STATE,
  ) {
    const self = this;

    // Openstack headers
    const xStoragePolicy = 'x-storage-policy';
    const xContainerRead = 'x-container-read';
    const xContainerMetaWebListings = 'x-container-meta-web-listings';
    const xContainerReadPublicValue = '.r:*,.rlistings';

    // Cache management
    const { accessCache } = storageContainerConfig;

    function getAccessAndToken(projectId) {
      const cacheValue = accessCache.get(projectId);

      const getAccessAndTokenPromise = cacheValue
        ? $q.resolve(cacheValue)
        : OvhApiCloudProjectStorage.v6().access(
            {
              projectId,
            },
            {},
          ).$promise;

      return getAccessAndTokenPromise.then((accessResult) => {
        if (!cacheValue) {
          accessCache.put(projectId, accessResult);
        }
        self.token = accessResult.token;
        self.endpoints = accessResult.endpoints.reduce(
          (resultParam, endpoint) => {
            const result = resultParam;
            result[endpoint.region.toLowerCase()] = endpoint.url;
            return result;
          },
          {},
        );
        return accessResult;
      });
    }

    function ensureAccess(projectId) {
      return getAccessAndToken(projectId);
    }

    // Improvement:
    // Avoid listing all containers to get metadata.
    function getContainerMeta(projectId, containerId) {
      const containerMeta = storageContainerConfig.containerMetaCache.get(
        projectId,
        containerId,
      );
      return containerMeta
        ? $q.resolve(containerMeta)
        : self
            .list(projectId, containerId)
            .then(() =>
              storageContainerConfig.containerMetaCache.get(
                projectId,
                containerId,
              ),
            );
    }

    function getContainerUrl(baseUrl, containerName, file) {
      let urlTpl = `${baseUrl}/{container}`;
      let url;
      if (file) {
        urlTpl += '/{file}';
        url = URI.expand(urlTpl, {
          container: containerName,
          file,
        }).toString();
      } else {
        url = URI.expand(urlTpl, {
          container: containerName,
        }).toString();
      }
      return url;
    }

    function requestContainer(baseUrl, containerName, optsParam) {
      const opts = optsParam || {};
      const url = getContainerUrl(baseUrl, containerName, opts.file);
      delete opts.file;

      return $http(
        angular.merge(
          {
            method: 'GET',
            url,
            headers: {
              'X-Auth-Token': self.token,
            },
          },
          opts,
        ),
      );
    }

    /**
     * Get meta data of this container.
     * @param  {string} projectId     project id
     * @param  {string} containerId   container id
     * @return {Promise<Object>}      container metadata
     */
    self.getMetaData = function getMetaData(projectId, containerId) {
      return ensureAccess(projectId)
        .then(() => getContainerMeta(projectId, containerId))
        .then((containerMeta) =>
          requestContainer(
            self.endpoints[containerMeta.region.toLowerCase()],
            containerMeta.name,
            { method: 'HEAD' },
          ),
        )
        .then((data) =>
          pickBy(data.headers(), (value, key) =>
            /^(X-Container|X-Storage)/i.test(key),
          ),
        )
        .then((data) => {
          // Guess storage type
          if (data[xStoragePolicy] === 'PCS') {
            if (data[xContainerMetaWebListings]) {
              set(data, 'shortcut', 'swift_cname');
            } else if (data[xContainerRead] === xContainerReadPublicValue) {
              set(data, 'shortcut', 'swift_public');
            } else {
              set(data, 'shortcut', 'swift_private');
            }
          } else {
            set(data, 'shortcut', 'pca');
          }
          return data;
        });
    };

    /**
     * List container objects.
     * @param  {string} projectId     project id
     * @param  {string} containerId   container id
     * @return {Promise<Object>}      object containing the list of objects
     */
    self.list = function list(projectId, containerId) {
      return OvhApiCloudProjectStorage.v6()
        .get({
          projectId,
          containerId,
        })
        .$promise.then((containerData) => {
          storageContainerConfig.containerMetaCache.set(
            projectId,
            containerId,
            pick(containerData, ['name', 'region']),
          );
          return containerData;
        });
    };

    /* eslint-disable no-shadow */
    function upload(url, config) {
      const deferred = $q.defer();
      const xhr = new XMLHttpRequest();

      const uploadProgress = function uploadProgress(e) {
        let res;
        if (e.lengthComputable) {
          res = Math.round((e.loaded * 100) / e.total);
        } else {
          res = undefined;
        }

        if (typeof deferred.notify === 'function') {
          deferred.notify(res);
        }
      };

      const uploadComplete = function uploadComplete(e) {
        const xhr = e.srcElement || e.target;
        if (xhr.status >= 200 && xhr.status < 300) {
          // successful upload
          deferred.resolve(xhr);
        } else {
          deferred.reject(xhr);
        }
      };

      const uploadFailed = function uploadFailed(e) {
        const xhr = e.srcElement || e.target;
        deferred.reject(xhr);
      };

      const uploadCanceled = function uploadCanceled(e) {
        const xhr = e.srcElement || e.target;
        deferred.reject(xhr);
      };

      xhr.upload.addEventListener('progress', uploadProgress, false);
      xhr.addEventListener('load', uploadComplete, false);
      xhr.addEventListener('error', uploadFailed, false);
      xhr.addEventListener('abort', uploadCanceled, false);

      // Send the file
      xhr.open('PUT', url, true);

      let headers = config.headers || {};
      headers = angular.extend(
        {
          'X-Auth-Token': self.token,
        },
        headers,
      );

      angular.forEach(headers, (header, id) => {
        xhr.setRequestHeader(id, header);
      });
      xhr.send(config.data);
      return deferred.promise;
    }
    /* eslint-enable no-shadow */

    /**
     * Download file.
     * @param  {string} projectId   project id
     * @param  {string} containerId container id
     * @param  {Object} object      object to download
     * @return {Promise}
     */
    self.download = function download(projectId, containerId, file) {
      const weekDurationInMilliseconds = 6.048e8;
      const expiration = new Date(Date.now() + weekDurationInMilliseconds);

      function unseal(url) {
        return $http.get(url).catch((err) => {
          // This call make a CORS error, but still initiate the process,
          // swallow status -1 which is what we get when cors fail.
          if (err.status !== -1) {
            throw err;
          }
        });
      }

      return OvhApiCloudProjectStorage.v6()
        .getURL(
          {
            projectId,
            containerId,
          },
          {
            expirationDate: expiration.toISOString(),
            objectName: file.name,
          },
        )
        .$promise.then((resp) => {
          if (file.retrievalState === CLOUD_PCA_FILE_STATE.SEALED) {
            return unseal(resp.getURL);
          }
          return resp.getURL;
        });
    };

    /**
     * Add object to container.
     * @param  {string} projectId     project id
     * @param  {string} containerId   container id
     * @param  {Object} opts          upload opts
     * @return {Promise}
     */
    self.upload = function uploadFn(projectId, containerId, opts) {
      if (!opts.file) {
        return $q.reject({
          errorCode: 'BAD_PARAMETERS',
          config: opts,
        });
      }
      return ensureAccess(projectId)
        .then(() => getContainerMeta(projectId, containerId))
        .then((containerMeta) => {
          const config = {
            headers: {
              'Content-Type': opts.file.type,
            },
            data: opts.file,
          };
          let filename = opts.file.name;
          if (opts.prefix) {
            filename = opts.prefix + filename;
          }
          const url = getContainerUrl(
            self.endpoints[containerMeta.region.toLowerCase()],
            containerMeta.name,
            filename,
          );
          return upload(url, config);
        });
    };

    /**
     * Delete an object.
     * @param  {string} projectId   project id
     * @param  {string} containerId container id
     * @param  {string} file        file name
     * @return {Promise}
     */
    self.delete = function deleteFn(projectId, containerId, file) {
      return ensureAccess(projectId)
        .then(() => getContainerMeta(projectId, containerId))
        .then((containerMeta) =>
          requestContainer(
            self.endpoints[containerMeta.region.toLowerCase()],
            containerMeta.name,
            {
              method: 'DELETE',
              file,
            },
          ),
        );
    };

    /**
     * Set container as public.
     * @param {string} projectId   project id
     * @param {string} containerId container id
     * @return {Promise}
     */
    self.setAsPublic = function setAsPublic(projectId, containerId) {
      return ensureAccess(projectId)
        .then(() => getContainerMeta(projectId, containerId))
        .then((containerMeta) => {
          if (containerMeta[xContainerRead] !== xContainerReadPublicValue) {
            return requestContainer(
              self.endpoints[containerMeta.region.toLowerCase()],
              containerMeta.name,
              {
                method: 'PUT',
                headers: {
                  'X-Container-Read': xContainerReadPublicValue,
                },
              },
            );
          }
          return $.resolve();
        });
    };

    self.getAccessAndToken = getAccessAndToken;
  },
]);
