export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.details.license', {
    url: '/license',
    views: {
      pccView: 'ovhManagerPccLicense',
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
