export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.databases.delete', {
    url: '/delete',
    params: {
      database: null,
    },
    views: {
      modal: {
        component: 'ovhManagerPciProjectDatabasesDeleteDatabase',
      },
    },
    layout: 'modal',
    resolve: {
      database: /* @ngInject */ ($transition$) =>
        $transition$.params().database,
      goBack: /* @ngInject */ (goToDatabases) => goToDatabases,
      breadcrumb: () => null,
      trackingPrefix: () => 'table::options_menu',
    },
  });
};
