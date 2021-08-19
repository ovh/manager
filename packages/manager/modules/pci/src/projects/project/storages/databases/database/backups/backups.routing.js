import find from "lodash/find";

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
        backupRetentionTime: /*@ngInject*/ (database, DatabaseService, projectId) => 
          DatabaseService.getCapabilities(projectId).then((capabilities) =>
          find(capabilities.plans, (p) => p.name === database.plan).backupRetention
        ),
        //backupRetentionTime: /* @ngInject */ (database, DatabaseService, projectId) => 
        //  DatabaseService.getBackupsRetentionTime(projectId, database.engine, database.id),
        //backupLocalisation: /* @ngInject */ (database, DatabaseService, projectId) => 
        //  DatabaseService.getBackupsLocalisation(projectId, database.engine, database.id),
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
        goToFork: /* @ngInject */ ($state) => (backupInstance, database) =>
          $state.go(
            'pci.projects.project.storages.databases.dashboard.backups.fork',
            {
              backupInstance,
              database,
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
