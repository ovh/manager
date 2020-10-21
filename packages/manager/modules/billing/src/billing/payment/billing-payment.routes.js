import template from './billing-payment.html';
import controller from './billing-payment.controller';

angular.module('Billing').config(($stateProvider) => {
  const name = 'app.account.billing.payment';

  $stateProvider.state(name, {
    url: '/payment',
    static: true,
    template,
    controller,
    controllerAs: '$ctrl',
    translations: { value: ['./'], format: 'json' },
    redirectTo: `${name}.method`,
  });
});
