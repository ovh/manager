export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.dashboard.migrate.confirm', {
    url: '/migrate',
    views: {
      modal: {
        component: 'ovhManagerVpsDashboardMigrateVpsConfirm',
      },
    },
    layout: 'modal',
  });
};
