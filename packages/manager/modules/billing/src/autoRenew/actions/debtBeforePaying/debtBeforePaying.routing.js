export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('billing.autorenew.payDebtRedirection', {
    url: '/pay-debt?serviceName',
    redirectTo: 'billing.autorenew.services.payDebt',
  });

  $stateProvider.state('billing.autorenew.services.payDebt', {
    url: '/pay-debt?serviceName',
    views: {
      modal: {
        component: 'billingAutorenewDebtBeforePaying',
      },
    },
    layout: 'modal',
    translations: { value: ['.'], format: 'json' },
    resolve: {
      goBack: /* @ngInject */ (goToAutorenew) => goToAutorenew,
      payDebt: /* @ngInject */ ($state, atInternet) => () => {
        atInternet.trackClick({
          name: 'autorenew::pay-debt',
          type: 'action',
          chapter1: 'dedicated',
          chapter2: 'account',
          chapter3: 'billing',
        });

        $state.go('billing.main.history');
      },
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      breadcrumb: () => null,
    },
  });
};
