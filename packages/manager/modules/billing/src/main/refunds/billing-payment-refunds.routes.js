import template from './billing-refunds.html';

export default /* @ngInject */ ($stateProvider) => {
  const name = 'app.account.billing.main.refunds';

  $stateProvider.state(name, {
    url: '/refunds',
    template,
    controller: 'BillingRefundsController',
    controllerAs: '$ctrl',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('billing_payment_refunds'),
    },
  });
};
