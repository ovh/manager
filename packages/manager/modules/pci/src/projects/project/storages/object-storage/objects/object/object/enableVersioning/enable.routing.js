export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.object-storage.objects.object.enableVersioning',
    {
      url: '/enableVersioning',
      views: {
        modal: {
          component: 'pciProjectStorageContainersContainerEnableVersioning',
        },
      },
      layout: { name: 'modal', backdrop: 'static' },
      resolve: {
        goBack: /* @ngInject */ (goToStorageContainer) => goToStorageContainer,
        breadcrumb: () => null,
      },
      atInternet: {
        rename:
          'pci::projects::project::storages::objects::object::enable-versioning',
      },
    },
  );
};
