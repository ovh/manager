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
        .state('network.iplb.detail.server-farm', {
          url: '/serverfarm',
          redirectTo: 'network.iplb.detail.server-farm.home',
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
            value: ['.', '../server'],
            format: 'json',
          },
        })
        .state('network.iplb.detail.server-farm.home', {
          url: '/',
          views: {
            iplbFarms: {
              template: IplbServerFormTemplate,
              controller: 'IpLoadBalancerServerFarmCtrl',
              controllerAs: 'ctrl',
            },
          },
        })
        .state('network.iplb.detail.server-farm.add', {
          url: '/add',
          views: {
            iplbFarms: {
              template: IplbServerFormEditTemplate,
              controller: 'IpLoadBalancerServerFarmEditCtrl',
              controllerAs: 'ctrl',
            },
          },
        })
        .state('network.iplb.detail.server-farm.update', {
          url: '/:farmId',
          views: {
            iplbFarms: {
              template: IplbServerFormEditTemplate,
              controller: 'IpLoadBalancerServerFarmEditCtrl',
              controllerAs: 'ctrl',
            },
          },
        })
        .state('network.iplb.detail.server-farm.server-add', {
          url: '/:farmId/server/add',
          views: {
            iplbFarms: {
              template: IplbServerEditTemplate,
              controller: 'IpLoadBalancerServerEditCtrl',
              controllerAs: 'ctrl',
            },
          },
        })
        .state('network.iplb.detail.server-farm.server-update', {
          url: '/:farmId/server/:serverId',
          views: {
            iplbFarms: {
              template: IplbServerEditTemplate,
              controller: 'IpLoadBalancerServerEditCtrl',
              controllerAs: 'ctrl',
            },
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
