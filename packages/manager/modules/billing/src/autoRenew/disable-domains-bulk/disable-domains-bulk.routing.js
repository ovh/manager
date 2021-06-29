export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.autorenew.disableDomainsBulk', {
    url: '/disable-domains-bulk',
    views: {
      modal: {
        component: 'billingAutorenewDisableDomainsBulk',
      },
    },
    layout: 'modal',
    translations: { value: ['.'], format: 'json' },
    resolve: {
      disableDomainsBulk: /* @ngInject */ (BillingAutoRenew) => () =>
        BillingAutoRenew.disableAutoRenewForDomains(),
      goBack: /* @ngInject */ (goToAutorenew) => goToAutorenew,
      breadcrumb: () => null,
    },
  });
};
