export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedCloud.details.dashboard.light', {
    url: '/tag/migration-vcd',
    redirectTo: (transition) => {
      return transition
        .injector()
        .getAsync('hasVCDMigration')
        .then((hasVCDMigration) => {
          if (!hasVCDMigration) {
            return 'app.dedicatedCloud.details.dashboard';
          }

          return false;
        });
    },
    resolve: {
      breadcrumb: () => null,
    },
    reloadOnSearch: false,
    component: 'pccDashboardLight',
  });
};
