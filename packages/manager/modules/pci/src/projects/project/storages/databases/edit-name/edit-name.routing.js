export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.databases.name', {
    url: '/name',
    views: {
      modal: {
        component: 'ovhManagerPciProjectDatabaseName',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
