import component from '../../cancel/telecom-sms-batches-cancel.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.service.batches.pending.cancel', {
    params: {
      batch: {},
    },
    views: {
      modal: {
        component: component.name,
      },
    },
    resolve: {
      batch: /* @ngInject */ ($transition$) => $transition$.params().batch,
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
