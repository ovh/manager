import template from './billing-refunds.html';

export default /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
  const name = 'app.account.billing.payment.refunds';

  $stateProvider.state(name, {
    url: '/refunds',
    template,
    controller: 'Billing.controllers.Refunds',
  });

  $urlRouterProvider.when(/^\/billing\/refunds/, ($location, $state) =>
    $state.go(name),
  );
};
