export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.details.license', {
    url: '/license',
    views: {
      pccView: 'ovhManagerPccLicense',
    },
    redirectTo: (transition) => {
      return transition
        .injector()
        .getAsync('hasVCDMigration')
        .then((hasVCDMigration) =>
          hasVCDMigration
            ? 'app.managedBaremetal.details.dashboard-light'
            : false,
        );
    },
    resolve: {
      goToEnableLicense: /* @ngInject */ ($state) => () =>
        $state.go('app.managedBaremetal.details.license.enable'),
      goBack: /* @ngInject */ (goBackToState) => (
        message = false,
        type = 'success',
      ) => goBackToState('app.managedBaremetal.details.license', message, type),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('managed_baremetal_license'),
    },
  });
};
