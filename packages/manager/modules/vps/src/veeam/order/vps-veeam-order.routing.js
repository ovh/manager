// New and legacies order views and controllers import
// VPS legacy
import legacyOrderTemplate from './legacy/vps-veeam-order-legacy.html';
import legacyOrderController from './legacy/vps-veeam-order-legacy.controller';
// VPS agora
import orderTemplate from './vps-veeam-order.html';
import orderController from './vps-veeam-order.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.veeam.order', {
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
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('vps_configuration_veeam_order_title'),
    },
  });
};
