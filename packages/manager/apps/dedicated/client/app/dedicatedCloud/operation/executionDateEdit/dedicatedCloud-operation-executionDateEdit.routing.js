export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.operation.execution-date-edit', {
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
      goBack: /* @ngInject */ ($state, $timeout, productId, Alerter) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'app.dedicatedClouds.operation',
          { productId },
          {
            reload,
          },
        );

        if (message) {
          promise.then(() =>
            $timeout(() => Alerter.set(`alert-${type}`, message, null)),
          );
        }

        return promise;
      },
      operationToEdit: /* @ngInject */ ($transition$) =>
        $transition$.params().operationToEdit,
      productId: /* @ngInject */ ($transition$) =>
        $transition$.params().productId,
    },
  });
};
