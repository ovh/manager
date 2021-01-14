import head from 'lodash/head';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.autorenew.activation', {
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
