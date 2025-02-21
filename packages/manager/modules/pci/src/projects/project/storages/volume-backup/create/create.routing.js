import {
  GUIDES,
  GUIDES_STORAGES_VOLUME_BACKUP_OVERVIEW,
  VOLUME_BACKUP_ROUTES,
  VOLUME_BACKUP_TRACKING,
} from '../volume-backup.constants';
import { PCI_FEATURES_STATES } from '../../../../projects.constant';
import { VOLUMES_OPTIONS } from './create.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(VOLUME_BACKUP_ROUTES.CREATE.STATE, {
    url: VOLUME_BACKUP_ROUTES.CREATE.URL,
    views: {
      volumeBackupView:
        'ovhManagerPciProjectsProjectStoragesVolumeBackupCreate',
    },
    atInternet: {
      rename: VOLUME_BACKUP_TRACKING.CREATE.PAGE,
    },
    params: {
      volume: null,
      volumeOption: null,
      backupName: null,
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant(
          'pci_projects_project_storages_volume_backup_create_breadcrumb',
        ),

      messageContainer: () => VOLUME_BACKUP_ROUTES.CREATE.STATE,

      preselectedVolume: /* @ngInject */ ($transition$) => {
        return $transition$.params().volume;
      },

      preselectedVolumeId: /* @ngInject */ ($transition$) => {
        return $transition$.params().volumeId;
      },

      preselectedVolumeOption: /* @ngInject */ ($transition$) =>
        VOLUMES_OPTIONS.find(
          ({ id }) => id === $transition$.params().volumeOption,
        ),

      prefilledBackupName: /* @ngInject */ ($transition$) =>
        $transition$.params().backupName,

      volumeBackupModel: /* @ngInject */ (
        preselectedVolume,
        preselectedVolumeId,
        preselectedVolumeOption,
        prefilledBackupName,
        volumes,
      ) => {
        const volume =
          preselectedVolume ??
          volumes?.find((v) => v.id === preselectedVolumeId);
        return {
          name: prefilledBackupName || '',
          selected: {
            volume,
            volumeOption: preselectedVolumeOption || null,
          },
          volumeRelatedInstance: null,
        };
      },

      volumes: /* @ngInject */ (projectId, VolumeBackupService) => {
        return VolumeBackupService.getVolumes(projectId);
      },

      volumesAddons: /* @ngInject */ (catalog) => {
        const planCodes = VOLUMES_OPTIONS.map(({ planCode }) => planCode);

        return catalog.addons.filter(({ planCode }) => {
          return planCodes.some((p) => planCode.startsWith(p));
        });
      },

      knowMoreAboutBackupLink: /* @ngInject */ (coreConfig) => {
        const guide =
          GUIDES.find(
            ({ id }) => id === GUIDES_STORAGES_VOLUME_BACKUP_OVERVIEW,
          ) || {};
        return (
          guide.links[coreConfig.getUser().ovhSubsidiary] || guide.links.DEFAULT
        );
      },

      attachVolumeToInstanceLink: /* @ngInject */ (projectId, $state) => {
        return $state.href(
          VOLUME_BACKUP_ROUTES.LIST.ROUTES.ATTACH_VOLUME.STATE,
          {
            projectId,
          },
        );
      },

      createBlockStorageVolumeLink: /* @ngInject */ (projectId, $state) => {
        return $state.href(PCI_FEATURES_STATES.BLOCKS.ADD, {
          projectId,
        });
      },

      goToDetachVolume: /* @ngInject */ ($state, projectId) => (
        volume,
        volumeOption,
        backupName,
      ) => {
        return $state.go(
          VOLUME_BACKUP_ROUTES.CREATE.ROUTES.DETACH_VOLUME.STATE,
          {
            projectId,
            volume,
            volumeOption,
            backupName,
          },
        );
      },
    },
  });
};
