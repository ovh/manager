export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedCloud.details.license', {
    url: '/license',
    views: {
      pccView: 'ovhManagerPccLicense',
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
