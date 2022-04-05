// New and legacies order views and controllers import
// VPS upgrade legacy
import legacyOrderTemplate from './legacy/vps-order-additional-disk-order-legacy.html';
import legacyOrderController from './legacy/vps-order-additional-disk-order-legacy.controller';
// VPS upgrade
import orderTemplate from './vps-order-additional-disk-order.html';
import orderController from './vps-order-additional-disk-order.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.additional-disk.order', {
    url: '/order',
    templateProvider: /* @ngInject */ (stateVps) =>
      stateVps.isLegacy ? legacyOrderTemplate : orderTemplate,
    controllerProvider: /* @ngInject */ (stateVps) =>
      stateVps.isLegacy ? legacyOrderController : orderController,
    controllerAs: '$ctrl',
    translations: {
      value: ['./'],
      format: 'json',
    },
    resolve: {
      goBack: /* @ngInject */ ($state) => () => $state.go('^'),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('vps_order_additionnal_disk_title'),
    },
  });
};
