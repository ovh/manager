import { RESTORE_MODES } from '../fork.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.backups.fork.command',
    {
      url: '/command',
      views: {
        modal: {
          component: 'ovhManagerPciStoragesDatabaseBackupsForkCommandComponent',
        },
      },
      params: {
        data: null,
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        data: /* @ngInject */ ($transition$) => $transition$.params().data,
        restoreMode: /* @ngInject */ ($transition$) =>
          $transition$.params().restoreMode,
        backupId: /* @ngInject */ ($transition$) =>
          $transition$.params().backupId,
        goBack: /* @ngInject */ ($state, backupId) => () => {
          const stateparams = {
            restoreMode: RESTORE_MODES.SOONEST,
          };
          if (backupId) {
            stateparams.restoreMode = RESTORE_MODES.BACKUP;
            stateparams.backupId = backupId;
          }
          return $state.go(
            'pci.projects.project.storages.databases.dashboard.backups.fork',
            stateparams,
          );
        },
      },
    },
  );
};
