export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.dashboard.migrate.confirm', {
    url: '/migrate',
    views: {
      modal: {
        component: 'ovhManagerVpsDashboardMigrateVpsConfirm',
      },
    },
    resolve: {
      migrationConfirmTrackingPrefix: /* @ngInject */ (vpsMigration) => {
        return `vps::vps-migration-confirmation::from_${vpsMigration.currentPlan}_to_${vpsMigration.newPlan}`;
      },
    },
    layout: 'modal',
  });
};
