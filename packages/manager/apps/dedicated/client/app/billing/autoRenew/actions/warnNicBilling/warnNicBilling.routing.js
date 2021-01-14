export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.autorenew.warnNic', {
    url: '/warn-nic?nic',
    views: {
      modal: {
        component: 'billingAutorenewWarnNicBilling',
      },
    },
    layout: 'modal',
    translations: { value: ['.'], format: 'json' },
    resolve: {
      goBack: /* @ngInject */ (goToAutorenew) => goToAutorenew,
      nic: /* @ngInject */ ($transition$) => $transition$.params().nic,
      breadcrumb: () => null,
    },
  });
};
