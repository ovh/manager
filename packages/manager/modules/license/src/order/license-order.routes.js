import template from './license-order.html';
import controller from './license-order.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('license.order', {
    url: '/order',
    template,
    controller,
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('license_order'),
    },
  });
};
