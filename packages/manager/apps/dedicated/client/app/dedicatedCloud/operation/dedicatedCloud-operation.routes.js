export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedCloud.details.operation', {
    url: '/operation',
    reloadOnSearch: false,
    views: {
      pccView: 'ovhManagerPccOperation',
    },
    resolve: {
      goToExecutionDateEdit: /* @ngInject */ ($state, productId) => (task) =>
        $state.go('app.dedicatedCloud.details.operation.execution-date-edit', {
          productId,
          operationToEdit: task,
        }),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dedicated_cloud_operation'),
    },
  });
};
