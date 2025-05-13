export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.logs',
    {
      url: '/logs',
      params: {
        backupInstance: null,
      },
      cache: false,
      views: {
        databaseView: 'ovhManagerPciStoragesDatabaseLogsComponent',
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('pci_database_logs_title'),
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
