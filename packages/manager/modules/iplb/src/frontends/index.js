import angular from 'angular';
import '@uirouter/angularjs';

import IpLoadBalancerFrontendComponent from './iplb-frontends.component';

import IpLoadBalancerDashboardHeaderCtrl from '../header/iplb-dashboard-header.controller';

import IpLoadBalancerFrontendsService from './iplb-frontends.service';

import OvhManagerIpLoadBalancerFrontendDelete from './delete';
import OvhManagerIpLoadBalancerFrontendEdit from './edit';
import OvhManagerIpLoadBalancerFrontendPreview from './preview';

import routing from './iplb-frontends.routing';

const moduleName = 'ovhManagerIplbFrontends';

angular
  .module(moduleName, [
    'ui.router',
    OvhManagerIpLoadBalancerFrontendDelete,
    OvhManagerIpLoadBalancerFrontendEdit,
    OvhManagerIpLoadBalancerFrontendPreview,
  ])
  .config(routing)
  .component('ovhManagerIplbFrontendsComponent', IpLoadBalancerFrontendComponent)
  .controller('IpLoadBalancerDashboardHeaderCtrl', IpLoadBalancerDashboardHeaderCtrl)
  .service('IpLoadBalancerFrontendsService', IpLoadBalancerFrontendsService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
