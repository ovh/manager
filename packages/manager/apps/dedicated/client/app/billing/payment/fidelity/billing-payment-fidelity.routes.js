import controller from './billing-fidelity.controller';
import template from './billing-fidelity.html';

export default /* @ngInject */ (
  $stateProvider,
  $urlRouterProvider,
  coreConfigProvider,
) => {
  if (coreConfigProvider.isRegion('EU')) {
    const name = 'app.account.billing.payment.fidelity';

    $stateProvider.state(name, {
      url: '/fidelity',
      template,
      controller,
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('billing_payment_fidelity'),
      },
    });

    $urlRouterProvider.when(/^\/billing\/fidelity/, ($location, $state) =>
      $state.go(name),
    );
  }
};
