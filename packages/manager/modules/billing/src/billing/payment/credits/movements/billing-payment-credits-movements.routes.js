import controller from './billing-credits-movements.controller';
import template from './billing-credits-movements.html';

export default /* @ngInject */ ($stateProvider) => {
  const name = 'app.account.billing.payment.credits.movements';

  $stateProvider.state(name, {
    url: '/movements/:balanceName',
    template,
    controller,
    controllerAs: '$ctrl',
  });
};
