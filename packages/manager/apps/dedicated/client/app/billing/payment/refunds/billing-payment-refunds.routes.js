import controller from './billing-refunds.controller';
import template from './billing-refunds.html';

export default /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
  const name = 'app.account.billing.payment.refunds';

  $stateProvider.state(name, {
    url: '/refunds',
    template,
    controller,
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('billing_payment_refunds'),
    },
  });

  $urlRouterProvider.when(/^\/billing\/refunds/, ($location, $state) =>
    $state.go(name),
  );
};
