export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedCloud.details.logs', {
    url: '/logs',
    views: {
      pccView: 'ovhManagerPccLogs',
    },
    resolve: {
      goBack: /* @ngInject */ (goBackToState) => (
        message = false,
        type = 'success',
      ) => goBackToState('app.dedicatedCloud.details.logs', message, type),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dedicated_cloud_logs'),
    },
  });
};
