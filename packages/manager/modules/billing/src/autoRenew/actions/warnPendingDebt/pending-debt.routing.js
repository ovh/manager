export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('billing.autorenew.pendingDebtRedirection', {
    url: '/warn-debt?serviceName',
    redirectTo: 'billing.autorenew.services.pendingDebt',
  });

  $stateProvider.state('billing.autorenew.services.pendingDebt', {
    url: '/warn-debt?serviceName',
    views: {
      modal: {
        component: 'billingAutorenewWarnPendingDebt',
      },
    },
    layout: 'modal',
    translations: { value: ['.'], format: 'json' },
    resolve: {
      goBack: /* @ngInject */ (goToAutorenew) => goToAutorenew,
      payDebt: /* @ngInject */ ($state) => () => {
        $state.go('billing.main.history');
      },
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      breadcrumb: () => null,
    },
  });
};
