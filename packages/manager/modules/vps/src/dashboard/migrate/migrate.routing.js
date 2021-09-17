import find from 'lodash/find';
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
      migrationTrackingPrefix: /* @ngInject */ (vpsMigration) => {
        return `vps::vps-migration::from_${vpsMigration.currentPlan}_to_${vpsMigration.newPlan}`;
      },
      trackPage: /* @ngInject */ (atInternet, migrationTrackingPrefix) =>
        atInternet.trackPage({
          name: migrationTrackingPrefix,
          type: 'navigation',
        }),
      goToMigrateConfirm: /* @ngInject */ (
        $state,
        atInternet,
        migrationTrackingPrefix,
      ) => () => {
        atInternet.trackClick({
          name: `${migrationTrackingPrefix}::confirm`,
          type: 'action',
        });
        return $state.go('vps.detail.dashboard.migrate.confirm');
      },
      newPlan: /* @ngInject */ (catalog, vpsMigration) =>
        find(catalog.plans, { planCode: vpsMigration.newPlan }),
      currentPrice: /* @ngInject */ (
        vpsMigrateService,
        serviceInfos,
        coreConfig,
      ) => {
        return coreConfig.isRegion('EU')
          ? vpsMigrateService.fetchCurrentPrice(serviceInfos.serviceId)
          : null;
      },
      newPrice: /* @ngInject */ (
        vpsMigrateService,
        newPlan,
        user,
        vpsMigration,
      ) => {
        return vpsMigrateService.fetchNewPrice(
          newPlan,
          user.ovhSubsidiary,
          vpsMigration,
        );
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
