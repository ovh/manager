import vpsHeaderComponent from '../header/vps-header.component';

// New and legacies order views and controllers import
// VPS upgrade legacy
import legacyOrderTemplate from './legacy/vps-upgrade-legacy.html';
import legacyOrderController from './legacy/vps-upgrade-legacy.controller';
// VPS upgrade
import orderTemplate from './vps-upgrade.html';
import orderController from './vps-upgrade.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.upgrade', {
    url: '/upgrade',
    views: {
      'vpsHeader@vps': {
        component: vpsHeaderComponent.name,
      },
      'vpsContent@vps.detail': {
        templateProvider: /* @ngInject */ (stateVps) =>
          stateVps.isLegacy ? legacyOrderTemplate : orderTemplate,
        controllerProvider: /* @ngInject */ (stateVps) =>
          stateVps.isLegacy ? legacyOrderController : orderController,
        controllerAs: '$ctrl',
      },
    },
    resolve: {
      getRebootLink: /* @ngInject */ ($state) => () =>
        $state.href('vps.detail.dashboard.reboot'),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('vps_configuration_upgradevps_title'),
    },
  });
};
