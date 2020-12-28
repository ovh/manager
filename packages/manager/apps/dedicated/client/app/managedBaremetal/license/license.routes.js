export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.license', {
    url: '/license',
    views: {
      pccView: 'ovhManagerPccLicense',
    },
    resolve: {
      goToEnableLicense: /* @ngInject */ ($state) => () =>
        $state.go('app.managedBaremetal.license.enable'),
      goBack: /* @ngInject */ (goBackToState) => (
        message = false,
        type = 'success',
      ) => goBackToState('app.managedBaremetal.license', message, type),
    },
  });
};
