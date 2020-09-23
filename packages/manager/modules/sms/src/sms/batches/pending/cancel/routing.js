import component from '../../cancel/telecom-sms-batches-cancel.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.service.batches.pending.cancel', {
    url: '/cancelBatch?batchId',
    views: {
      modal: {
        component: component.name,
      },
    },
    resolve: {
      batch: /* @ngInject */ ($transition$, batches) =>
        batches.find(({ id }) => id === $transition$.params().batchId),
      onFinish: /* @ngInject */ (
        TucToast,
        displayErrorMessage,
        displaySuccessMessage,
        goBack,
      ) => (message, isSuccess = true) => {
        const reload = message && isSuccess;

        const promise = goBack({ reload });

        if (message) {
          promise.then(() =>
            isSuccess
              ? displaySuccessMessage(message)
              : displayErrorMessage(message),
          );
        }

        return promise;
      },
    },
    layout: 'modal',
  });
};
