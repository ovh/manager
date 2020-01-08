export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.archives.archive.add', {
    url: '/new',
    views: {
      modal: {
        component: 'pciProjectStorageContainersContainerObjectAdd',
      },
    },
    layout: 'modal',
    resolve: {
      archive: () => true,
      goBack: /* @ngInject */ (goToStorageContainer) => goToStorageContainer,
      breadcrumb: () => null,
    },
  });
};
