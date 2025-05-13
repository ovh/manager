import { PCI_FEATURES_STATES } from '../../../../projects.constant';
import {
  VOLUME_BACKUP_ROUTES,
  VOLUME_BACKUP_TRACKING,
} from '../volume-backup.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(VOLUME_BACKUP_ROUTES.LIST.STATE, {
    url: VOLUME_BACKUP_ROUTES.LIST.URL,
    views: {
      volumeBackupView: 'ovhManagerPciProjectsProjectStoragesVolumeBackupList',
    },
    atInternet: {
      rename: VOLUME_BACKUP_TRACKING.LISTING.PAGE,
    },
    redirectTo: (transition) => {
      return transition
        .injector()
        .getAsync('volumeBackups')
        .then((volumeBackups) =>
          volumeBackups.length === 0
            ? { state: VOLUME_BACKUP_ROUTES.ONBOARDING.STATE }
            : false,
        );
    },
    resolve: {
      breadcrumb: () => null,

      volumeLink: /* @ngInject */ ($state, projectId) => (volumeBackup) =>
        $state.href(PCI_FEATURES_STATES.BLOCKS.LIST, {
          projectId,
          storageId: volumeBackup.volumeId,
        }),

      goToAddVolumeBackup: /* @ngInject */ ($state, projectId) => () => {
        return $state.go(VOLUME_BACKUP_ROUTES.ADD.STATE, {
          projectId,
        });
      },

      goToRestoreVolume: /* @ngInject */ ($state, projectId) => (
        volumeBackup,
      ) => {
        return $state.go(
          VOLUME_BACKUP_ROUTES.LIST.ROUTES.RESTORE_VOLUME.STATE,
          {
            projectId,
            volumeBackup,
          },
        );
      },

      goToCreateVolume: /* @ngInject */ ($state, projectId) => (
        volumeBackup,
      ) => {
        return $state.go(VOLUME_BACKUP_ROUTES.LIST.ROUTES.CREATE_VOLUME.STATE, {
          projectId,
          volumeBackupId: volumeBackup.id,
        });
      },

      goToDeleteVolumeBackup: /* @ngInject */ ($state, projectId) => (
        volumeBackup,
      ) => {
        return $state.go(VOLUME_BACKUP_ROUTES.LIST.ROUTES.DELETE.STATE, {
          projectId,
          volumeBackup,
        });
      },

      goToAddVolumeBlockStorage: /* @ngInject */ ($state, projectId) => () => {
        return $state.go(PCI_FEATURES_STATES.BLOCKS.ADD, {
          projectId,
        });
      },
    },
  });
};
