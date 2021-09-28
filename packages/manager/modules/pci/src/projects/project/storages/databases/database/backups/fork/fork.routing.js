export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.backups.fork',
    {
      url: '/fork',
      params: {
        backupInstance: null,
        database: null,
      },
      views: {
        modal: {
          component: 'ovhManagerPciStoragesDatabaseBackupsForkComponent',
        },
      },
      layout: 'modal',
      resolve: {
        backupInstance: /* @ngInject */ ($transition$) =>
          $transition$.params().backupInstance,
        database: /* @ngInject */ ($transition$) =>
          $transition$.params().database,
        breadcrumb: () => null,
        goToFork: /* @ngInject */ ($state) => (backupInstance, database) =>
          $state.go('pci.projects.project.storages.databases.fork', {
            backupInstance,
            database,
          }),
        goBack: /* @ngInject */ (goBackToBackups) => goBackToBackups,
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
