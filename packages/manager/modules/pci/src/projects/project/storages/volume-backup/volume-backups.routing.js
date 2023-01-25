import { PCI_FEATURES } from '../../../projects.constant';
import VolumeBackup from './volume-backup.class';
import {
  VOLUME_BACKUP_DEFAULT_REGION,
  VOLUME_BACKUP_ROUTES,
} from './volume-backup.constants';

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
          : false,
      );
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_storages_volume_backup_title'),

      volumeBackups: /* @ngInject */ (projectId, VolumeBackupService) => {
        return VolumeBackupService.getVolumeBackups(
          projectId,
          VOLUME_BACKUP_DEFAULT_REGION,
        ).then((volumeBackups) =>
          volumeBackups.map((volumeBackup) => new VolumeBackup(volumeBackup)),
        );
      },

      volumeBackupDashboardLink: /* @ngInject */ ($state, projectId) => (
        volumeBackup,
      ) =>
        $state.href(VOLUME_BACKUP_ROUTES.DASHBOARD.STATE, {
          projectId,
          volumeBackupId: volumeBackup.id,
        }),

      goToAddVolumeBackup: /* @ngInject */ ($state, projectId) => () => {
        return $state.go(VOLUME_BACKUP_ROUTES.ADD.STATE, {
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
