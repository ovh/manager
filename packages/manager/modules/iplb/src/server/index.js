import angular from 'angular';
import '@uirouter/angularjs';

import IpLoadBalancerServerEditComponent from './iplb-server-edit.component';
import IpLoadBalancerServerService from './iplb-server.service';
import IpblServerStatusService from './iplb-server-status.service';

import OvhManagerIpLoadBalancerServerDelete from './delete';
import OvhManagerIpLoadBalancerServerPreview from './preview';
import OvhManagerIpLoadBalancerServerStatus from './status';

import routing from './iplb-server-edit.routing';

const moduleName = 'ovhManagerIplbServerEditModule';

angular
  .module(moduleName, [
    OvhManagerIpLoadBalancerServerDelete,
    OvhManagerIpLoadBalancerServerPreview,
    OvhManagerIpLoadBalancerServerStatus,
    'ui.router',
  ])
  .config(routing)
  .component('ovhManagerIplbServerEdit', IpLoadBalancerServerEditComponent)
  .service('IpLoadBalancerServerService', IpLoadBalancerServerService)
  .service('IpblServerStatusService', IpblServerStatusService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
