export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.details.dashboard-light', {
    url: '/migration-vcd',
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
      associateIpBlockLink: /* @ngInject */ ($state) => () =>
        $state.href(
          'app.managedBaremetal.details.dashboard-light.associate-ip-bloc',
        ),
    },
    reloadOnSearch: false,
    views: {
      pccView: 'pccDashboardLight',
    },
  });
};
