export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.object-storage.objects.object.add',
    {
      url: '/new',
      views: {
        modal: {
          component: 'pciProjectStorageContainersContainerObjectAdd',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ (goToStorageContainer) => goToStorageContainer,
        breadcrumb: () => null,
      },
    },
  );
};
