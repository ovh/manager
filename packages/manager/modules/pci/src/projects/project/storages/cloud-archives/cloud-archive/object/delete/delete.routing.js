export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.archives.archive.delete',
    {
      url: '/delete?objectId',
      views: {
        modal: {
          component: 'pciProjectStorageContainersContainerObjectDelete',
        },
      },
      layout: 'modal',
      resolve: {
        objectId: /* @ngInject */ ($transition$) =>
          $transition$.params().objectId,
        object: /* @ngInject */ (container, objectId) =>
          container.getObjectById(objectId),

        goBack: /* @ngInject */ (goToStorageContainer) => goToStorageContainer,
        breadcrumb: () => null,
      },
    },
  );
};
