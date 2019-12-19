export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.storages.archives.archive', {
      url: '/{containerId}',
      component: 'pciProjectStorageContainersContainer',
      resolve: {
        containerId: /* @ngInject */ ($transition$) => $transition$.params().containerId,
        container: /* @ngInject */ (
          PciProjectStorageContainersService,
          projectId,
          containerId,
        ) => PciProjectStorageContainersService.getContainer(projectId, containerId),

        defaultPassword: /* @ngInject */ (
          PciProjectStorageContainersService,
          projectId,
          container,
        ) => PciProjectStorageContainersService.getArchivePassword(projectId, container),

        addObject: /* @ngInject */ ($state, projectId, containerId) => () => $state.go('pci.projects.project.storages.archives.archive.add', {
          projectId,
          containerId,
        }),
        deleteObject: /* @ngInject */ ($state, projectId, containerId) => (object) => $state.go('pci.projects.project.storages.archives.archive.delete', {
          projectId,
          containerId,
          objectId: object.name,
        }),

        goBack: /* @ngInject */ (goToStorageContainers) => goToStorageContainers,

        goToStorageContainer: /* @ngInject */ ($rootScope, CucCloudMessage, $state, projectId, containerId) => (message = false, type = 'success') => {
          const reload = message && type === 'success';

          const promise = $state.go('pci.projects.project.storages.archives.archive', {
            projectId,
            containerId,
          },
          {
            reload,
          });

          if (message) {
            promise.then(() => CucCloudMessage[type](message, 'pci.projects.project.storages.containers.container'));
          }

          return promise;
        },

        refresh: /* @ngInject */ (goToStorageContainer) => goToStorageContainer,

        breadcrumb: /* @ngInject */ (container) => container.name,
      },
    });
};
