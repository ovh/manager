import _ from 'lodash';

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
      activateAutorenew: /* @ngInject */ (
        BillingAutoRenew,
        nicRenew,
      ) => () => BillingAutoRenew.enableAutorenew(_.head(nicRenew.renewDays)),
      goBack: /* @ngInject */ goToAutorenew => goToAutorenew,
    },
  });
};
