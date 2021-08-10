import find from 'lodash/find';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.object-storage.objects.delete',
    {
      url: '/delete?containerId',
      views: {
        modal: {
          component: 'pciProjectStorageContainersContainerDelete',
        },
      },
      layout: 'modal',
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
        goBack: /* @ngInject */ (goToStorageContainers) =>
          goToStorageContainers,
        breadcrumb: () => null,
      },
      atInternet: {
        rename: 'pci::projects::project::storages::objects::delete',
      },
    },
  );
};
