import controller from './billing-commitment-entry.controller';
import template from './billing-commitment-entry.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('billing.commitment', {
    url: '/commitment/:orderId?ordersFilter',
    template,
    controller,
    controllerAs: '$ctrl',
    translations: { value: ['./translations'], format: 'json' },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('commitment_entry_title'),
      orderId: /* @ngInject */ ($transition$) => $transition$.params().orderId,
      ordersFilter: /* @ngInject */ ($transition$) =>
        $transition$.params().ordersFilter,
    },
  });
};
