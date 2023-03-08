import {
  VOLUME_BACKUP_ROUTES,
  VOLUME_BACKUP_TRACKING,
} from '../volume-backup.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(VOLUME_BACKUP_ROUTES.CREATE.STATE, {
    url: VOLUME_BACKUP_ROUTES.CREATE.URL,
    views: {
      volumeBackupView:
        'ovhManagerPciProjectsProjectStoragesVolumeBackupCreate',
    },
    atInternet: {
      rename: `${VOLUME_BACKUP_TRACKING.PREFIX}`,
    },
    params: {
      volume: null,
      volumeOption: null,
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant(
          'pci_projects_project_storages_volume_backup_create_breadcrumb',
        ),

      messageContainer: () => VOLUME_BACKUP_ROUTES.CREATE.STATE,

      preselectedVolume: /* @ngInject */ ($transition$) =>
        $transition$.params().volume,

      preselectedVolumeOption: /* @ngInject */ ($transition$) =>
        $transition$.params().volumeOption,

      volumeBackupModel: /* @ngInject */ (
        preselectedVolume,
        preselectedVolumeOption,
      ) => ({
        selected: {
          volume: preselectedVolume || null,
          volumeOption: preselectedVolumeOption || null,
        },
        volumeRelatedInstance: null,
        name: '',
      }),

      volumes: /* @ngInject */ (projectId, VolumeBackupService) => {
        return VolumeBackupService.getVolumes(projectId);
      },

      attachVolumeToInstanceLink: /* @ngInject */ (projectId, $state) => {
        return $state.href(
          VOLUME_BACKUP_ROUTES.LIST.ROUTES.ATTACH_VOLUME.STATE,
          {
            projectId,
          },
        );
      },

      goToDetachVolume: /* @ngInject */ ($state, projectId) => (
        volume,
        volumeOption,
      ) => {
        return $state.go(
          VOLUME_BACKUP_ROUTES.CREATE.ROUTES.DETACH_VOLUME.STATE,
          {
            projectId,
            volume,
            volumeOption,
          },
        );
      },
    },
  });
};
