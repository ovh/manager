export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('billing.autorenew.warnNicRedirection', {
    url: '/warn-nic?nic',
    redirectTo: 'billing.autorenew.services.warnNic',
  });

  $stateProvider.state('billing.autorenew.services.warnNic', {
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
