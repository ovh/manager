// New and legacies order views and controllers import
// VPS upgrade legacy
import legacyOrderTemplate from './legacy/vps-snapshot-order-legacy.html';
import legacyOrderController from './legacy/vps-snapshot-order-legacy.controller';
// VPS upgrade
import orderTemplate from './vps-snapshot-order.html';
import orderController from './vps-snapshot-order.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.snapshot.order', {
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
        $translate.instant('vps_configuration_activate_snapshot_title'),
    },
  });
};
