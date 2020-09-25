export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.operation', {
    url: '/operation',
    reloadOnSearch: false,
    views: {
      pccView: 'ovhManagerPccOperation',
    },
    resolve: {
      goToExecutionDateEdit: /* @ngInject */ ($state, productId) => (task) =>
        $state.go('app.managedBaremetal.operation.execution-date-edit', {
          productId,
          operationToEdit: task,
        }),
    },
  });
};
