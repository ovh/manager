import head from 'lodash/head';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('billing.autorenew.activationRedirection', {
    url: '/activate',
    redirectTo: 'billing.autorenew.services.activation',
  });

  $stateProvider.state('billing.autorenew.services.activation', {
    url: '/activate',
    views: {
      modal: {
        component: 'billingAutorenewActivation',
      },
    },
    layout: 'modal',
    translations: { value: ['.'], format: 'json' },
    resolve: {
      activateAutorenew: /* @ngInject */ (BillingAutoRenew, nicRenew) => () =>
        BillingAutoRenew.enableAutorenew(head(nicRenew.renewDays)),
      goBack: /* @ngInject */ (goToAutorenew) => goToAutorenew,
      breadcrumb: () => null,
    },
  });
};
