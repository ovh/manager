import angular from 'angular';

import component from './component';
import routing from './routing';
import service from './service';

import list from './list';

const moduleName = 'ovhManagerOctaviaLoadBalancerPools';

angular
  .module(moduleName, [list])
  .config(routing)
  .component('octaviaLoadBalancerPools', component)
  .service('OctaviaLoadBalancerPoolsService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
