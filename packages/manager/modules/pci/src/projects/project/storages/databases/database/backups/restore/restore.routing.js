export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.backups.restore',
    {
      url: '/restore',
      params: {
        backupInstance: null,
      },
      views: {
        modal: {
          component: 'ovhManagerPciStoragesDatabaseBackupsRestoreComponent',
        },
      },
      layout: 'modal',
      resolve: {
        backupInstance: /* @ngInject */ ($transition$) =>
          $transition$.params().backupInstance,
        breadcrumb: () => null,
        goBack: /* @ngInject */ (goBackToBackups) => goBackToBackups,
      },
    },
  );
};
