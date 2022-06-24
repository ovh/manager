import { MIGRATION_STATUS } from '../vps-dashboard.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.dashboard.migrate', {
    url: '/migrate',
    views: {
      'vpsContent@vps.detail': {
        component: 'ovhManagerVpsDashboardMigrateVps',
      },
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('vpsMigration')
        .then((data) =>
          data.status !== MIGRATION_STATUS.AVAILABLE
            ? { state: 'vps.detail.dashboard' }
            : null,
        ),
    resolve: {
      model: /* @ngInject */ (newPlans) => ({
        selectedPlan: newPlans[0],
      }),
      migrationTrackingPrefix: /* @ngInject */ (vpsMigration) => {
        return `vps::vps-migration::from_${vpsMigration.plans[0].currentPlan}`;
      },
      trackPage: /* @ngInject */ (atInternet, migrationTrackingPrefix) =>
        atInternet.trackPage({
          name: migrationTrackingPrefix,
          type: 'navigation',
        }),
      goToMigrateConfirm: /* @ngInject */ (
        $state,
        atInternet,
        vpsMigration,
        migrationTrackingPrefix,
      ) => (selectedPlan) => {
        atInternet.trackClick({
          name: `${migrationTrackingPrefix}_to_${selectedPlan.planCode}::confirm`,
          type: 'action',
        });
        return $state.go('vps.detail.dashboard.migrate.confirm', {
          selectedPlan,
        });
      },
      newPlans: /* @ngInject */ (catalog, vpsMigration) => {
        return vpsMigration.plans.map((plans) =>
          catalog.plans.find(({ planCode }) => plans.newPlan === planCode),
        );
      },
      currentPrice: /* @ngInject */ (
        vpsMigrateService,
        serviceInfos,
        coreConfig,
      ) => {
        return coreConfig.isRegion('EU')
          ? vpsMigrateService.fetchCurrentPrice(serviceInfos.serviceId)
          : null;
      },
      newPrices: /* @ngInject */ (
        $q,
        vpsMigrateService,
        user,
        vpsMigration,
      ) => {
        const prices = vpsMigration.plans.map((plans) =>
          vpsMigrateService.fetchNewPrice(
            user.ovhSubsidiary,
            plans,
            vpsMigration.datacenter,
          ),
        );
        return $q.all(prices).then((data) => data);
      },
      goBackToMigrate: /* @ngInject */ ($state, CucCloudMessage) => (
        message = false,
        type = 'success',
        data,
        options = {},
      ) => {
        const state = 'vps.detail.dashboard.migrate';
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
    },
    atInternet: {
      ignore: true,
    },
  });
};
