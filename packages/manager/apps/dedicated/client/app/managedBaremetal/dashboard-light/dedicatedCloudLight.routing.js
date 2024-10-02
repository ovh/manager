export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.details.dashboard.light', {
    url: '/tag/migration-vcd',
    redirectTo: (transition) => {
      return transition
        .injector()
        .getAsync('hasVCDMigration')
        .then((hasVCDMigration) => {
          if (!hasVCDMigration) {
            return 'app.managedBaremetal.details.dashboard';
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
