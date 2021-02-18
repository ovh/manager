import pick from 'lodash/pick';

angular.module('managerApp').service('CloudStorageContainers', [
  '$q',
  'OvhApiCloudProjectStorage',
  'CloudStorageContainersConfiguration',
  'CloudStorageContainer',
  function CloudStorageContainers(
    $q,
    OvhApiCloudProjectStorage,
    storageContainerConfig,
    storageContainer,
  ) {
    const self = this;

    /**
     * Get the list of the containers.
     * @param  {string} projectId    project id
     * @return {Promise}
     */
    self.list = function list(projectId) {
      function saveNameAndRegion(container) {
        const data = storageContainerConfig.containerMetaCache.get(
          projectId,
          container.id,
        );
        if (!data) {
          storageContainerConfig.containerMetaCache.set(
            projectId,
            container.id,
            pick(container, ['name', 'region']),
          );
        }
      }

      return OvhApiCloudProjectStorage.v6()
        .query({
          projectId,
        })
        .$promise.then((containers) => {
          // Cache name and region of each container
          containers.forEach((container) => {
            saveNameAndRegion(container);
          });
          return containers;
        });
    };

    /**
     * Create a container.
     * @param  {string} projectId     project id
     * @param  {string} containerName container name
     * @param  {string} region        region
     * @param  {string} type          storage type (swift_cname|swift_public|swift_private|pca)
     * @return {Promise}
     */
    self.create = function create(projectId, containerName, region, type) {
      const data = {
        containerName,
        region,
      };
      let containerData = {};
      let currentContainerId;

      if (type === 'archive') {
        data.archive = true;
      }

      return OvhApiCloudProjectStorage.v6()
        .save(
          {
            projectId,
          },
          data,
        )
        .$promise.then((result) => {
          currentContainerId = result.id;
          containerData = result;

          // Make container a static hosting
          if (type === 'static') {
            return OvhApiCloudProjectStorage.v6().static(
              {
                projectId,
                containerId: currentContainerId,
              },
              {},
            ).$promise;
          }

          // Make container public
          if (type === 'public') {
            return storageContainer.setAsPublic(projectId, currentContainerId);
          }

          return $q.when();
        })
        .then(() => storageContainer.getMetaData(projectId, currentContainerId))
        .then((metaData) => angular.extend(containerData, metaData));
    };

    /**
     * Delete a container.
     * @param  {string} projectId   project id
     * @param  {string} containerId container id
     * @return {Promise}
     */
    self.delete = function deleteFn(projectId, containerId) {
      return OvhApiCloudProjectStorage.v6()
        .get({
          projectId,
          containerId,
        })
        .$promise.then((containerData) => {
          if (containerData.objects.length) {
            return $q.reject('NON_EMPTY_CONTAINER');
          }
          return OvhApiCloudProjectStorage.v6().delete({
            projectId,
            containerId,
          }).$promise;
        });
    };
  },
]);
