import VolumeBackup from './volume-backup.class';
import { PCI_FEATURES, PCI_FEATURES_STATES } from '../../../projects.constant';
import {
  GUIDES,
  VOLUME_BACKUP_ROUTES,
  VOLUME_BACKUP_TRACKING,
} from './volume-backup.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(VOLUME_BACKUP_ROUTES.ROOT.STATE, {
    url: VOLUME_BACKUP_ROUTES.ROOT.URL,
    component: 'ovhManagerPciProjectsProjectStoragesVolumeBackup',
    params: {
      volumeDetached: null,
      instanceDetached: null,
    },
    onEnter: /* @ngInject */ (pciFeatureRedirect) => {
      return pciFeatureRedirect(PCI_FEATURES.PRODUCTS.VOLUME_BACKUP);
    },
    redirectTo: (transition) => {
      return Promise.all([
        transition.injector().getAsync('volumeBackups'),
      ]).then(([volumeBackups]) =>
        volumeBackups.length === 0
          ? { state: VOLUME_BACKUP_ROUTES.ONBOARDING.STATE }
          : { state: VOLUME_BACKUP_ROUTES.LIST.STATE },
      );
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant(
          'pci_projects_project_storages_volume_backup_breadcrumb',
        ),

      guides: /* @ngInject */ (coreConfig, $translate) => {
        return GUIDES.reduce(
          (list, guide) => [
            ...list,
            {
              ...guide,
              title: $translate.instant(
                `pci_projects_project_storages_volume_backup_guides_${guide.id}_title`,
              ),
              description: $translate.instant(
                `pci_projects_project_storages_volume_backup_guides_${guide.id}_description`,
              ),
              link:
                guide.links[coreConfig.getUser()?.ovhSubsidiary] ||
                guide.links.DEFAULT,
            },
          ],
          [],
        );
      },

      catalog: /* @ngInject */ ($http, coreConfig, catalogEndpoint) =>
        $http
          .get(
            `${catalogEndpoint}?ovhSubsidiary=${
              coreConfig.getUser().ovhSubsidiary
            }`,
          )
          .then(({ data }) => data),

      volumeBackups: /* @ngInject */ (projectId, VolumeBackupService) => {
        return VolumeBackupService.getVolumeBackupsOnAllRegions(
          projectId,
        ).then(({ resources }) =>
          resources.map((volumeBackup) => new VolumeBackup(volumeBackup)),
        );
      },

      volumeDetached: /* @ngInject */ ($stateParams) =>
        $stateParams.volumeDetached,

      instanceDetached: /* @ngInject */ ($stateParams) =>
        $stateParams.instanceDetached,

      startPolling: /* @ngInject */ (
        projectId,
        volumeBackups,
        VolumeBackupService,
      ) => () => {
        volumeBackups.forEach((volumeBackupInstance) => {
          if (volumeBackupInstance.isPendingStatus) {
            VolumeBackupService.startVolumeBackupPolling(
              projectId,
              volumeBackupInstance.region,
              volumeBackupInstance.id,
            )
              .then(() => {
                return VolumeBackupService.getVolumeBackup(
                  projectId,
                  volumeBackupInstance.region,
                  volumeBackupInstance.id,
                );
              })
              .then((volumeBackup) =>
                volumeBackupInstance.updateData(volumeBackup),
              )
              .catch(({ status }) => {
                if (status === 404) {
                  volumeBackups.splice(
                    volumeBackups.indexOf(volumeBackupInstance),
                    1,
                  );
                }
              });
          }
        });
      },

      stopPolling: /* @ngInject */ (
        projectId,
        volumeBackups,
        VolumeBackupService,
      ) => () =>
        volumeBackups.forEach((volumeBackup) =>
          VolumeBackupService.stopVolumeBackupPolling(
            projectId,
            volumeBackup.region,
            volumeBackup.id,
          ),
        ),

      buildTaskResponse: () => (type, message) => {
        return {
          cucCloudParams: {
            type,
            message: {
              textHtml: message,
            },
          },
        };
      },

      goToVolumeBackups: /* @ngInject */ (
        $state,
        CucCloudMessage,
        projectId,
      ) => (message = false, type = 'success', params = {}) => {
        const reload = message && type === 'success';
        const state = VOLUME_BACKUP_ROUTES.LIST.STATE;

        const promise = $state.go(
          state,
          {
            projectId,
            ...params,
          },
          {
            reload,
          },
        );

        if (message) {
          promise.then(() => CucCloudMessage[type](message, state));
        }

        return promise;
      },

      goToCreateVolumeBackup: /* @ngInject */ ($state, projectId) => () => {
        return $state.go(VOLUME_BACKUP_ROUTES.CREATE.STATE, {
          projectId,
        });
      },

      goBack: /* @ngInject */ (goToVolumeBackups) => (message, type) =>
        goToVolumeBackups(message, type),

      goToVolumeBlockStorage: /* @ngInject */ ($state, projectId) => (
        taskResponse,
      ) => {
        return $state.go(PCI_FEATURES_STATES.BLOCKS.LIST, {
          projectId,
          taskResponse,
        });
      },

      volumeBlockStorageLink: /* @ngInject */ ($state, projectId) => {
        return $state.href(PCI_FEATURES_STATES.BLOCKS.LIST, {
          projectId,
        });
      },

      volumeSnapshotStorageLink: /* @ngInject */ ($state, projectId) => {
        return $state.href(PCI_FEATURES_STATES.SNAPSHOTS.LIST, {
          projectId,
        });
      },

      goToSnapshots: /* @ngInject */ ($state, projectId) => (taskResponse) => {
        return $state.go(PCI_FEATURES_STATES.SNAPSHOTS.LIST, {
          projectId,
          taskResponse,
        });
      },

      reloadState: /* @ngInject */ ($state) => () => {
        $state.go($state.current, {}, { reload: true });
      },

      messageContainer: () => VOLUME_BACKUP_ROUTES.ROOT.STATE,

      onDocumentationClick: /* @ngInject */ (trackClick) => (guide) => {
        return trackClick(`${VOLUME_BACKUP_TRACKING.GUIDES}_${guide.id}`);
      },

      trackClick: /* @ngInject */ (atInternet) => (hit, type = 'action') => {
        return atInternet.trackClick({
          name: hit,
          type,
        });
      },

      trackPage: /* @ngInject */ (atInternet) => (hit) => {
        return atInternet.trackPage({
          name: hit,
        });
      },
    },
  });
};
