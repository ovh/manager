import find from 'lodash/find';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.dashboard.migrate', {
    url: '/migrate',
    views: {
      'vpsContent@vps.detail': {
        component: 'ovhManagerVpsDashboardMigrateVps',
      },
    },
    resolve: {
      goToMigrateConfirm: /* @ngInject */ ($state) => () =>
        $state.go('vps.detail.dashboard.migrate.confirm'),
      newPlan: /* @ngInject */ (catalog, vpsMigration) =>
        find(catalog.plans, { planCode: vpsMigration.newPlan }),
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
  });
};
