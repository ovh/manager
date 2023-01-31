import {
  VOLUME_BACKUP_ROUTES,
  VOLUME_BACKUP_TRACKING,
} from '../volume-backup.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(VOLUME_BACKUP_ROUTES.ONBOARDING.STATE, {
    url: VOLUME_BACKUP_ROUTES.ONBOARDING.URL,
    component: 'ovhManagerPciProjectsProjectStoragesVolumeBackupOnboarding',
    atInternet: {
      rename: `${VOLUME_BACKUP_TRACKING.PREFIX}`,
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('volumeBackups')
        .then((volumeBackups) =>
          volumeBackups.length > 0
            ? {
                state: VOLUME_BACKUP_ROUTES.ROOT.STATE,
              }
            : false,
        ),
    resolve: {
      breadcrumb: () => null, // Hide breadcrumb
    },
  });
};
