export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.autorenew.pendingDebt', {
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
        $state.go('app.account.billing.main.history');
      },
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      breadcrumb: () => null,
    },
  });
};
