import IpblServerStatusController from '../server/iplb-server-status.controller';
import IpblServerStatusService from '../server/iplb-server-status.service';
import IpLoadBalancerDashboardHeaderCtrl from '../header/iplb-dashboard-header.controller';
import IpLoadBalancerServerDeleteCtrl from '../server/delete/iplb-server-delete.controller';
import IpLoadBalancerServerEditCtrl from '../server/iplb-server-edit.controller';
import IpLoadBalancerServerFarmCtrl from './iplb-server-farm.controller';
import IpLoadBalancerServerFarmDeleteCtrl from './delete/iplb-server-farm-delete.controller';
import IpLoadBalancerServerFarmEditCtrl from './iplb-server-farm-edit.controller';
import IpLoadBalancerServerFarmPreviewCtrl from './preview/iplb-server-farm-preview.controller';
import IpLoadBalancerServerFarmProbeEditCtrl from './probe/iplb-server-farm-probe.controller';
import IpLoadBalancerServerFarmService from './iplb-server-farm.service';
import IpLoadBalancerServerPreviewCtrl from '../server/preview/iplb-server-preview.controller';
import IpLoadBalancerServerService from '../server/iplb-server.service';
import IpLoadBalancerServerStatusDetailCtrl from '../server/status/iplb-server-status-detail.controller';

import IplbHeaderTemplate from '../header/iplb-dashboard-header.html';
import IplbServerEditTemplate from '../server/iplb-server-edit.html';
import IplbServerFormEditTemplate from './iplb-server-farm-edit.html';
import IplbServerFormTemplate from './iplb-server-farm.html';

const moduleName = 'ovhManagerIplbServerForm';

angular
  .module(moduleName, ['ui.router'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider
        .state('iplb.detail.server-farm', {
          url: '/serverfarm',
          redirectTo: 'iplb.detail.server-farm.home',
          views: {
            iplbHeader: {
              template: IplbHeaderTemplate,
              controller: 'IpLoadBalancerDashboardHeaderCtrl',
              controllerAs: 'ctrl',
            },
            iplbContent: {
              template: '<div data-ui-view="iplbFarms"><div>',
            },
          },
          translations: {
            value: ['../server'],
            format: 'json',
          },
          resolve: {
            breadcrumb: /* @ngInject */ ($translate) =>
              $translate.instant('iplb_farm_title'),
          },
        })
        .state('iplb.detail.server-farm.home', {
          url: '',
          views: {
            iplbFarms: {
              template: IplbServerFormTemplate,
              controller: 'IpLoadBalancerServerFarmCtrl',
              controllerAs: 'ctrl',
            },
          },
          resolve: {
            breadcrumb: () => null,
          },
        })
        .state('iplb.detail.server-farm.add', {
          url: '/add',
          views: {
            iplbFarms: {
              template: IplbServerFormEditTemplate,
              controller: 'IpLoadBalancerServerFarmEditCtrl',
              controllerAs: 'ctrl',
            },
          },
          resolve: {
            breadcrumb: /* @ngInject */ ($translate) =>
              $translate.instant('iplb_farm_add'),
          },
        })
        .state('iplb.detail.server-farm.dashboard', {
          url: '/:farmId',
          redirectTo: 'iplb.detail.server-farm',
          views: {
            iplbFarms: {
              template: '<div ui-view></div>',
            },
          },
          resolve: {
            farmId: /* @ngInject */ ($transition$) =>
              $transition$.params().farmId,
            breadcrumb: /* @ngInject */ (farmId) => farmId,
          },
        })
        .state('iplb.detail.server-farm.dashboard.update', {
          url: '/update',
          template: IplbServerFormEditTemplate,
          controller: 'IpLoadBalancerServerFarmEditCtrl',
          controllerAs: 'ctrl',
          resolve: {
            breadcrumb: /* @ngInject */ ($translate) =>
              $translate.instant('iplb_farm_update_title'),
          },
        })
        .state('iplb.detail.server-farm.dashboard.server', {
          url: '/server',
          redirectTo: 'iplb.detail.server-farm.dashboard',
          template: '<div ui-view></div>',
          resolve: {
            breadcrumb: /* @ngInject */ ($translate) =>
              $translate.instant('iplb_farm_server_list_col_server'),
          },
        })
        .state('iplb.detail.server-farm.dashboard.server.add', {
          url: '/add',
          template: IplbServerEditTemplate,
          controller: 'IpLoadBalancerServerEditCtrl',
          controllerAs: 'ctrl',
          resolve: {
            breadcrumb: /* @ngInject */ ($translate) =>
              $translate.instant('iplb_farm_add_server'),
          },
        })
        .state('iplb.detail.server-farm.dashboard.server.dashboard', {
          url: '/:serverId',
          redirectTo: 'iplb.detail.server-farm.dashboard.server',
          template: '<div ui-view></div>',
          resolve: {
            serverId: /* @ngInject */ ($transition$) =>
              $transition$.params().serverId,
            breadcrumb: /* @ngInject */ (serverId) => serverId,
          },
        })
        .state('iplb.detail.server-farm.dashboard.server.dashboard.update', {
          url: '/update',
          template: IplbServerEditTemplate,
          controller: 'IpLoadBalancerServerEditCtrl',
          controllerAs: 'ctrl',
          resolve: {
            breadcrumb: /* @ngInject */ ($translate) =>
              $translate.instant('iplb_farm_edit_server_breadcrumb'),
          },
        });
    },
  )
  .controller(
    'IpLoadBalancerDashboardHeaderCtrl',
    IpLoadBalancerDashboardHeaderCtrl,
  )
  .controller('IpLoadBalancerServerFarmCtrl', IpLoadBalancerServerFarmCtrl)
  .controller(
    'IpLoadBalancerServerFarmEditCtrl',
    IpLoadBalancerServerFarmEditCtrl,
  )
  .controller(
    'IpLoadBalancerServerFarmProbeEditCtrl',
    IpLoadBalancerServerFarmProbeEditCtrl,
  )
  .controller(
    'IpLoadBalancerServerFarmPreviewCtrl',
    IpLoadBalancerServerFarmPreviewCtrl,
  )
  .controller(
    'IpLoadBalancerServerFarmDeleteCtrl',
    IpLoadBalancerServerFarmDeleteCtrl,
  )
  .service('IpLoadBalancerServerFarmService', IpLoadBalancerServerFarmService)
  .service('IpLoadBalancerServerService', IpLoadBalancerServerService)
  .service('IpblServerStatusService', IpblServerStatusService)
  .controller('IpLoadBalancerServerEditCtrl', IpLoadBalancerServerEditCtrl)
  .controller(
    'IpLoadBalancerServerStatusDetailCtrl',
    IpLoadBalancerServerStatusDetailCtrl,
  )
  .controller(
    'IpLoadBalancerServerPreviewCtrl',
    IpLoadBalancerServerPreviewCtrl,
  )
  .controller('IpLoadBalancerServerDeleteCtrl', IpLoadBalancerServerDeleteCtrl)
  .component('iplbServerStatus', {
    template: `
            <span class="oui-badge" data-ng-class="'oui-badge_'+$ctrl.iconType" data-ng-bind="$ctrl.iconType"></span>
        `,
    controller: IpblServerStatusController,
    bindings: {
      server: '<',
    },
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
