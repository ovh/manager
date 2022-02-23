export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('identity-check.cancellation', {
    url: '/cancel',
    params: {
      procedureId: null,
    },
    views: {
      modal: {
        component: 'identityCheckFormCancellation',
      },
    },
    layout: 'modal',
    resolve: {
      hideBreadcrumb: () => true,
      procedureId: /* @ngInject */ ($transition$) =>
        $transition$.params().procedureId,
      goBack: /* @ngInject */ ($state, TucToast) => (
        message = false,
        type = 'SUCCESS',
      ) => {
        const reload = message && type === 'SUCCESS';
        const promise = $state.go(
          'identity-check',
          {},
          {
            reload,
          },
        );

        if (message) {
          promise.then(() => {
            if (type === 'SUCCESS') {
              TucToast.success(message);
            } else {
              TucToast.error(message);
            }
          });
        }

        return promise;
      },
    },
    atInternet: {
      rename: 'account-validation::cancel-validation-popup',
    },
  });
};
