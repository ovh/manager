import { STATUS } from '../../../../../../../components/project/storages/databases/databases.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.backups.restore',
    {
      url: '/restore?restoreMode&backupId',
      params: {
        database: null,
        backupId: null,
      },
      views: {
        modal: {
          component: 'ovhManagerPciStoragesDatabaseBackupsRestoreComponent',
        },
      },
      layout: 'modal',
      resolve: {
        restoreMode: /* @ngInject */ ($transition$) =>
          $transition$.params().restoreMode,
        backupId: /* @ngInject */ ($transition$) =>
          $transition$.params().backupId,
        backupList: (database, DatabaseService, projectId) =>
          DatabaseService.getBackups(
            projectId,
            database.engine,
            database.id,
          ).then((backups) =>
            backups.filter((backup) => backup.status === STATUS.READY),
          ),
        breadcrumb: () => null,
        goBack: /* @ngInject */ (goBackToBackups) => goBackToBackups,
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
