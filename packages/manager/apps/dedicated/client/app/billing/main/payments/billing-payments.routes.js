import controller from './billing-payments.controller';
import template from './billing-payments.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.main.payments', {
    url: '/payments',
    template,
    controller,
    controllerAs: '$ctrl',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('billing_main_payments_title'),
    },
  });
};
