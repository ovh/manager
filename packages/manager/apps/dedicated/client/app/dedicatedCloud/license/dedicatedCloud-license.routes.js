export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.license', {
    url: '/license',
    views: {
      pccView: 'ovhManagerPccLicense',
    },
    resolve: {
      goToEnableLicense: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicatedClouds.license.enable'),
      goBack: /* @ngInject */ (goBackToState) => (
        message = false,
        type = 'success',
      ) => goBackToState('app.dedicatedClouds.license', message, type),
    },
  });
};
