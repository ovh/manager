import {
  VOLUME_BACKUP_ROUTES,
  VOLUME_BACKUP_TRACKING,
} from '../../volume-backup.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(VOLUME_BACKUP_ROUTES.LIST.ROUTES.DELETE.STATE, {
    url: VOLUME_BACKUP_ROUTES.LIST.ROUTES.DELETE.URL,
    views: {
      modal: {
        component: 'ovhManagerPciProjectsProjectStoragesVolumeBackupListDelete',
      },
    },
    layout: 'modal',
    params: {
      volumeBackup: null,
    },
    atInternet: {
      rename: VOLUME_BACKUP_TRACKING.DELETE_BACKUP.PAGE,
    },
    redirectTo: (transition) => {
      return transition
        .injector()
        .getAsync('volumeBackup')
        .then((volumeBackup) =>
          volumeBackup ? false : { state: VOLUME_BACKUP_ROUTES.LIST.STATE },
        );
    },
    resolve: {
      breadcrumb: () => null,

      volumeBackup: /* @ngInject */ ($stateParams) => $stateParams.volumeBackup,

      goBack: /* @ngInject */ ($state) => () => $state.go('^'),
    },
  });
};
