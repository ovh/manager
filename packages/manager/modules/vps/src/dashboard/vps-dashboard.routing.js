import filter from 'lodash/filter';
import head from 'lodash/head';
import 'moment';

import { DASHBOARD_FEATURES } from './vps-dashboard.constants';
import component from './vps-dashboard.component';

import VpsConfigurationTile from './tile/configuration/service';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.dashboard', {
    url: '/dashboard',
    views: {
      'vpsContent@vps.detail': {
        component: component.name,
      },
      'configurationTile@vps.detail.dashboard': 'vpsDashboardTileConfiguration',
    },
    resolve: {
      features: /* @ngInject */ (capabilities) =>
        Object.values(DASHBOARD_FEATURES).filter((feature) =>
          capabilities.includes(feature),
        ),
      goToDisplayIps: /* @ngInject */ ($state) => () =>
        $state.go('vps.detail.dashboard.display-ips'),
      goToKvm: /* @ngInject */ ($state) => (noVnc) =>
        $state.go('vps.detail.dashboard.kvm', { noVnc }),
      goToReboot: /* @ngInject */ ($state) => () =>
        $state.go('vps.detail.dashboard.reboot'),
      goToRebootRescue: /* @ngInject */ ($state) => () =>
        $state.go('vps.detail.dashboard.reboot-rescue'),
      goToReinstall: /* @ngInject */ ($state) => () =>
        $state.go('vps.detail.dashboard.reinstall'),
      goToReverseDns: /* @ngInject */ ($state) => () =>
        $state.go('vps.detail.dashboard.reverse-dns'),
      goToSnapshotDelete: /* @ngInject */ ($state) => () =>
        $state.go('vps.detail.dashboard.snapshot-delete'),
      goToSnapshotTake: /* @ngInject */ ($state) => () =>
        $state.go('vps.detail.dashboard.snapshot-take'),
      goToSnapshotRestore: /* @ngInject */ ($state) => () =>
        $state.go('vps.detail.dashboard.snapshot-restore'),
      goToTerminateOption: /* @ngInject */ ($state) => (vpsOption) =>
        $state.go('vps.detail.dashboard.terminate-option', { vpsOption }),
      goToMonitoringSla: /* @ngInject */ ($state) => (view, state) => {
        const preview = view || false;
        return $state.go('vps.detail.dashboard.monitoring-sla', {
          preview,
          state,
        });
      },
      goBack: /* @ngInject */ ($state, CucCloudMessage) => (
        message = false,
        type = 'success',
        data,
        options = {},
      ) => {
        const state = 'vps.detail.dashboard';
        const promise = $state.go(state, data, {
          reload: message && type === 'success',
          ...options,
        });
        if (message) {
          promise.then(() => {
            CucCloudMessage[type]({ textHtml: message }, state);
          });
        }
        return promise;
      },

      availableUpgrades: /* @ngInject */ (
        isVpsNewRange,
        serviceName,
        vpsUpgradeTile,
      ) =>
        isVpsNewRange ? vpsUpgradeTile.getAvailableUpgrades(serviceName) : [],

      isCommitmentAvailable: /* @ngInject */ (ovhFeatureFlipping) =>
        ovhFeatureFlipping
          .checkFeatureAvailability(['billing:commitment'])
          .then((commitmentAvailability) =>
            commitmentAvailability.isFeatureAvailable('billing:commitment'),
          )
          .catch(() => false),
      goToCommit: /* @ngInject */ ($state) => () =>
        $state.href('vps.detail.dashboard.commitment'),
      goToCancelCommit: /* @ngInject */ ($state) => () =>
        $state.href('vps.detail.dashboard.cancel-commitment'),
      goToCancelResiliation: /* @ngInject */ ($state) => () =>
        $state.href('vps.detail.dashboard.cancel-resiliation'),
      goToResiliation: /* @ngInject */ ($state) => () =>
        $state.href('vps.detail.dashboard.resiliation'),
      shouldReengage: /* @ngInject */ (vps) => vps.shouldReengage,
      user: /* @ngInject */ (OvhApiMe) => OvhApiMe.v6().get().$promise,
      vpsUpgradeTask: /* @ngInject */ (serviceName, vpsUpgradeTile) =>
        vpsUpgradeTile.getUpgradeTask(serviceName),

      vpsMigrationTask: /* @ngInject */ (serviceName, VpsTaskService) =>
        VpsTaskService.getPendingTasks(serviceName, 'migrate').then((tasks) =>
          head(tasks),
        ),

      vpsMigrationTaskInError: /* @ngInject */ (serviceName, VpsService) =>
        VpsService.getTaskInError(serviceName).then((tasks) =>
          head(filter(tasks, { type: 'migrate' })),
        ),
      configurationTile: /* @ngInject */ (
        availableUpgrades,
        catalog,
        stateVps, // from apiv6
        vps, // from 2api
      ) => {
        const tile = new VpsConfigurationTile(
          vps,
          stateVps.model,
          catalog,
          availableUpgrades,
        );
        return {
          currentPlan: tile.currentPlan,
          isUpfront: tile.isUpfront,
          upgrades: tile.getAvailableUpgrades(),
          model: {
            memory: tile.currentPlan,
            storage: tile.currentPlan,
          },
        };
      },

      getUpscaleHref: /* @ngInject */ ($state) => () =>
        $state.href('vps.detail.upscale'),

      goToUpgrade: /* @ngInject */ ($state, stateVps) => (upgradeType) => {
        let from = 0;
        if (upgradeType === 'memory') {
          from = stateVps.model[upgradeType] / 1024;
        } else if (upgradeType === 'storage') {
          from = stateVps.model.disk;
        }
        const to = from * 2;
        return $state.go(`vps.detail.dashboard.configuration.upgrade`, {
          upgradeType,
          from,
          to,
        });
      },

      vpsMigration: /* @ngInject */ ($http, serviceName) =>
        $http
          .get(`/vps/${serviceName}/migration2016`)
          .then(({ data }) => data)
          .catch(() => false),
      migrationLink: /* @ngInject */ ($state, serviceName) =>
        $state.href('vps.detail.dashboard.migrate', {
          serviceName,
        }),
      goToVpsMigration: /* @ngInject */ ($state) => () =>
        $state.go('vps.detail.dashboard.migrate'),
      breadcrumb: () => null,
      trackingPrefix: () => 'vps::detail::dashboard',
      canDisplayVpsAnnouncementBanner: /* @ngInject */ (ovhFeatureFlipping) => {
        const vpsAnnouncementBannerId = 'vps:vps-announcement-banner';
        return ovhFeatureFlipping
          .checkFeatureAvailability(vpsAnnouncementBannerId)
          .then((newRegionFeature) =>
            newRegionFeature.isFeatureAvailable(vpsAnnouncementBannerId),
          );
      },
    },
  });
};
