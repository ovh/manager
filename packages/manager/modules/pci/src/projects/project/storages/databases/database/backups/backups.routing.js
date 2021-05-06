export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.backups',
    {
      url: '/backups',
      cache: false,
      views: {
        databaseView: 'ovhManagerPciStoragesDatabaseBackupsComponent',
      },
      resolve: {
        /* @ngInject */
        backupList: (database, DatabaseService, projectId) =>
          DatabaseService.getBackups(projectId, database.engine, database.id),
        goBackToBackups: /* @ngInject */ ($state, CucCloudMessage) => (
          message = false,
          type = 'success',
        ) => {
          const reload = message && type === 'success';
          const state =
            'pci.projects.project.storages.databases.dashboard.backups';
          const promise = $state.go(state, {}, { reload });
          if (message) {
            promise.then(() => {
              CucCloudMessage[type](message, state);
            });
          }
          return promise;
        },
        goToRestore: /* @ngInject */ ($state) => (backupInstance) =>
          $state.go(
            'pci.projects.project.storages.databases.dashboard.backups.restore',
            {
              backupInstance,
            },
          ),
        refreshBackups: /* @ngInject */ ($state) => () => {
          return $state.reload();
        },
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('pci_databases_backup'),
      },
    },
  );
};
