import controller from './billing-ovhAccount.controller';
import template from './billing-ovhAccount.html';

export default /* @ngInject */ (
  $stateProvider,
  $urlRouterProvider,
  coreConfigProvider,
) => {
  if (
    coreConfigProvider.getRegion() === 'EU' ||
    coreConfigProvider.getRegion() === 'CA'
  ) {
    const name = 'app.account.billing.payment.ovhaccount';

    $stateProvider.state(name, {
      url: '/ovhaccount',
      template,
      controller,
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('billing_payment_ovhaccount'),
      },
    });

    $urlRouterProvider.when(/^\/billing\/ovhaccount/, ($location, $state) =>
      $state.go(name),
    );
  }
};
