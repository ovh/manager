import angular from 'angular';
import '@uirouter/angularjs';

import IpLoadBalancerDashboardHeaderCtrl from '../header/iplb-dashboard-header.controller';
import IpLoadBalancerTaskService from './iplb-task.service';

import IpLoadBalancerTaskPreview from './preview';

import routing from './iplb-task.routing';
import IplbTaskComponent from './iplb-task.component';

const moduleName = 'ovhManagerIplbTask';

angular
  .module(moduleName, ['ui.router', IpLoadBalancerTaskPreview])
  .config(routing)
  .controller(
    'IpLoadBalancerDashboardHeaderCtrl',
    IpLoadBalancerDashboardHeaderCtrl,
  )
  .component('ovhManagerIplbTaskComponent', IplbTaskComponent)
  .service('IpLoadBalancerTaskService', IpLoadBalancerTaskService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
