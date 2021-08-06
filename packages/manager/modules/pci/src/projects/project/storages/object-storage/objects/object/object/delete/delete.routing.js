export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.object-storage.objects.object.delete',
    {
      url: '/:objectId/delete',
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
