import head from 'lodash/head';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('billing.autorenew.agreements.popup-agreement', {
    url: '/popup-agreement',
    views: {
      modal: {
        component: 'billingAutorenewPopupAgreement',
      },
    },
    params: {
      agreements: null,
    },
    layout: 'modal',
    translations: { value: ['.'], format: 'json' },
    resolve: {
      activateAutorenew: /* @ngInject */ (BillingAutoRenew, nicRenew) => () =>
        BillingAutoRenew.enableAutorenew(head(nicRenew.renewDays)),
      agreements: /* @ngInject */ ($transition$) =>
        $transition$.params().agreements,
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
    },
  });
};
