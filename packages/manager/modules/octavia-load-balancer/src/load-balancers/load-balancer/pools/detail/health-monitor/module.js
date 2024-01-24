import angular from 'angular';

import component from './component';
import routing from './routing';
import service from './service';

import create from './create';
import edit from './edit';
import deletion from './delete';

import healthMonitorComponents from './components';

const moduleName = 'ovhManagerOctaviaLoadBalancerPoolsDetailHealthMonitor';

angular
  .module(moduleName, [healthMonitorComponents, create, edit, deletion])
  .config(routing)
  .component('octaviaLoadBalancerPoolsDetailHealthMonitor', component)
  .service('OctaviaLoadBalancerHealthMonitorService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
