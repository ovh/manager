import { RESTORE_MODES } from './fork/fork.constants';

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
        getCurrentFlavor: /* @ngInject */ (database, engine) => () =>
          engine.getFlavor(
            database.version,
            database.plan,
            database.region,
            database.flavor,
          ),
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
        goBackToDashboard: /* @ngInject */ ($state, CucCloudMessage) => (
          message = false,
          type = 'success',
        ) => {
          const reload = message && type === 'success';
          const state =
            'pci.projects.project.storages.databases.dashboard.general-information';
          const promise = $state.go(state, {}, { reload });
          if (message) {
            promise.then(() => {
              CucCloudMessage[type](message, state);
            });
          }
          return promise;
        },
        goToRestore: /* @ngInject */ ($state) => (backupInstance) => {
          const stateparams = {
            restoreMode: RESTORE_MODES.SOONEST,
          };
          if (backupInstance) {
            stateparams.restoreMode = RESTORE_MODES.BACKUP;
            stateparams.backupId = backupInstance.id;
          }
          $state.go(
            'pci.projects.project.storages.databases.dashboard.backups.restore',
            stateparams,
          );
        },
        goToFork: /* @ngInject */ ($state) => (backupInstance) => {
          const stateparams = {
            restoreMode: RESTORE_MODES.SOONEST,
          };
          if (backupInstance) {
            stateparams.restoreMode = RESTORE_MODES.BACKUP;
            stateparams.backupId = backupInstance.id;
          }

          return $state.go(
            'pci.projects.project.storages.databases.dashboard.backups.fork',
            stateparams,
          );
        },
        refreshBackups: /* @ngInject */ ($state) => () => {
          return $state.reload();
        },
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('pci_databases_backup'),
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
