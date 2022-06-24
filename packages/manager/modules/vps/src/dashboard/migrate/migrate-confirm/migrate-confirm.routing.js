export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.dashboard.migrate.confirm', {
    url: '/migrate',
    params: {
      selectedPlan: null,
    },
    views: {
      modal: {
        component: 'ovhManagerVpsDashboardMigrateVpsConfirm',
      },
    },
    resolve: {
      selectedPlan: /* @ngInject */ ($transition$) => {
        return $transition$.params().selectedPlan;
      },
      migrationConfirmTrackingPrefix: /* @ngInject */ (
        vpsMigration,
        selectedPlan,
      ) => {
        return `vps::vps-migration-confirmation::from_${vpsMigration.plans[0].currentPlan}_to_${selectedPlan.planCode}`;
      },
    },
    layout: 'modal',
  });
};
