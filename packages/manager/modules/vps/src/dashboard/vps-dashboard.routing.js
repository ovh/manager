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
      goToSnapshotDownload: /* @ngInject */ ($state) => () =>
        $state.go('vps.detail.dashboard.snapshot-download'),
      goToTerminateOption: /* @ngInject */ ($state) => (vpsOption) =>
        $state.go('vps.detail.dashboard.terminate-option', { vpsOption }),
      goToUpgradeAdditionalDisk: /* @ngInject */ ($state) => (vpsOption) =>
        $state.go('vps.detail.dashboard.additional-disk-upgrade', {
          vpsOption,
        }),
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
        serviceInfos,
        VpsUpgradeService,
      ) =>
        isVpsNewRange
          ? VpsUpgradeService.getAvailableUpgrades(
              serviceInfos.serviceId,
            ).catch(() => null)
          : [],

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
      serviceInfos: /* @ngInject */ ($http, serviceName) =>
        $http.get(`/vps/${serviceName}/serviceInfos`).then(({ data }) => data),
      shouldReengage: /* @ngInject */ (vps) => vps.shouldReengage,
      user: /* @ngInject */ (coreConfig) => coreConfig.getUser(),
      vpsUpgradeTask: /* @ngInject */ (serviceName, VpsUpgradeService) =>
        VpsUpgradeService.getUpgradeTask(serviceName),

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

      migrationLink: /* @ngInject */ ($state, serviceName) =>
        $state.href('vps.detail.dashboard.migrate', {
          serviceName,
        }),
      goToVpsMigration: /* @ngInject */ ($state) => () =>
        $state.go('vps.detail.dashboard.migrate'),
      breadcrumb: () => null,
      trackingPrefix: () => 'vps::detail::dashboard',

      upgradableDisks: /* @ngInject */ (catalog, vpsLinkedDisk, VpsService) =>
        vpsLinkedDisk?.serviceName
          ? VpsService.getUpgradableAdditionalDisk(catalog, vpsLinkedDisk)
          : [],

      stein: /* @ngInject */ ($http, stateVps) =>
        $http
          .get('/vps/migrationStein')
          .then(({ data: steins }) =>
            steins.find(({ zone }) => zone === stateVps.zone),
          ),

      isVpsMaintenance: /* @ngInject */ (stein) => stein !== undefined,
    },
    trackPage: /* @ngInject */ (atInternet) => (hit) =>
      atInternet.trackPage({
        name: `vps${hit}`,
      }),
  });
};
