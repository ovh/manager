import controller from './billing-orders-main.controller';
import template from './billing-orders-main.html';

export default /* @ngInject */ ($stateProvider) => {
  const name = 'app.account.billing.orders';

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
    },
  });
};
