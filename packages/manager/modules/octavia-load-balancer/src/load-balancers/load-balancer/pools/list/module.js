import angular from 'angular';

import component from './component';
import routing from './routing';
import deletion from './delete';

const moduleName = 'ovhManagerOctaviaLoadBalancerPoolsList';

angular
  .module(moduleName, [deletion])
  .config(routing)
  .component('octaviaLoadBalancerPoolsList', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
