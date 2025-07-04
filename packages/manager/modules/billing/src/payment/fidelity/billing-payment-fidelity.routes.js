export default /* @ngInject */ (
  $stateProvider,
  $urlRouterProvider,
  coreConfigProvider,
) => {
  if (coreConfigProvider.isRegion('EU')) {
    const name = 'billing.payment.fidelity';

    $stateProvider.state(name, {
      url: '/fidelity',
      component: 'billingFidelityComponent',
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('billing_payment_fidelity'),
      },
    });
  }
};
