import VolumeBackup from './volume-backup.class';
import { PCI_FEATURES, PCI_FEATURES_STATES } from '../../../projects.constant';
import { GUIDES, VOLUME_BACKUP_ROUTES } from './volume-backup.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(VOLUME_BACKUP_ROUTES.ROOT.STATE, {
    url: VOLUME_BACKUP_ROUTES.ROOT.URL,
    component: 'ovhManagerPciProjectsProjectStoragesVolumeBackup',
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

      volumeBackups: /* @ngInject */ (projectId, VolumeBackupService) => {
        return VolumeBackupService.getVolumeBackupsOnAllRegions(
          projectId,
        ).then(({ resources }) =>
          resources.map((volumeBackup) => new VolumeBackup(volumeBackup)),
        );
      },

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
            ).then(
              // success function, then update volumeBackup instance
              (volumeBackup) => volumeBackupInstance.updateData(volumeBackup),
              // if error occurred, then delete volumeBackup
              () =>
                volumeBackups.splice(
                  volumeBackups.indexOf(volumeBackupInstance),
                  1,
                ),
            );
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

      goToAddVolumeBlockStorage: /* @ngInject */ ($state, projectId) => () => {
        return $state.go(PCI_FEATURES_STATES.BLOCKS.ADD, {
          projectId,
        });
      },

      goToVolumeBackups: ($state, CucCloudMessage, projectId) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';
        const state = VOLUME_BACKUP_ROUTES.ROOT.STATE;

        const promise = $state.go(
          state,
          {
            projectId,
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

      goBack: /* @ngInject */ (goToVolumeBackups) => (message, type) =>
        goToVolumeBackups(message, type),

      reloadState: /* @ngInject */ ($state) => () => {
        $state.go($state.current, {}, { reload: true });
      },

      messageContainer: () => 'pci.projects.project.storages.volume-backup',

      volumeBackupTrackPrefix: () =>
        'PublicCloud::pci::projects::project::storages::volume-backup',

      trackClick: /* @ngInject */ (atInternet) => (hit, type = 'action') => {
        atInternet.trackClick({
          name: hit,
          type,
        });
      },

      trackPage: /* @ngInject */ (atInternet) => (hit) => {
        atInternet.trackPage({
          name: hit,
        });
      },
    },
  });
};
