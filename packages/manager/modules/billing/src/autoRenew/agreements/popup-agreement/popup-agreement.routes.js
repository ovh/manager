export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('billing.autorenew.agreements.popup-agreement', {
    url: '/popup-agreement?id',
    views: {
      modal: {
        component: 'billingAutorenewPopupAgreement',
      },
    },
    layout: 'modal',
    translations: { value: ['.'], format: 'json' },
    resolve: {
      goBack: /* @ngInject */ ($state, $timeout, Alerter) => (
        message = false,
        type = 'success',
        reload = false,
      ) => {
        const promise = $state.go(
          'billing.autorenew.agreements',
          {},
          {
            reload,
          },
        );

        if (message) {
          promise.then(() =>
            $timeout(() =>
              Alerter.set(`alert-${type}`, message, null, 'agreements_alerter'),
            ),
          );
        }

        return promise;
      },
      agreementId: /* @ngInject */ ($transition$) => $transition$.params().id,
      breadcrumb: () => null,
    },
  });
};
