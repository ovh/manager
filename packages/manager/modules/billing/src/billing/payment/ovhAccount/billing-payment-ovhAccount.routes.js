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
      controller: 'Billing.controllers.OvhAccount',
    });

    $urlRouterProvider.when(/^\/billing\/ovhaccount/, ($location, $state) =>
      $state.go(name),
    );
  }
};
