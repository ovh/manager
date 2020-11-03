import template from './billing-vouchers.html';

export default /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
  const name = 'app.account.billing.payment.vouchers';

  $stateProvider.state(name, {
    url: '/vouchers',
    template,
    controller: 'Billing.controllers.Vouchers',
  });

  $urlRouterProvider.when(/^\/billing\/vouchers/, ($location, $state) =>
    $state.go(name),
  );
};
