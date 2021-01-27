import controller from './billing-credits-movements.controller';
import template from './billing-credits-movements.html';

export default /* @ngInject */ ($stateProvider, $urlServiceProvider) => {
  const name = 'app.account.billing.payment.credits.movements';

  $stateProvider.state(name, {
    url: '/:balanceName',
    template,
    controller,
    controllerAs: '$ctrl',
    resolve: {
      balanceName: /* @ngInject */ ($transition$) =>
        $transition$.params().balanceName,
      breadcrumb: /* @ngInject */ (balanceName) => balanceName,
    },
  });

  $urlServiceProvider.rules.when(
    '/billing/payment/credits/movements/:name',
    '/billing/payment/credits/:name',
  );
};
