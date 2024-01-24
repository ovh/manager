import angular from 'angular';

import component from './component';
import routing from './routing';
import service from './service';

import create from './create';
import edit from './edit';

import healthMonitorComponents from './components';

const moduleName = 'ovhManagerOctaviaLoadBalancerPoolsDetailHealthMonitor';

angular
  .module(moduleName, [healthMonitorComponents, create, edit])
  .config(routing)
  .component('octaviaLoadBalancerPoolsDetailHealthMonitor', component)
  .service('OctaviaLoadBalancerHealthMonitorService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
