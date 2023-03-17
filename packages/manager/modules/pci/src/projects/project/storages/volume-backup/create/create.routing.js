import {
  GUIDES,
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
      rename: `${VOLUME_BACKUP_TRACKING.PREFIX}`,
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

      preselectedVolume: /* @ngInject */ ($transition$) =>
        $transition$.params().volume,

      preselectedVolumeOption: /* @ngInject */ ($transition$) =>
        VOLUMES_OPTIONS.find(
          ({ id }) => id === $transition$.params().volumeOption,
        ),

      prefilledBackupName: /* @ngInject */ ($transition$) =>
        $transition$.params().backupName,

      volumeBackupModel: /* @ngInject */ (
        preselectedVolume,
        preselectedVolumeOption,
        prefilledBackupName,
      ) => ({
        name: prefilledBackupName || '',
        selected: {
          volume: preselectedVolume || null,
          volumeOption: preselectedVolumeOption || null,
        },
        volumeRelatedInstance: null,
      }),

      volumes: /* @ngInject */ (projectId, VolumeBackupService) => {
        return VolumeBackupService.getVolumes(projectId);
      },

      volumesAddons: /* @ngInject */ (catalog) => {
        const planCodes = VOLUMES_OPTIONS.map(({ planCode }) => planCode);

        return catalog.addons.filter(({ planCode }) => {
          return planCodes.includes(planCode);
        });
      },

      knowMoreAboutBackupLink: /* @ngInject */ (coreConfig) => {
        return GUIDES.find((guide) => guide.id === 'storages_overview').links[
          coreConfig.getUser().ovhSubsidiary
        ];
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
