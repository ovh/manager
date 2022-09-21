export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.cold-archive', {
    url: '/cold-archive',
    component: 'ovhManagerPciProjectStorageColdArchive',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
