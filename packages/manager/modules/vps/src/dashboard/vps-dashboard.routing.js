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
        const promise = $state.go(state, data, options);
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

      vpsUpgradeTask: /* @ngInject */ (serviceName, vpsUpgradeTile) =>
        vpsUpgradeTile.getUpgradeTask(serviceName),

      configurationTile: /* @ngInject */ (
        availableUpgrades,
        catalog,
        stateVps, // from apiv6
        vps, // from 2api
      ) => ({
        upgrades: VpsConfigurationTile.setVps(vps, stateVps.model)
          .setAvailableUpgrades(availableUpgrades)
          .getAvailableUpgrades(catalog),
        model: {
          memory: VpsConfigurationTile.currentPlan,
          storage: VpsConfigurationTile.currentPlan,
        },
      }),

      getUpscaleHref: /* @ngInject */ ($state) => () =>
        $state.href('vps.detail.upscale'),

      goToUpgrade: /* @ngInject */ ($state) => (upgradeType) =>
        $state.go(`vps.detail.dashboard.configuration.upgrade`, {
          upgradeType,
        }),
    },
  });
};
