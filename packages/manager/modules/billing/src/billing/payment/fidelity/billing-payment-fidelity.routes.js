import template from './billing-fidelity.html';

export default /* @ngInject */ (
  $stateProvider,
  $urlRouterProvider,
  coreConfigProvider,
) => {
  if (coreConfigProvider.getRegion() === 'EU') {
    const name = 'app.account.billing.payment.fidelity';

    $stateProvider.state(name, {
      url: '/fidelity',
      template,
      controller: 'Billing.controllers.Fidelity',
    });

    $urlRouterProvider.when(/^\/billing\/fidelity/, ($location, $state) =>
      $state.go(name),
    );
  }
};
