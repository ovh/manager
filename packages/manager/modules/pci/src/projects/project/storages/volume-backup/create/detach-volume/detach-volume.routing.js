import {
  VOLUME_BACKUP_ROUTES,
  VOLUME_BACKUP_TRACKING,
} from '../../volume-backup.constants';

const {
  DETACH_VOLUME: DETACH_VOLUME_ROUTE,
} = VOLUME_BACKUP_ROUTES.CREATE.ROUTES;

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(DETACH_VOLUME_ROUTE.STATE, {
    url: DETACH_VOLUME_ROUTE.URL,
    views: {
      modal: {
        component:
          'ovhManagerPciProjectsProjectStoragesVolumeBackupCreateDetachVolume',
      },
    },
    layout: 'modal',
    params: {
      volume: null,
      volumeOption: null,
      backupName: null,
    },
    redirectTo: (transition) => {
      return transition
        .injector()
        .getAsync('volume')
        .then((volume) =>
          volume ? false : { state: VOLUME_BACKUP_ROUTES.CREATE.STATE },
        );
    },
    atInternet: {
      rename: `${VOLUME_BACKUP_TRACKING.PREFIX}`,
    },
    resolve: {
      breadcrumb: () => null,

      volume: /* @ngInject */ ($stateParams) => $stateParams.volume,

      instance: /* @ngInject */ (projectId, volume, VolumeBackupService) =>
        VolumeBackupService.getInstanceDetails(projectId, volume.attachedTo[0]),

      goBack: /* @ngInject */ ($state) => () => $state.go('^'),
    },
  });
};
