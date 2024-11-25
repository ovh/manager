export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedCloud.details.license', {
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
            ? 'app.dedicatedCloud.details.dashboard-light'
            : false,
        );
    },
    resolve: {
      goToEnableLicense: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicatedCloud.details.license.enable'),
      goBack: /* @ngInject */ (goBackToState) => (
        message = false,
        type = 'success',
      ) => goBackToState('app.dedicatedCloud.details.license', message, type),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dedicated_cloud_license'),
    },
  });
};
