import controller from './billing-credits.controller';
import template from './billing-credits.html';

export default /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
  const name = 'app.account.billing.payment.credits';

  $stateProvider.state(name, {
    url: '/credits',
    template,
    controller,
    controllerAs: '$ctrl',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('billing_payment_credits'),
    },
  });

  $urlRouterProvider.when(/^\/billing\/credits/, ($location, $state) =>
    $state.go(name),
  );
};
