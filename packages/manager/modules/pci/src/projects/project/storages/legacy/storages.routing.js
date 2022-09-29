export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages', {
    url: '/storages',
    abstract: true,
  });
};
