import find from 'lodash/find';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.object-storage.objects.object',
    {
      url: '/{containerId}',
      component: 'pciProjectStorageContainersContainer',
      resolve: {
        containerId: /* @ngInject */ ($transition$) =>
          $transition$.params().containerId,
        container: /* @ngInject */ (
          PciProjectStorageContainersService,
          projectId,
          containerId,
          containers,
        ) => {
          const container = find(containers, { id: containerId });
          return PciProjectStorageContainersService.getContainer(
            projectId,
            containerId,
            container.isHighPerfStorage,
          );
        },

        addObject: /* @ngInject */ ($state, projectId, containerId) => () =>
          $state.go(
            'pci.projects.project.storages.object-storage.objects.object.add',
            {
              projectId,
              containerId,
            },
          ),

        deleteObject: /* @ngInject */ (
          $state,
          atInternet,
          projectId,
          containerId,
          trackingPrefix,
        ) => (object) => {
          atInternet.trackClick({
            name: `${trackingPrefix}object::delete`,
            type: 'action',
          });

          return $state.go(
            'pci.projects.project.storages.object-storage.objects.object.delete',
            {
              projectId,
              containerId,
              objectId: object.name,
            },
          );
        },
        goToAddUserOnObject: /* @ngInject */ ($state, containerId) => (
          object,
        ) =>
          $state.go(
            'pci.projects.project.storages.object-storage.objects.object.addUser',
            { containerId, objectKey: object.key },
          ),

        goBack: /* @ngInject */ (goToStorageContainers) =>
          goToStorageContainers,

        goToStorageContainer: /* @ngInject */ (
          CucCloudMessage,
          $state,
          projectId,
          containerId,
        ) => (message = false, type = 'success') => {
          const reload = message && type === 'success';

          const promise = $state.go(
            'pci.projects.project.storages.object-storage.objects.object',
            {
              projectId,
              containerId,
            },
            {
              reload,
            },
          );

          if (message) {
            promise.then(() =>
              CucCloudMessage[type](
                message,
                'pci.projects.project.storages.containers.container',
              ),
            );
          }

          return promise;
        },
        refresh: /* @ngInject */ (goToStorageContainer) => goToStorageContainer,

        breadcrumb: /* @ngInject */ (container) => container.name,
      },
      atInternet: {
        rename: 'pci::projects::project::storages::objects::object',
      },
    },
  );
};
