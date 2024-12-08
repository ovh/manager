import controller from './billing-orders-main.controller';
import template from './billing-orders-main.html';

export default /* @ngInject */ ($stateProvider) => {
  const name = 'billing.orders';

  $stateProvider.state(name, {
    url: '/orders',
    static: true,
    template,
    controller,
    controllerAs: '$ctrl',
    redirectTo: `${name}.orders`,
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('orders_page_title'),

      featuresAvailabilities: /* @ngInject */ (ovhFeatureFlipping) =>
        ovhFeatureFlipping
          .checkFeatureAvailability('billing:purchasesOrder')
          .then(({ features }) => features),

      ordersSectionState: /* @ngInject */ () => 'billing.orders.orders',

      purchasesOrdersSectionState: /* @ngInject */ () =>
        'billing.orders.purchases',
    },
  });
};
