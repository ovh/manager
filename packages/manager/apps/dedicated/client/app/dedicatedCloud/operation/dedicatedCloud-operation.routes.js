export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.operation', {
    url: '/operation',
    reloadOnSearch: false,
    views: {
      pccView: 'ovhManagerPccOperation',
    },
    resolve: {
      goToExecutionDateEdit: /* @ngInject */ ($state, productId) => (task) =>
        $state.go('app.dedicatedClouds.operation.execution-date-edit', {
          productId,
          operationToEdit: task,
        }),
    },
  });
};
