export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.operation.execution-date-edit',
    {
      url: '/execution-date-edit',
      views: {
        modal: {
          component: 'ovhManagerPccOperationExecutionDateEdit',
        },
      },
      layout: 'modal',
      params: {
        operationToEdit: null,
        productId: null,
      },
      resolve: {
        goBack: /* @ngInject */ (goBackToState) => (
          message = false,
          type = 'success',
        ) =>
          goBackToState(
            'app.managedBaremetal.details.operation',
            message,
            type,
          ),
        operationToEdit: /* @ngInject */ ($transition$) =>
          $transition$.params().operationToEdit,
        breadcrumb: () => null,
      },
    },
  );
};
