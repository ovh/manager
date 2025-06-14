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
      agreements: /* @ngInject */ (
        $transition$,
        UserAccountServicesAgreements,
      ) =>
        $transition$.params().agreements ||
        UserAccountServicesAgreements.getToValidate().then(
          (result) => result.list.results,
        ),
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
      breadcrumb: () => null,
    },
  });
};
