export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.metrics',
    {
      url: '/metrics',
      params: {
        backupInstance: null,
      },
      cache: false,
      views: {
        databaseView: 'ovhManagerPciStoragesDatabaseMetricsComponent',
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('pci_database_metrics_title'),
      },
    },
  );
};
