import {
  VOLUME_BACKUP_ROUTES,
  VOLUME_BACKUP_TRACKING,
} from '../volume-backup.constants';
import { PCI_FEATURES_STATES } from '../../../../projects.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(VOLUME_BACKUP_ROUTES.LIST.STATE, {
    url: VOLUME_BACKUP_ROUTES.LIST.URL,
    component: 'ovhManagerPciProjectsProjectStoragesVolumeBackupList',
    atInternet: {
      rename: `${VOLUME_BACKUP_TRACKING.PREFIX}`,
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

      goToRestoreVolume: /* @ngInject */ ($state, projectId) => () => {
        return $state.go(VOLUME_BACKUP_ROUTES.ADD.STATE, {
          projectId,
        });
      },

      goToDeleteVolume: /* @ngInject */ ($state, projectId) => () => {
        return $state.go(VOLUME_BACKUP_ROUTES.LIST.ROUTES.DELETE.STATE, {
          projectId,
        });
      },
    },
  });
};
