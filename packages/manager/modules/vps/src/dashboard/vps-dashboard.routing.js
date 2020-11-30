import assign from 'lodash/assign';
import filter from 'lodash/filter';
import get from 'lodash/get';
import head from 'lodash/head';

import {
  DASHBOARD_FEATURES,
  VPS_2014_AUTO_MIGRATION_DATE,
} from './vps-dashboard.constants';
import { MIGRATION_STATUS } from '../migration/vps-migration.constants';
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
          upgrades: tile.getAvailableUpgrades(),
          model: {
            memory: tile.currentPlan,
            storage: tile.currentPlan,
          },
        };
      },

      getUpscaleHref: /* @ngInject */ ($state) => () =>
        $state.href('vps.detail.upscale'),

      goToUpgrade: /* @ngInject */ ($state) => (upgradeType) =>
        $state.go(`vps.detail.dashboard.configuration.upgrade`, {
          upgradeType,
        }),

      vpsMigration: /* @ngInject */ ($http, serviceName) =>
        $http.get(`/vps/${serviceName}/migration2014`),

      canScheduleMigration: /* @ngInject */ (vpsMigration) =>
        get(vpsMigration, 'data.status') === MIGRATION_STATUS.TO_PLAN &&
        moment().isBefore(moment(VPS_2014_AUTO_MIGRATION_DATE, 'DD/MM/YYYY')),

      goToVpsMigration: /* @ngInject */ (
        $state,
        vpsMigration,
        catalog,
        stateVps,
        VpsMigrationService,
      ) => () => {
        const migrationPlan = VpsMigrationService.constructor.getMigrationPlan(
          catalog,
          vpsMigration.data.model,
        );
        const server = assign({
          displayName: stateVps.displayName,
          name: stateVps.name,
          description: VpsMigrationService.getVpsModelDescription(
            stateVps.model,
          ),
          migration: VpsMigrationService.constructor.populateOptionsPrice(
            vpsMigration.data,
            catalog,
          ),
          migrationPlan,
          migrationDescription: VpsMigrationService.getVpsModelDescription(
            migrationPlan.description,
          ),
        });
        return $state.go(`vps.detail.dashboard.schedule`, {
          servers: [server],
        });
      },
    },
  });
};
