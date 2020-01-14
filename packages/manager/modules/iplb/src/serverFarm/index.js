import angular from 'angular';
import '@uirouter/angularjs';

import IpblServerStatusController from '../server/iplb-server-status.controller';
import IpLoadBalancerDashboardHeaderCtrl from '../header/iplb-dashboard-header.controller';

import IpLoadBalancerServerFarmService from './iplb-server-farm.service';
import IpLoadBalancerServerService from '../server/iplb-server.service';

import IplbServerFarmComponent from './iplb-server-farm.component';
import routing from './iplb-server-farm.routing';

import IpLoadBalancerServerFarmDelete from './delete';
import IpLoadBalancerServerFarmAddUpdate from './add-update';
import IpLoadBalancerServerFarmPreview from './preview';
import IpLoadBalancerServerFarmProbe from './probe';
import IpLoadBalancerServer from '../server';

const moduleName = 'ovhManagerIplbServerFormModule';

angular
  .module(moduleName, [
    IpLoadBalancerServer,
    IpLoadBalancerServerFarmDelete,
    IpLoadBalancerServerFarmAddUpdate,
    IpLoadBalancerServerFarmPreview,
    IpLoadBalancerServerFarmProbe,
    'ui.router',
  ])
  .config(routing)
  .component('ovhManagerIplbServerFarmComponent', IplbServerFarmComponent)
  .controller(
    'IpLoadBalancerDashboardHeaderCtrl',
    IpLoadBalancerDashboardHeaderCtrl,
  )
  .service('IpLoadBalancerServerFarmService', IpLoadBalancerServerFarmService)
  .service('IpLoadBalancerServerService', IpLoadBalancerServerService)
  .component('iplbServerStatus', {
    template: `
            <span class="oui-status" data-ng-class="'oui-status_'+$ctrl.iconType" data-ng-bind="$ctrl.iconType"></span>
        `,
    controller: IpblServerStatusController,
    bindings: {
      server: '<',
    },
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
